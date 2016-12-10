var cwd = require('fs').workingDirectory,
    args = require('system').args,
    verbose = args[1] === '--verbose',
    page = require('webpage').create(),
    failed;

page.onConsoleMessage = function (message, line, source) {
  if (verbose) {
    console.log(message);
    source && console.log('  (' + source + ', line ' + line + ')');
  }
};

function run(directories) {
  var directory = directories.shift(), url;
  if (directory) {
    url = 'file://' + cwd + '/test/' + directory + '/test.html';
    runPage(url, function () {
      url = 'file://' + cwd + '/test/' + directory + '/test-out.html';
      runPage(url, function () {
        run.call(null, directories);
      });
    });
  } else {
    phantom.exit(failed ? 1 : 0);
  }

  function runPage(url, callback) {
    console.log('> open ' + url);
    console.log('');
    page.open(url, function (status) {
      var retries, interval;
      if (status === 'success') {
        retries = 0;
        interval = setInterval(function () {
          var bodyText = page.evaluate(function () {
            return document.body.innerText;
          }).trim();
          if (bodyText !== 'loading...') {
            clearInterval(interval);
            if (bodyText !== 'succeeded') {
              failed = true;
            }
            console.log('Testing ' + bodyText + '.');
            console.log('');
            callback();
          } else {
            if (++retries === 100) {
              clearInterval(interval);
              failed = true;
              console.error('Testing timed out.');
              console.log('');
              callback();
            }
          }
        }, 10);
      } else {
        failed = true;
        console.error('Opening failed.');
        console.log('');
        callback();
      }
    });
  }
}

run([
  'support-csso-v1',
  'support-csso-v2',
  'support-less-v1',
  'support-less-v2',
  'support-separate-css'
]);
