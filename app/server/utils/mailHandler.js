import Debug from 'debug';
import nodemailer from 'nodemailer';
import htmlToText from 'html-to-text';

import { config } from '../config/envs/index.js';
import CustomError from './CustomError.js';

const debug = Debug('app:mailHandler');
const transport = nodemailer.createTransport(config.mail);

const generatePasswordResetMail = (resetURL) => {
  return `<html>
  <head></head>
  <body>
  <h1>Gift Game Cards<h1>
  <h2>Password Reset</h2>
  <p>Hello. You have requested a password reset. please click on the following button to continue on with reseting your password. please note that the link is only valid for one hour</p>
  <button href="${resetURL}">Reset Password</button>
  <p>If you can't click on the above button please use this link to reset your password ${resetURL}</p>
  <p>If you didn't request this email please ignore this email</p>
  </body>
  </html>`;
};

const sendPasswordResetEmail = async (user, resetURL, subject = 'Password Reset!') => {
  try {
    const html = generatePasswordResetMail(resetURL);
    const text = htmlToText.htmlToText(html);
    const mailOptions = {
      from: 'mohamed.moukhtar@gmail.com',
      to: user.email,
      subject,
      html,
      text,
    };
    return transport.sendMail(mailOptions);
  } catch (error) {
    debug('🚀 sendPasswordResetEmail ~ error;');
    debug(error);
    throw new CustomError(
      CustomError.types.auth.resetPasswordEmailFailed,
      500,
      'Failed to send password reset email'
    );
  }
};

export { sendPasswordResetEmail };
