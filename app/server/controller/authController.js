import Debug from 'debug';
import mongoose from 'mongoose';

import { asyncErrorsHandler } from '../utils/errorsHandler.js';
import { generateToken } from '../utils/jwtTokens.js';
import CustomError from '../utils/CustomError.js';

const debug = Debug('app:authController');
const User = mongoose.model('User');

/**
 * Login
 * @param {Request} req  request object.
 * @param {Response} res response object.
 * @route GET api/products
 * @access public
 */
const login = asyncErrorsHandler(async (req, res) => {
  let base64EncondingCredentials = req.headers.authorization.split(' ')[1];
  let credentials = Buffer.from(base64EncondingCredentials, 'base64').toString().split(':');
  const email = credentials[0];
  const password = credentials[1];

  const user = await User.findOne({ email });
  if (!user) {
    debug('User is not found');
    throw new CustomError(CustomError.types.auth.userNotFound, 404, 'User is not found');
  }

  const correctPassword = await user.checkPassword(password);
  if (!correctPassword) {
    debug('Password is not correct');
    throw new CustomError(CustomError.types.auth.wrongPassword, 401, 'Password is not correct');
  }

  if (!user.isActive) {
    debug('User is not activated');
    throw new CustomError(CustomError.types.auth.notActivated, 401, 'User is not activated');
  }

  // user is found and entered email and passwords are correct
  const { _id, name, isAdmin } = user;
  const token = generateToken({ _id, name, isAdmin }, null);
  console.log(token);
  res.status(200).json({
    data: {
      userInfo: {
        _id: _id,
        name: name,
        email: email,
        avatar: user.gravatar,
        isAdmin: isAdmin,
        token,
      },
    },
  });
});

/**
 * Logout
 * @param {Request} req  request object.
 * @param {Response} res response object.
 * @route GET api/products
 * @access public
 */
const logout = asyncErrorsHandler(async (req, res) => {
  res.status(200).json({ data: { user: req.user } });
});

export { login, logout };
