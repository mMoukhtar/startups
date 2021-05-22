import dotenv from 'dotenv';

dotenv.config();

const testConfig = {
  logging: false,
  origin: 'http://localhost:3000', // react app origin

  mail: {
    host: process.env.mailtrapHost,
    port: process.env.mailtrapPort,
    auth: {
      user: process.env.mailtrapUser,
      pass: process.env.mailtrapPassword,
    },
  },
};

export { testConfig };
