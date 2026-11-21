import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AccountsController } from './presentation/accounts.controller.js';
import { DomainExceptionFilter } from './presentation/domain-exception.filter.js';
import { ACCOUNT_REPOSITORY, AccountRepository } from './domain/account.repository.js';
import { InMemoryAccountRepository } from './infrastructure/in-memory-account.repository.js';
import { CreateAccountUseCase } from './application/create-account.use-case.js';
import { GetCatalogTreeUseCase } from './application/get-catalog-tree.use-case.js';
import { DeleteAccountUseCase } from './application/delete-account.use-case.js';

const useCase = (Cls: new (repo: AccountRepository) => unknown) => ({
  provide: Cls,
  useFactory: (repo: AccountRepository) => new Cls(repo),
  inject: [ACCOUNT_REPOSITORY],
});

@Module({
  controllers: [AccountsController],
  providers: [
    { provide: ACCOUNT_REPOSITORY, useClass: InMemoryAccountRepository },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    useCase(CreateAccountUseCase),
    useCase(GetCatalogTreeUseCase),
    useCase(DeleteAccountUseCase),
  ],
})
export class AccountsModule {}