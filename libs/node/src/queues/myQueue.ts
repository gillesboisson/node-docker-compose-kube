import BeeQueue, { Job } from 'bee-queue';
import { getQueue, registerQueue } from './queues';

export interface MyQueueParam {
  a: number;
  b: number;
}

export type MyQueueResult = number;

const queueName = 'MY_QUEUE';

declare module './types' {
  interface AppQueues {
    [queueName]: BeeQueue<MyQueueParam>;
  }
}

registerQueue({
  name: queueName,
  process: async (job: Job<MyQueueParam>) => {
    console.log(`Processing job ${job.id}`);
    return job.data.a + job.data.b;
  },
});

export function doMyQueueJob(a: number, b: number): Promise<Job<MyQueueParam>> {
  return getQueue(queueName).createJob({ a, b }).save();
}
