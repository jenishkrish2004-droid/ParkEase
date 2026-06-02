import { AppError } from './AppError';

export class ValidationError extends AppError {
  public readonly details: Array<{ field: string; message: string }>;

  constructor(message: string = 'Validation failed', details: Array<{ field: string; message: string }> = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}
