import Debug from 'debug';
import mongoose from 'mongoose';

import {
  sanitizeEmailField,
  validateEmailField,
  sanitizeStringField,
  validateStringFieldLength,
  validatePasswordField,
  validatePasswordConfirmField,
  getValidationErrorMessage,
} from '../utils/requestValidations.js';
import { generateToken } from '../utils/jwtTokens.js';
import { sendPasswordResetEmail } from '../utils/mailHandler.js';
import { asyncErrorsHandler } from '../utils/errorsHandler.js';
import CustomError from '../utils/CustomError.js';

const debug = Debug('app:userController');
const User = mongoose.model('User');
const sanitizeEmail = sanitizeEmailField('email');
const validateEmail = validateEmailField('email', 'Email');
const sanitizeName = sanitizeStringField('name');
const validateName = validateStringFieldLength('name', 'Name');
const validatePassword = validatePasswordField('password');
const validatePasswordConfirm = validatePasswordConfirmField('password', 'password-confirm');

const generateUserInfo = (user, withToken = false) => {
  const { _id, name, email, isAdmin } = user;
  if (withToken)
    return {
      _id,
      name,
      email,
      isAdmin,
      avatar: user.gravatar,
      token: generateToken({ _id, name, isAdmin }),
    };
  else
    return {
      _id,
      name,
      email,
      isAdmin,
      avatar: user.gravatar,
    };
};

/**
 * Register New User
 * @param {Request} req  request object.
 * @param {Response} res response object.
 * @route post api/users
 * @access public
 */
const registerUser = asyncErrorsHandler(async (req, res) => {
  const validationMessage = getValidationErrorMessage(req);
  if (validationMessage) {
    // Error
    debug(validationMessage);
    res.status(400);
    throw new CustomError(CustomError.types.validation, 400, validationMessage); // 400 is bad request
  }
  // no validation errors
  const { name, email, password, isAdmin } = req.body;
  // check if user exists
  const existingUser = await User.findOne({ email });
  debug(existingUser);
  if (existingUser) {
    debug('email is already taken');
    res.status(400);
    throw new CustomError(CustomError.types.auth.emailAlreadyTaken, 400, 'email is already taken'); // 400 is bad request
  }

  const user = await User.create({ name, email, password, isAdmin });
  if (user) {
    // send user info with new token
    res.status(201).json({ data: { userInfo: generateUserInfo(user, true) } });
  } else {
    debug('Invalid user data');
    res.status(400);
    throw new CustomError(CustomError.types.auth.invalidUserData, 400, 'Invalid user data'); // 400 is bad request
  }
});

/**
 * Get Reset User Password
 * @param {Request} req  request object.
 * @param {Response} res response object.
 * @route GET api/users/reset
 * @access public
 */
const resetPassword = asyncErrorsHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // if exists set reset token and expiry
  if (user) {
    // user email found
    // set password reset token to user object
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    // save the token to user object
    await user.save();
    // send email with the token
    const resetURL = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;
    await sendPasswordResetEmail(user, resetURL);
    res
      .status(200)
      // FIXME: JSON response must contain {data:{}}
      .json({ message: 'Password has been reset and reset email has been sent successfully' });
  } else {
    debug('User is not found');
    throw new CustomError(CustomError.types.auth.userNotFound, 404, 'User is not found');
  }
});

/**
 * Find User with token route middleware
 * @param {Request} req  request object.
 * @param {Response} res response object.
 * @route api/users/:token
 * @access public
 */
const findUserWithToken = async (req, res, next) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    req.user = user;
    return next();
  } catch (error) {
    debug('Find user with token error');
    debug(error);
    return next(
      new CustomError(
        CustomError.types.auth.userNotFound,
        404,
        'Faild to Find a user with this reset password token'
      )
    );
  }
};

// FIXME: Complete this function
const loadResetPasswordForm = asyncErrorsHandler(async (req, res) => {
  const { user } = req;
  if (user) {
    // User has been located with the provided token
    // Load reset form
  } else {
    // no user with this token becasue token is invalid or expired
    // handle this error
    debug('Invalid password reset token');
    res.status(400);
    throw new CustomError(
      CustomError.types.auth.invalidToken,
      400,
      'Invalid password reset token or expired token'
    ); // 400 is bad request
  }
});

/**
 * Change Password
 * @param {Request} req  request object.
 * @param {Response} res response object.
 * @route POST api/users/:token
 * @access public
 */
const changePassword = asyncErrorsHandler(async (req, res) => {
  const { user } = req;
  if (user) {
    // User has been located with the provided token
    const validationMessage = getValidationErrorMessage(req);
    if (validationMessage) {
      // Validation Error
      debug(validationMessage);
      res.status(400);
      throw new CustomError(CustomError.types.validation, 400, validationMessage); // 400 is bad request
    }
    // no validation errors
    const { password } = req.body;
    // update user with new password
    user.password = password;
    // remove password token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // save user to DB
    const updatedUser = await user.save();
    if (updatedUser) {
      res.status(200).json({ data: { userInfo: generateUserInfo(updatedUser) } });
    } else {
      debug('Faild to change password');
      res.status(400);
      throw new CustomError(
        CustomError.types.auth.passwordChangeFaild,
        400,
        'Faild to change password'
      ); // 400 is bad request
    }
  } else {
    // no user with this token becasue token is invalid or expired
    // handle this error
    debug('Invalid password reset token');
    res.status(400);
    throw new CustomError(
      CustomError.types.auth.invalidToken,
      400,
      'Invalid password reset token or expired token'
    ); // 400 is bad request
  }
});

/**
 * Get User Profile
 * @param {Request} req  request object.
 * @param {Response} res response object.
 * @route GET api/users/profile
 * @access public
 */
const getUserProfile = asyncErrorsHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json(generateUserInfo(user));
  } else {
    debug('User is not found');
    throw new CustomError(CustomError.types.auth.userNotFound, 404, 'User is not found');
  }
});

/**
 * Update User Profile
 * @param {Request} req  request object.
 * @param {Response} res response object.
 * @route POST api/users/profile
 * @access public
 */
const updateUserProfile = asyncErrorsHandler(async (req, res) => {
  const { _id } = req.user;
  const { name, email } = req.body;
  const updates = { name, email };
  const user = await User.findOneAndUpdate(
    { _id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  if (user) res.status(200).json({ data: { userInfo: generateUserInfo(user) } });
  else {
    debug('Faild to update user profile');
    throw new CustomError(CustomError.types.auth.updateFaild, 404, 'Faild to update user profile');
  }
});

export {
  getUserProfile,
  updateUserProfile,
  registerUser,
  resetPassword,
  findUserWithToken,
  loadResetPasswordForm,
  changePassword,
  validateEmail,
  sanitizeName,
  sanitizeEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
};
