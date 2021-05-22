import path from 'path';
import express from 'express';

import {
  pageNotFoundHandler,
  validationErrorsHandler,
  errorsHandler,
} from '../utils/errorsHandler.js';
//import apiRoutes from './apiRoutes.js';

const useRoutes = (app, env) => {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, 'app/client/build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'app', 'client', 'index.html'));
  });

  //app.use('/api', apiRoutes);

  // if (env === 'production') {
  //   app.use(express.static(path.join(__dirname, 'app/client/build')));
  //   app.get('/*', (req, res) => {
  //     res.sendFile(path.resolve(__dirname, 'app', 'client', 'build', 'index.html'));
  //   });
  // } else {
  //   app.get('/', (req, res) => {
  //     res.send('API is running!');
  //   });
  // }

  app.use(pageNotFoundHandler);
  app.use(validationErrorsHandler);
  app.use(errorsHandler(env));
};

export { useRoutes };

// Adding static routes for bootstrap
/*
  app.use(express.static(path.join(__dirname, '/public')));
  app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
  app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
  app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
  app.use('/js', express.static(path.join(__dirname, '/node_modules/popper.js/dist')));
  */
