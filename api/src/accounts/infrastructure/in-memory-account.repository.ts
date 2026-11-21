import { Account } from '../domain/account.entity.js';
import { AccountRepository } from '../domain/account.repository.js';

export class InMemoryAccountRepository implements AccountRepository {
  private readonly items = new Map<string, Account>();

  constructor() {
    const seed: Account[] = [
      { code: '1', name: 'Activo', level: 'CLASS', nature: 'DEBIT', parentCode: null },
      { code: '11', name: 'Disponible', level: 'GROUP', nature: 'DEBIT', parentCode: '1' },
      { code: '1105', name: 'Caja', level: 'ACCOUNT', nature: 'DEBIT', parentCode: '11' },
      { code: '110505', name: 'Caja general', level: 'SUBACCOUNT', nature: 'DEBIT', parentCode: '1105' },
      { code: '2', name: 'Pasivo', level: 'CLASS', nature: 'CREDIT', parentCode: null },
      { code: '21', name: 'Obligaciones financieras', level: 'GROUP', nature: 'CREDIT', parentCode: '2' },
    ];
    seed.forEach((a) => this.items.set(a.code, a));
  }

  async findByCode(code: string) { return this.items.get(code) ?? null; }
  async findAll() { return [...this.items.values()]; }
  async hasChildren(code: string) {
    return [...this.items.values()].some((a) => a.parentCode === code);
  }
  async save(account: Account) { this.items.set(account.code, account); }
  async delete(code: string) { this.items.delete(code); }
}