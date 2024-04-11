
import cluster from 'cluster';
import { availableParallelism } from 'os';
import process from 'process';

const numCPUs = availableParallelism();
export function runInCluster(
  bootstrap: () => Promise<void>
) {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < 4; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    bootstrap()
  }
  console.log(`Worker ${process.pid} started`);
}