import { BaseAppError, AppSequelizeValidationError } from '@noderefresh/node';
import { Request, Response } from 'express';
import { ValidationError as SequelizeValidationError } from 'sequelize';

export function errorHandler(err: Error | BaseAppError | SequelizeValidationError, req: Request, res: Response): void {
  if ((err as BaseAppError).handleExpressResponse) {
    (err as BaseAppError).handleExpressResponse(req, res);
  } else if (err instanceof SequelizeValidationError) {
    new AppSequelizeValidationError(err).handleExpressResponse(req, res);
  } else {
    console.log('res',res);
    res.status(500).json(err);
  }
}
