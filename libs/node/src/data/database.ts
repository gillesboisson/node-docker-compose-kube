import { Sequelize } from 'sequelize';

import config from '../config/database';


export const database = new Sequelize(config.database, config.username, config.password, {
  dialect: 'postgres',
  host: config.host,
  port: config.port,
});

export async function syncDatabase(force = false) {
  await database.sync({ force });
}
