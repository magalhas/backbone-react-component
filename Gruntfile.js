'use strict';
exports = module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      options: {
        compress: true,
        preserveComments: 'some'
      },
      build: {
        files: {
          'dist/backbone-react-component-min.js': ['lib/component.js']
        }
      }
    },
    jasmine: {
      dev: {
        src: ['lib/**/*.js'],
        options: {
          specs: 'test/**/*.js',
          vendor: [
            'bower_components/underscore/underscore.js',
            'bower_components/backbone/backbone.js',
            'bower_components/react/react.js'
          ]
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['uglify:build']);
  grunt.registerTask('test', ['jasmine:dev']);
};