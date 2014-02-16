'use strict';
exports = module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      options: {
        compress: true
      },
      build: {
        files: {
          'dist/backbone-react-component-min.js': ['lib/component.js']
        }
      }
    },
    jasmine: {
      main: {
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
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('test', ['jasmine']);
};