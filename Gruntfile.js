'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['styles/{,**/}*.less'],
        tasks: ['less:development']
      },
      scripts: {
        files: ['scripts/{,**/}*.js'],
        tasks: ['copy:development']
      }
    },

    less: {
      development: {
        options: {
          paths: ['styles', 'bower_components/bootstrap/less']
        },
        files: {
          'public/css/styles.css': 'styles/base.less',
        }
      },
      production: {
        options: {
          paths: ['styles', 'bower_components/bootstrap/less'],
          yuicompress: true
        },
        files: {
          'public/css/styles.css': 'styles/base.less',
        }
      }
    },

    concat: {
      development: {
        src: [
          'bower_components/jquery/jquery.js', 
          'bower_components/angular/angular.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-resource/angular-resource.js',
          'bower_components/angular-cookies/angular-cookies.js',
          'bower_components/angular-sanitize/angular-sanitize.js'
        ],
        dest: 'public/js/core.js'
      },

      production: {
        app: {
          src: [
            'scripts/app.js'
          ],
          dest: 'public/js/app.js'
        },

        calendar: {
          src: [
            'scripts/calendar.js'
          ],
          dest: 'public/js/calendar.js'
        },

        details: {
          src: [
            'scripts/details.js'
          ],
          dest: 'public/js/details.js'
        }
      }
    },

    //TODO: there are some permissions problems with cwd usage
    copy: {
      development: {
        src: 'scripts/**',
        dest: 'public/js/'
      }
    }

  });

  grunt.registerTask('default', ['copy:development', 'less:development', 'concat:development', 'watch']);
  grunt.registerTask('build', []);
};
