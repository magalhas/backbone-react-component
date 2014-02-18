exports = module.exports = function (grunt) {
  grunt.initConfig({
    react: {
      main: {
        files: [
          {
            expand: true,
            cwd: './public',
            src: ['**/*.jsx'],
            dest: './public',
            ext: '.js'
          }
        ]
      }
    },
    watch: {
      files: ['./public/**/*.jsx'],
      tasks: ['react'],
      options: {
        spawn: false
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-react');
};