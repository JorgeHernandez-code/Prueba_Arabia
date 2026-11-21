import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateAccountUseCase } from '../application/create-account.use-case.js';
import type { CreateAccountInput } from '../application/create-account.use-case.js'; 
import { GetCatalogTreeUseCase } from '../application/get-catalog-tree.use-case.js';
import { DeleteAccountUseCase } from '../application/delete-account.use-case.js';


@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly createAccount: CreateAccountUseCase,
    private readonly getTree: GetCatalogTreeUseCase,
    private readonly deleteAccount: DeleteAccountUseCase,
  ) {}

  @Post() create(@Body() body: CreateAccountInput) { return this.createAccount.execute(body); }
  @Get('tree') tree() { return this.getTree.execute(); }
  @Delete(':code') @HttpCode(204) remove(@Param('code') code: string) { return this.deleteAccount.execute(code); }
}