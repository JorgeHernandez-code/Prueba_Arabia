import { Account } from '../domain/account.entity.js';
import { AccountRepository } from '../domain/account.repository.js';

export interface AccountNode extends Account {
  children: AccountNode[];
}

export class GetCatalogTreeUseCase {
  constructor(private readonly repo: AccountRepository) {}

  async execute(): Promise<AccountNode[]> {
    const all = (await this.repo.findAll()).sort((a, b) => a.code.localeCompare(b.code));
    const nodes = new Map<string, AccountNode>();
    all.forEach((a) => nodes.set(a.code, { ...a, children: [] }));
    const roots: AccountNode[] = [];
    nodes.forEach((node) => {
      const parent = node.parentCode ? nodes.get(node.parentCode) : null;
      (parent ? parent.children : roots).push(node);
    });
    return roots;
  }
}