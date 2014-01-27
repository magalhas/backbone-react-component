'use strict';
exports = module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      options: {
        compress: true
      },
      build: {
        files: {
          'dist/backbone-component-min.js': ['lib/component.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
};