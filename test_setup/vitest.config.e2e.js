/* eslint-disable import/first */
import * as dotenv from 'dotenv'
import { join } from 'path';
dotenv.config({
  path: join(__dirname, "..", ".env.test")
})
// import { DB_ENV } from '@utils/testUtils/mockData';

process.env.ENVIRONMENT_NAME = 'test';
beforeEach(() => {
  process.env = { ...process.env, ENVIRONMENT_NAME: 'test' };
});
// afterEach(() => {
//   jest.clearAllMocks();
//   jest.resetAllMocks();
//   jest.resetModules();
// });