// Check user role in current novel
// and store it in res.locals.participantRole
module.exports = function (req, res, next) {
  try {
    // Make sure middleware run only one time
    if (require('@h/mw')(__filename, req, next)) return;
    // Begin middleware process
    let userId = res.locals.decodedToken._id;
    let userRole = res.locals.novel.participant.reduce(function (result, currentValue) {
      if (currentValue.pid == userId) {
        if (currentValue.role == 'owner') return 'owner';
        if (currentValue.role == 'editor' && result != 'owner') return 'editor';
        if (currentValue.role == 'translator' && result == null) return 'translator';
      }
      return result;
    }, null);
    res.locals.participantRole = userRole || null;
    next();
  } catch (error) {
    next(error)
  }
}