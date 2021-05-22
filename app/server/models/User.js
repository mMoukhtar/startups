import mongoose from 'mongoose';
import validator from 'validator';
import beautifyUnique from 'mongoose-beautiful-unique-validation';
import md5 from 'md5';
import bcrypt from 'bcrypt';
//import passportLocalMongoose from 'passport-local-mongoose';

import CustomError from '../utils/CustomError.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: 'Please provide an email address',
      // This value can either be `true` to use the default error
      // message or a non-empty string to use a custom one.
      // See `Usage` below for more on error messages.
      unique: 'Two users cannot share the same email ({VALUE})',
      validate: [validator.isEmail, 'Invalid Email Address'],
    },
    name: {
      type: String,
      required: 'Please provide a name',
      trim: true,
    },
    password: {
      type: String,
      required: 'Please provide a password',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    activateUserToken: { type: String },
  },
  { timestamps: true }
);

// Methods
userSchema.method('checkPassword', async function (password) {
  return await bcrypt.compare(password, this.password);
});

// Virtual
userSchema.virtual('gravatar').get(function () {
  // we need to hash the user email to avoid leaking his email when sent to frontend
  const gravatarHash = md5(this.email);
  return `https://gravatar.com/avatar/${gravatarHash}?s=200`;
});

userSchema.virtual('domain').get(function () {
  return this.email.slice(this.email.indexOf('@') + 1);
});

// Pre Hooks
userSchema.pre('save', async function (next) {
  // encrypt password
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new CustomError(CustomError.types.db.faildToCreate, 500, 'Faild to hash the password');
  } finally {
    next();
  }
});

// Plugins
userSchema.plugin(beautifyUnique);
// Passport-Local Mongoose is:
// a plugin that simplifies building username and password login with Passport
//userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);

export default User;
