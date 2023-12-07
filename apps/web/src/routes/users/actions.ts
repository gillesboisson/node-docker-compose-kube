import { validateRequest, createUserSchema, createUser, UserCreate, getUsers } from '@noderefresh/node';
import { NextFunction, Request, Response } from 'express';


export function create(req: Request, res: Response, next: NextFunction): void {
  validateRequest(req, createUserSchema)
    .then(({ data }) => createUser(data as UserCreate).then((data) => res.json(data)))
    .catch((err) => {
      next(err);
    });
}

export function index(req: Request, res: Response, next: NextFunction): void {
  getUsers()
    .then(([data]) => res.json(data))
    .catch(next);
}