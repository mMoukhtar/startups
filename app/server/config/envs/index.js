import dotenv from 'dotenv';

import { testConfig } from './testing.js';
import { prodConfig } from './production.js';
import { devConfig } from './development.js';

dotenv.config();

const envs = { dev: 'development', test: 'testing', prod: 'production' };
Object.freeze(envs);

process.env.NODE_ENV = process.env.NODE_ENV || envs.dev;

const appConfig = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 4000,
  db: {
    host: `${process.env.MONGOSERVERNAME}${process.env.MONGODATABASENAME}${process.env.MONGOCONNECTIONSETTINGS}`,
  },
  secret: process.env.SECRET,
  algorithm: process.env.ALGORITHM,
  issuer: process.env.ISSUER,
  expiry: process.env.EXPIRY,
};

let config = {};

switch (appConfig.env) {
  case envs.prod:
    config = { ...appConfig, ...prodConfig };
    break;
  case envs.test:
    config = { ...appConfig, ...testConfig };
    break;
  default:
    config = { ...appConfig, ...devConfig };
    break;
}

export { config };
