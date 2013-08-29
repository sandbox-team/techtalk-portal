module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.initConfig({

    less: {
      bootstrap: {
        options: {
          paths: ["styles", "bower_components/bootstrap/less"]
        },
        files: {
          "public/css/bootstrap.css": "styles/bootstrap.less"
        }
      },

      styles: {
        options: {
          paths: ["styles", "bower_components/bootstrap/less"]
        },
        files: {
          "public/css/calendar.css": "styles/calendar.less",
          "public/css/details.css":  "styles/details.less"
        }
      }
    },


    concat: {
      core: {
        src: [
          "bower_components/jquery/jquery.js", 
          "bower_components/angular/angular.js"
        ],
        dest: "public/js/core.js"
      },

      calendar: {
        src: [
          "scripts/calendar.js"
        ],
        dest: "public/js/calendar.js"
      },

      details: {
        src: [
          "scripts/details.js"
        ],
        dest: "public/js/details.js"
      }
    }

  });

  grunt.registerTask("default", ["less", "concat"]);
};
