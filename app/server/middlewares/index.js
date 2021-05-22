import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import compression from 'compression';

const useMiddlewares = (app, { secret, origin }) => {
  const debug = new Debug('app:middleware');
  try {
    app.use(morgan('dev'));
    // Using compression - gzip
    app.use(compression());
    app.use(cors({ origin, credentials: true }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    // app.use(cookieParser(secret));
    // app.use(
    //   session({
    //     secret,
    //     resave: false,
    //     saveUninitialized: false,
    //   })
    // );
  } catch (error) {
    debug(error);
  }
};

export { useMiddlewares };
