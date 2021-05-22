import express from 'express';

import { login, logout } from '../../controller/authController.js';

const authRoutes = express.Router();

authRoutes.route('/login').post(login);
authRoutes.route('/logout').post(logout);

export default authRoutes;
