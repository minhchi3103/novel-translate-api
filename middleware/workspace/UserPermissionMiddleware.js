module.exports = function (req, res, next) {
  try {
    // Make sure middleware run only one time
    if (require('@h/mw')(__filename, req, next)) return;
    // Begin middleware process
    let err = new Error('permission deny (match user)');
    if (res.locals.decodedToken.username !== req.params.username)
      throw err;
    return next();
  } catch (error) {
    error.status = 403;
    next(error);
  }
}