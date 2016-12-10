var fs = require('fs'),
    ncp = require('ncp').ncp,
    exec = require('child_process').exec,
    verbose = process.argv[2] === '--verbose',
    command = 'node vendor/r.js -o build.js',
    failed;

function build(directories) {
  var directory = directories.shift();
  if (directory) {
    directory = 'test/' + directory;
    console.log('> copy test/vendor to ' + directory + '/vendor');
    fs.mkdir(directory + '/vendor', function (error) {
      if (error && error.code != 'EEXIST') {
        console.error(error);
        process.exit(1);
      } else {
        ncp('test/vendor/r.js', directory + '/vendor/r.js', function (error) {
          if (error) {
            console.error(error.toString());
            process.exit(1);
          } else {
            console.log('> cd ' + directory + ' && ' + command);
            exec(command, {cwd: directory}, function (error, stdout, stderr) {
              if (error) {
                failed = true;
                console.error(error.toString());
              }
              if (error || verbose) {
                console.log(stdout);
                console.log(stderr);
              }
              build.call(null, directories);
            });
          }
        });
      }
    });
  } else {
    process.exit(failed ? 1 : 0);
  }
}

build([
  'support-csso-v1',
  'support-csso-v2',
  'support-less-v1',
  'support-less-v2',
  'support-separate-css'
]);
