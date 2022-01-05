const isEmpty = (string) => string.trim() === '';

const isEmail = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regex);
};

// Returns any error messages that will be rendered in the UI
// 'Must not be empty' will not be ambiguous when it appears next to a form label
exports.validateSignUpData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  else if (!isEmail(data.email)) errors.email = 'Must be a valid email address';

  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  if (data.confirmPassword !== data.password) errors.confirmPassword = 'Passwords must match';

  if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};

// See comments for .validateSignUpData()
exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};

// Receives the user's form data and filters non-empty fields
exports.reduceUserDetails = (data) => {
  const userDetails = {};

  // TODO: add req object keys and cleanup methods as necessary
  // currently assumes that there's only one form field ("info")
  if (!isEmpty(data.info.trim())) userDetails.info = data.info;
  // if (!isEmpty(data.anotherKey.trim())) userDetails.anotherKey = data.anotherKey;

  return userDetails;
};
