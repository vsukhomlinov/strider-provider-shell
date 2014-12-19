var fs = require('fs'),
    path = require('path'),
    child_process = require('child_process');

module.exports = {
    init: function (workspace, config, project, done) {
        done(null, {
            config: config,
            fetch: function (context, done) {
                var tempFileName = 'shellProvider_' + new Date().getTime() + '.sh';
                var fullTempFilePath = path.join(workspace.data, tempFileName);
                fs.writeFile(fullTempFilePath, config.script, {mode: 0750}, function (err) {
                    if (err) {
                        console.error('Error creating temp file %s', tempFileName);
                        context.comment(err);
                        done(err);
                        return;
                    }
                    var proc = child_process.execFile('./' + tempFileName, [], {cwd: workspace.data});
                    proc.on('error', function (err) {
                        context.comment(err.toString()+'\n');
                        fs.unlink(fullTempFilePath);
                    })

                    proc.stdout.on('data', function (data) {
                        context.comment('' + data);
                    });

                    proc.stderr.on('data', function (data) {
                        context.comment('' + data);
                    });

                    proc.on('close', function (code) {
                        if (code !== 0) {
                            context.comment('Process exited with code ' + code);
                        }
                        fs.unlink(fullTempFilePath);
                        done();
                    })
                });
            }
        })
    }
}