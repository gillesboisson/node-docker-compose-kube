import BeeQueue from 'bee-queue';
import redis from 'redis';
import redisConfig from '../config/redis';
import { AppQueueName, AppQueueSettings, AppQueueType, AppQueues } from './types';

function createRedisClient() {
  return redis.createClient({
    url: redisConfig.url,
  });
}

let sharedRedis: object | null = null;

export function createQueue<DataT>(
  name: AppQueueName,
  useSharedRedis = true,
  isWorker = false,
  config?: BeeQueue.QueueSettings,
) {
  let redis: object | null = null;

  if (useSharedRedis) {
    if (!sharedRedis) {
      sharedRedis = createRedisClient();
    }
    redis = sharedRedis;
  } else {
    redis = createRedisClient();
  }

  return new BeeQueue<DataT>(name, { ...config, isWorker, redis });
}

const cachedQueues: Partial<AppQueues> = {};
const queueSettings: Partial<Record<AppQueueName, AppQueueSettings>> = {};

export function getQueue<NameT extends AppQueueName = AppQueueName>(
  name: NameT,
  asWorker = false,
  forceCreate = false,
): AppQueueType<NameT> {
  if (!cachedQueues[name] || forceCreate) {
    if (!queueSettings[name]) {
      throw new Error(`Queue ${name} not registered`);
    }

    const settings = queueSettings[name]!;

    let queue: BeeQueue | null = null;

    if (settings.factory) {
      queue = settings.factory(name, asWorker);
    } else {
      queue = createQueue(name, true, asWorker);
    }

    if (asWorker) {
      queue.process(settings.process);
    }

    if (!forceCreate) {
      cachedQueues[name] = queue;
    }

    return queue as AppQueueType<NameT>;
  }

  return cachedQueues[name] as AppQueueType<NameT>;
}

export function registerQueue<ParamT = object, ResultT = object>(settings: AppQueueSettings<ParamT, ResultT>) {
  if (queueSettings[settings.name]) {
    throw new Error(`Queue ${name} already registered`);
  }

  queueSettings[settings.name] = settings as AppQueueSettings;
  console.log('queueSettings',queueSettings);
}

export function startQueueWorkers(...names: AppQueueName[]) {
  return names.map((n) => getQueue(n, true));
}
