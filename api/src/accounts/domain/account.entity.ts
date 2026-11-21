export type Nature = 'DEBIT' | 'CREDIT';
export type Level = 'CLASS' | 'GROUP' | 'ACCOUNT' | 'SUBACCOUNT';

export interface Account {
  code: string;
  name: string;
  level: Level;
  nature: Nature;
  parentCode: string | null;
}

const LEVEL_BY_LENGTH: Record<number, Level> = {
  1: 'CLASS',
  2: 'GROUP',
  4: 'ACCOUNT',
  6: 'SUBACCOUNT',
};

export function levelFromCode(code: string): Level | null {
  return LEVEL_BY_LENGTH[code.length] ?? null;
}

export function parentCodeOf(code: string): string | null {
  switch (code.length) {
    case 2: return code.slice(0, 1);
    case 4: return code.slice(0, 2);
    case 6: return code.slice(0, 4);
    default: return null;
  }
}