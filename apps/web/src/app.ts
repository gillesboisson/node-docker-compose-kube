import express from 'express';
import { syncDatabase } from '@noderefresh/node';
import bodyParser from 'body-parser';
import { configureRoutes } from './routes';
import { configureAfterMiddlewares } from './middlewares';

const app = express();
const port = 3000;

Promise.all([syncDatabase()])
  .then(() => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    configureRoutes(app);
    configureAfterMiddlewares(app);
    

    app.listen(port, () => {
      console.log(`WWExpress is listening at http://localhost:${port}`);
    });
  })  
  .catch((err) => {
    console.error(err);
  });

