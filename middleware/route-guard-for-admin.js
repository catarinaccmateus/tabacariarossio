'use strict';

module.exports = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    console.log('else of route admin', req.user);
    const error = new Error('AUTHENTICATION_AS_ADMIN_REQUIRED');
    error.status = 401;
    next(error);
  }
};
