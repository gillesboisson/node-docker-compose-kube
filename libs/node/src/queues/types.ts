import BeeQueue, { DoneCallback, Job } from 'bee-queue';



// factory return type
export interface AppQueues {}


export type AppQueueName = keyof AppQueues;
export type AppQueueSettings<ParamT = object, ResultT = object> = {
  name: AppQueueName;
  process: (job: Job<ParamT>, done: DoneCallback<ResultT>) => Promise<ResultT> | void;
  factory?: (queueName: AppQueueName, isWorker: boolean) => BeeQueue<ParamT>;
};

export type AppQueueType<NameT extends AppQueueName> = AppQueues[NameT];

