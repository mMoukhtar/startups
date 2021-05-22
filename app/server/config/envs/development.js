import dotenv from 'dotenv';

dotenv.config();

const devConfig = {
  logging: false,
  origin: 'http://localhost:4000',
  mail: {
    host: process.env.mailtrapHost,
    port: process.env.mailtrapPort,
    auth: {
      user: process.env.mailtrapUser,
      pass: process.env.mailtrapPassword,
    },
  },
};

export { devConfig };
