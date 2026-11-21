import { AccountRepository } from '../domain/account.repository.js';
import { DomainError } from '../domain/account.errors.js';

export class DeleteAccountUseCase {
  constructor(private readonly repo: AccountRepository) {}

  async execute(code: string): Promise<void> {
    if (!(await this.repo.findByCode(code)))
      throw new DomainError('code', 'La cuenta no existe', 'not_found');
    if (await this.repo.hasChildren(code))
      throw new DomainError('code', 'No se puede eliminar: la cuenta tiene cuentas hijas', 'conflict');
    await this.repo.delete(code);
  }
}