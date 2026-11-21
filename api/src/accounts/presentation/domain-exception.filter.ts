import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DomainError } from '../domain/account.errors.js';

const STATUS = { validation: 400, conflict: 409, not_found: 404 } as const;

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    host.switchToHttp().getResponse().status(STATUS[error.kind]).json({
      field: error.field,
      message: error.message,
    });
  }
}