'use strict';

module.exports = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "employee") {
    next();
  } else {
    console.log('else of route admin and employee', req.user);
    const error = new Error('AUTHENTICATION_AS_ADMIN_OR_EMPLOYEE_REQUIRED');
    error.status = 401;
    next(error);
  }
};
