import { Application } from 'express';

import { errorHandler } from './errors';

export function configureAfterMiddlewares(app: Application) {
  app.use(errorHandler);
}
