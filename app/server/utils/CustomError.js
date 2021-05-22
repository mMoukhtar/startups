const errorTypes = {
  db: {
    recordNotFound: `DB record doesn't exist`,
    faildToCreate: 'DB record creation failed',
  },
  api: {
    invalidEndPoint: 'Endpoint not found',
  },
  validation: 'Validation error',
  auth: {
    userNotFound: 'User is not found',
    wrongPassword: 'Wrong password',
    notActivated: `Account hasn't been activiated yet`,
    invalidToken: 'Token is invalid',
    tokenGenerationFaild: 'Token generation failed',
    emailAlreadyTaken: 'This email is already taken',
    invalidUserData: 'The user data is invalid',
    resetPasswordEmailFailed: 'Failed to send reset password email',
    passwordChangeFaild: 'Faild to change password',
    updateFaild: 'Faild to update user',
  },
};
Object.freeze(errorTypes);

class CustomError extends Error {
  constructor(type, status, message) {
    super(message);
    this.type = type;
    this.status = status;
  }

  static types = errorTypes;
}

export default CustomError;
