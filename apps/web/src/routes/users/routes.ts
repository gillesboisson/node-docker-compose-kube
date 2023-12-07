import { Application } from 'express';
import { create, index } from './actions';

import { doMyQueueJob } from '@noderefresh/node';

export default function configure(app: Application): void {
  app.post('/users', create);
  app.get('/users', index);

  app.get('/my-queue', (req, res) => {
    const a = parseInt(req.query.a as string, 10);
    const b = parseInt(req.query.b as string, 10);

    if (isNaN(a) || isNaN(b)) {
      res.status(400).json({ error: 'Invalid params' });
      return;
    }

    doMyQueueJob(a, b).then((result) => {
      res.json({ ok: true, result });
    });

  });
}
