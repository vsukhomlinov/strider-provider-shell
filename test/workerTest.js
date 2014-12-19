var assert = require("assert"),
    worker = require('../lib/worker'),
    path = require('path'),
    child_process = require('child_process');
describe('Worker', function(){
    describe('fetch', function(){
        it('should execute scripts and respond to stdout', function(done){


            var workspace = {
                data: __dirname
            };
            var config = {
                script: 'pwd'
            };
            worker.init(workspace, config, '_', function initDone(err, result) {
                var out = '';

                result.fetch({comment: function(str) {
                    out+= str;
                }}, function fetchDone() {
                    console.log(out);
                    assert(out.indexOf(__dirname + '\n') == 0);
                    done();
                })

            })
        })
    })
})