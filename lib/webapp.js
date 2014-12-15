/*plugin schema  and cryptic getFile() method */

module.exports = {
  getFile: function(filename, account, jobConfig, project, done) {
    done(null, jobConfig);
  },

  config: {
    script: String
  }

}