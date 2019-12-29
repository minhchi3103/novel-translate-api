/**
 * Find novel with id in url params
 * add check if current user is novel'owner or editor
 */
module.exports = async function(req, res, next) {
  try {
    // Make sure middleware run only one time
    if (require('@h/mw')(__filename, req, next)) return;
    // Begin middleware process
    if (
      res.locals.participantRole == 'owner' ||
      res.locals.participantRole == 'editor'
    )
      return next();
    throw new Error('permission deny (owner|editor)');
  } catch (error) {
    error.status = 403;
    next(error);
  }
};
