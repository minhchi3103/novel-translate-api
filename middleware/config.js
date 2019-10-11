var fs = require('fs');
var path = require('path');

// load all middleware filename in dir
var files = fs.readdirSync(path.join(__dirname, './workspace')).map(filename => path.parse(filename).name)

// require and store all middleware in rs
var rs = {}
files.forEach(function (filename) {
  rs[filename] = require('./workspace/' + filename)
})

module.exports = rs;