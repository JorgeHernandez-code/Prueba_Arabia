import { apiUrl } from '../../api';
import type { AccountNode, CreateAccountInput } from './types';

export class ApiError extends Error {
  field: string;
  status: number;
  constructor(field: string, message: string, status: number) {
    super(message);
    this.field = field;
    this.status = status;
  }
}

async function handle(res: Response) {
  if (res.ok) return res.status === 204 ? null : res.json();
  const body = await res.json().catch(() => null);
  throw new ApiError(body?.field ?? 'form', body?.message ?? 'Error inesperado', res.status);
}

export const fetchTree = (): Promise<AccountNode[]> =>
  fetch(apiUrl('/accounts/tree')).then(handle);

export const createAccount = (input: CreateAccountInput) =>
  fetch(apiUrl('/accounts'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then(handle);

export const deleteAccount = (code: string) =>
  fetch(apiUrl(`/accounts/${code}`), { method: 'DELETE' }).then(handle);