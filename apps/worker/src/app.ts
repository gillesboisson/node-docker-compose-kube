const workers = process.env.APP_WORKERS?.split(/[ ,]/) || [];


import {getQueue} from '@noderefresh/node';

console.log('workers',workers);

workers.forEach((workerName) => {
    console.log(`Starting worker |${workerName}|`);
    getQueue(workerName, true);
});