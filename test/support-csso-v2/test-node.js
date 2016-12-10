var fs = require('fs');

module.exports = function (callback) {
  fs.stat(__dirname + '/out/test.css', function (error, stat) {
    if (!error && stat.size > 20) {
      error = new Error('CSS minification did not take place.');
    }
    callback(error);
  });
};
