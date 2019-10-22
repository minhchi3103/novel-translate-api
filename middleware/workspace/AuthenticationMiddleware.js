module.exports = function(req, res, next) {
  try {
    // Make sure middleware run only one time
    if (require('@h/mw')(__filename, req, next)) return;
    // Begin middleware process
    if (res.locals.decodedToken && res.locals.decodedToken.username)
      return next();
    throw new Error('permission deny (auth)');
  } catch (error) {
    error.status = 403;
    next(error);
  }
};
