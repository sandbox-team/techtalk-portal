'use strict';

module.exports = function(grunt) {
  var config = {
      app: './',
      dist: 'dist'
    };

  try {
    config.app = require('./bower.json').appPath || config.app;
  } catch (e) {}  

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.initConfig({
    config: config,
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
          'public/css/styles.css': 'styles/base.less'
        }
      }
    },

    concat: {
      development: {
        files: {
          'public/js/core.js': [
            'bower_components/jquery/jquery.js', 
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/angular-bootstrap/ui-bootstrap.js',
            'vendor/zenpen/js/libs/Blob.js',
            'vendor/zenpen/js/libs/FileSaver.js',
            'vendor/zenpen/js/libs/fullScreen.js',
            'vendor/zenpen/js/utils.js',
            //'vendor/zenpen/js/ui.js',
            'vendor/zenpen/js/editor.js'
          ],
          'public/js/pace.js': ['bower_components/pace/pace.js'],
          'public/css/vendor.css': [
            'bower_components/pace/themes/pace-theme-minimal.css',
            'vendor/zenpen/css/fonts.css',
            'vendor/zenpen/css/style.css'
          ]
        }
      },

      production: {
      }
    },

    copy: {
      development: {
        files: [
          {
            expand: true,
            cwd: './scripts/',
            src: '{,**/}*.js',
            dest: './public/js/'
          },
          {
            expand: true,
            cwd: './styles/fonts/',
            src: '**',
            dest: './public/css/fonts/'
          }
        ]
      },
      build: {
        files: {
          'dist/': [
            './public/{css/**, img/**}',
            'views/**',
            'server.js',
            'node_modules/**'
          ]
        }
      }
    },

    clean: {
      dist: {
        src: ['<%= config.dist %>', './.tmp'],
        force: true
      }
    },

    useminPrepare: {
      html: ['./views/index.html'],
      options: {
        dest: './dist/public'
      }
    },
    usemin: {
      html: ['dist/views/index.html'],
      options: {
        basedir: './public'
      }
    }

  });

  grunt.registerTask('default', ['copy:development', 'less:development', 'concat:development']);
  grunt.registerTask('build', ['clean:dist', 'copy:build', 'useminPrepare', 'concat', 'uglify', 'usemin']);
};
