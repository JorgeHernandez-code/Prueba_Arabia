export type Nature = 'DEBIT' | 'CREDIT';
export type Level = 'CLASS' | 'GROUP' | 'ACCOUNT' | 'SUBACCOUNT';

export interface AccountNode {
  code: string;
  name: string;
  level: Level;
  nature: Nature;
  parentCode: string | null;
  children: AccountNode[];
}

export interface CreateAccountInput {
  code: string;
  name: string;
  nature?: Nature;
}