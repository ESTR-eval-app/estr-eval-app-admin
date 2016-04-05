module.exports = function (grunt) {

  if (!process.env.EVAL_N_HOST) {
    throw Error("You must set the EVAL_N_HOST environment variable to the API server's IP or domain. See readme for details");
  }
  
  // project config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'config'
      },
      // Environment targets
      development: {
        options: {
          dest: 'app/config.js'
        },
        constants: {
          endpointConfig: {
            name: 'development',
            apiEndpoint: 'http://localhost:3000/api'
          }
        }
      },
      production: {
        options: {
          dest: 'app/config.js'
        },
        constants: {
          endpointConfig: {
            name: 'production',
            apiEndpoint: 'http://' + process.env.EVAL_N_HOST + ':3000/api'
          }
        }
      }
    },
  });

  // loads plugin for task
  grunt.loadNpmTasks('grunt-ng-constant');

  grunt.registerTask('build', [
    //  'clean:dist',
    'ngconstant:production',
    //  'bower-install'
  ]);

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'ngconstant:development',
      'bower-install',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });
};