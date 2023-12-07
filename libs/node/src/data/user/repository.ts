import { database } from '../database';
import { User } from './model';
import { UserCreate } from './types';

export async function createUser(user: UserCreate) {
  return await User.create({
    name: user.name,
    email: user.email,
    password: user.password || '123456',
  });
}

export async function getUsers() {
  return await database.query(`SELECT name, email, "updatedAt", "createdAt" FROM "${User.tableName}"`);
}
