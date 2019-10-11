module.exports = function (filename, req, next) {
  if (req.mw[filename] === true) {
    next();
    return true
  }
  req.mw[filename] = true;
  return false
}