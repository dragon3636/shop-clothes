import { execSync } from 'child_process';
import { join } from 'path';
import { upAll, exec, config, down } from 'docker-compose';
import isPortReachable from 'is-port-reachable';
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, "..", ".env.test") });

const options = {
  cwd: join(__dirname, ".."),
  log: true,
  config: 'docker-compose.dev.yml'
};

let teardownHappened = false

export async function setup() {
  console.time('global-setup');

  const isDBReachable = await isPortReachable(process.env.POSTGRES_PORT, { host: process.env.POSTGRES_HOST });
  // 1
  if (isDBReachable) {
    console.log('DB already started');
  } else {
    console.log('\nStarting up dependencies please wait...\n');
    // 2
    await upAll(options);

    await exec('postgres', ['sh', '-c', 'until pg_isready ; do sleep 1; done'], {
      cwd: join(__dirname)
    });
    // // 3
    // console.log('Running migrations...');
    // execSync('npx sequelize db:migrate');

    // // 4
    // console.log('Seeding the db...');
    // execSync('npx sequelize db:seed:all');
  }

  console.timeEnd('global-setup');
};

export async function teardown() {
  teardownHappened = true;
  console.time('global-teardown');
  await down({
    commandOptions: ['--remove-orphans'],
    ...options
  });
  console.timeEnd('global-teardown');
}