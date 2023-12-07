import { Request, Response } from 'express';
import { ValidationError } from 'jsonschema';
import { ValidationError as SequelizeValidationError, ValidationErrorItem } from 'sequelize';

export abstract class BaseAppError extends Error {
  readonly isAppError = true;

  constructor(readonly status: number, readonly errorType: string, message?: string, readonly originalErr?: Error) {
    super(message ? message : originalErr?.message);
  }

  errorJson(req: Request): object {
    const { body, params, query } = req;
    const { errorType, originalErr, message } = this;

    return {
      req: {
        body,
        params,
        query,
      },
      errorType,
      message,
      originalErr,
    };
  }

  handleExpressResponse(req: Request, res: Response) {
    const data = this.errorJson(req);
    res.status(this.status).json(data);
  }
}

export class AppError extends BaseAppError {}
export class DBError extends BaseAppError {
  constructor(err: Error, message?: string) {
    super(500, 'db', message, err);
  }
}

export class NotFoundError extends BaseAppError {
  constructor(readonly query: unknown, message?: string) {
    super(404, 'not_found', message);
  }

  errorJson(req: Request): object {
    return {
      ...super.errorJson(req),
      query: this.query,
    };
  }
}

class AppValidationError<ErrorT> extends BaseAppError {
  constructor(readonly validationErrors: ErrorT[], readonly errorType: string, message?: string) {
    super(400, errorType, message);
  }

  errorJson(req: Request): object {
    return {
      ...super.errorJson(req),
      errors: this.validationErrors,
    };
  }
}

export class AppJSONSchemaValidationError extends AppValidationError<ValidationError> {
  constructor(validationErrors: ValidationError[], message?: string) {
    super(validationErrors, 'json_schema_not_valid', message);
  }
}

export class AppSequelizeValidationError extends AppValidationError<ValidationErrorItem> {
  constructor(sequelizationValidation: SequelizeValidationError, message?: string) {
    super(sequelizationValidation.errors, 'sequelize_not_valid', message);
  }
}
