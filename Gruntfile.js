module.exports = function (grunt) {

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
            apiEndpoint: 'http://localhost:3000/api'
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