import { Account, Nature, levelFromCode, parentCodeOf } from '../domain/account.entity.js';
import { AccountRepository } from '../domain/account.repository.js';
import { DomainError } from '../domain/account.errors.js';

export interface CreateAccountInput {
  code: string;
  name: string;
  nature?: Nature;
}

export class CreateAccountUseCase {
  constructor(private readonly repo: AccountRepository) {}

  async execute(input: CreateAccountInput): Promise<Account> {
    const code = (input.code ?? '').trim();
    const name = (input.name ?? '').trim();

    if (!/^\d+$/.test(code))
      throw new DomainError('code', 'El código debe ser numérico', 'validation');
    const level = levelFromCode(code);
    if (!level)
      throw new DomainError('code', 'El código debe tener 1, 2, 4 o 6 dígitos', 'validation');
    if (!name)
      throw new DomainError('name', 'El nombre es obligatorio', 'validation');
    if (await this.repo.findByCode(code))
      throw new DomainError('code', 'Ya existe una cuenta con ese código', 'conflict');

    const parentCode = parentCodeOf(code);
    let nature = input.nature;
    if (parentCode) {
      const parent = await this.repo.findByCode(parentCode);
      if (!parent)
        throw new DomainError('code', `No existe la cuenta padre ${parentCode}`, 'validation');
      nature = parent.nature; // se hereda, no se confía en el cliente
    } else if (nature !== 'DEBIT' && nature !== 'CREDIT') {
      throw new DomainError('nature', 'La clase requiere naturaleza (DEBIT o CREDIT)', 'validation');
    }

    const account: Account = { code, name, level, nature: nature!, parentCode };
    await this.repo.save(account);
    return account;
  }
}