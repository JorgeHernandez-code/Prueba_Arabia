export type ErrorKind = 'validation' | 'conflict' | 'not_found';

export class DomainError extends Error {
  constructor(
    public readonly field: string,
    message: string,
    public readonly kind: ErrorKind,
  ) {
    super(message);
  }
}