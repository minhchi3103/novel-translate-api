var jwt = require('jsonwebtoken');

// parse jwt token (if exist) and store in res.locals.user
module.exports = async function(req, res, next) {
  try {
    // Make sure middleware run only one time
    if (require('@h/mw')(__filename, req, next)) return;
    // Begin middleware process
    // Get JWT token in url param or authorization header
    // Express headers are auto converted to lowercase
    let token = req.headers['authorization'] || req.query.token;
    // If no token in request, do nothing and call next()
    if (!token) return next();
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from token string
      token = token.slice(7, token.length);
    }
    let decodedToken = await jwt.verify(token, process.env.PUBLIC_KEY);
    res.locals.decodedToken = decodedToken;
    res.locals.role = decodedToken.role;
    next();
  } catch (error) {
    // If having error, unset res.locals.decodedToken and call next()
    if (res.locals.decodedToken) res.locals.decodedToken = undefined;
    next();
  }
};
