module.exports = function(grunt) {

  var scripts = [
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/lodash/lodash.js',
    'node_modules/angular-environment/dist/angular-environment.js',
    'app.js', // define app
    'app-controller.js', // define app
    'views/**/*.js', // app dependencies
    'shared/**/*.js', // app dependencies
    '!shared/assets/scripts/umami.js' // not the build target
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      jev: {
        options: {
          keepSpecialComments: 0
        },
        files: {
          'shared/assets/styles/umami.css': [
            'shared/assets/styles/umami.css'
          ]
        }
      }
    },
    express: {
      dev: {
        options: {
          script: 'index-dev.js'
        }
      }
    },
    uglify: {
      dev: {
        options: {
          sourceMap: true,
          mangle: false
        },
        files: {
          'shared/assets/scripts/umami.js': scripts
        }
      },
      prod: {
        files: {
          'shared/assets/scripts/umami.js': scripts
        }
      }
    },
    watch: {
      scripts: {
        files: scripts,
        tasks: ['uglify:dev'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('build', [
    'uglify:dev',
    'cssmin'
  ]);

  grunt.registerTask('serve', [
    'express:dev',
    'uglify:dev',
    'watch'
  ]);
};
