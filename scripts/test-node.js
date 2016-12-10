var cwd = process.cwd(),
    failed;

function run(directories) {
  var directory = directories.shift(), script;
  if (directory) {
    script = __dirname + '/../test/' + directory;
    console.log('> require ' + script);
    console.log('');
    process.chdir(script);
    script = require(script + '/test-node.js');
    script(function (error) {
      if (error) {
        failed = true;
        console.log(error.toString());
        console.error('Testing failed.');
      } else {
        console.log('Testing succeeded.');
      }
      console.log('');
      process.chdir(cwd);
      run.call(null, directories);
    });
  } else {
    process.exit(failed ? 1 : 0);
  }
}

run([
  'support-csso-v1',
  'support-csso-v2'
]);
