var fs = require('fs'),
  path = require('path'),
  child_process = require('child_process');

module.exports = {
  init: function (workspace, config, project, done) {
    done(null, {
      config: config,
      fetch: function (context, done) {
        console.log(workspace);
        var temp = workspace.cache;
        var tempShellFile = path.join(temp, 'shellProvider_'+new Date().getTime()+'.sh');

        fs.writeFile(tempShellFile, config.script, {mode: 0750}, function(err) {
          if(err) {
            console.error('Error creating temp file %s', tempShellFile);
            context.comment(err);
            done(err);
            return;
          }
          var proc = child_process.execFile(tempShellFile, [], {cwd: workspace.data});

          proc.stdout.on('data', function (data) {
            context.comment('' + data);
          });

          proc.stderr.on('data', function (data) {
            context.comment('' + data);
          });

          proc.on('close', function(code) {
            if(code !== 0) {
              context.comment('Process exited with code '+ code);
            }
            done();
            fs.unlink(tempShellFile);
          })
        });
      }
    })
  }
}