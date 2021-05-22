import CustomError from './CustomError.js';

const asyncErrorsHandler = (asyncFuntion) => (req, res, next) => asyncFuntion(req, res).catch(next);

const pageNotFoundHandler = (req, res, next) => {
  // if we called next with an object then node assume it is an error
  next(
    new CustomError(
      CustomError.types.api.invalidEndPoint,
      404,
      `${req.originalUrl} is not a valid API endpoint`
    )
  );
};

const validationErrorsHandler = (err, req, res, next) => {
  if (!err.errors) return next(err);
  // validation errors look like
  // const errorKeys = Object.keys(err.errors);
  // errorKeys.forEach((key) => req.flash('error', err.errors[key].message));
  return res.status(err.status || 500).json({
    error: {
      type: 'Validation error',
      errors: err.errors,
    },
  });
};

const errorsHandler = (env) => (error, req, res, next) => {
  const { type = 'Exception', status, message, stack = '' } = error;
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const responseStatus = status ? (status === 200 ? statusCode : status) : statusCode;
  const coloredStack = stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>');
  if (env === 'development')
    return res.status(responseStatus).json({
      error: {
        type,
        status: responseStatus,
        message,
        stack: coloredStack,
      },
    });
  else return res.status(responseStatus).json({ error: { message } });
};

export { asyncErrorsHandler, pageNotFoundHandler, validationErrorsHandler, errorsHandler };
