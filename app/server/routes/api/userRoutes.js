import express from 'express';

import {
  sanitizeEmail,
  validateEmail,
  sanitizeName,
  validateName,
  validatePassword,
  validatePasswordConfirm,
  registerUser,
  resetPassword,
  getUserProfile,
  findUserWithToken,
  changePassword,
} from '../../controller/userController.js';
import { isAuthorized } from '../../utils/jwtTokens.js';

const userRoutes = express.Router();

userRoutes
  .route('/')
  .post(
    validateEmail,
    sanitizeName,
    validateName,
    validatePassword,
    validatePasswordConfirm,
    registerUser
  );

userRoutes.route('/reset').post(resetPassword);

userRoutes
  .route('/reset/:token')
  .all(findUserWithToken)
  //  .get(loadResetPasswordForm)
  .post(validatePassword, validatePasswordConfirm, changePassword);

userRoutes.route('/profile').all(isAuthorized).get(getUserProfile);

export default userRoutes;
