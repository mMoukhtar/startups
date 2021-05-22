import Debug from 'debug';
import chalk from 'chalk';
import express from 'express';

import { config } from './config/envs/index.js';
import { useMiddlewares } from './middlewares/index.js';
import { useRoutes } from './routes/index.js';

const debug = new Debug('app');

const app = express();

app.set('port', config.port);
useMiddlewares(app, config);
useRoutes(app, config.env);

app.listen(app.get('port'), () => {
  debug(chalk.magenta('---------------------------------------------------------------'));
  debug(
    `🖥️  ${chalk.bgMagenta.white(
      `Express server is now running on:: http://localhost:${app.get('port')}`
    )}`
  );
  debug(chalk.magenta('---------------------------------------------------------------'));
});
