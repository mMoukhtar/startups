import dotenv from 'dotenv';

dotenv.config();

const prodConfig = {
  logging: false,
  // FIXME: Change origin name of the app production name
  origin: '', // name of the react host name
  mail: {
    host: process.env.mailtrapHost,
    port: process.env.mailtrapPort,
    auth: {
      user: process.env.mailtrapUser,
      pass: process.env.mailtrapPassword,
    },
  },
};

export { prodConfig };
