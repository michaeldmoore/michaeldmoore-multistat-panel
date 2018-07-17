module.exports = (grunt) => {
  require('load-grunt-tasks')(grunt)

  grunt.loadNpmTasks('grunt-execute')
  grunt.loadNpmTasks('grunt-contrib-clean')

  grunt.initConfig({

    clean: ['dist'],

    copy: {
      src_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/external/*', '!**/*.js', '**/external/*.js', '!**/*.scss', '!img/**/*'],
        dest: 'dist'
      },
      pluginDef: {
        expand: true,
        src: ['README.md'],
        dest: 'dist'
      },
      img_to_dist: {
        expand: true,
        cwd: 'src/img',
        src: ['*.*'],
        dest: 'dist/img/'
      },
      css_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['css/**/*'],
        dest: 'dist'
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
        plugins: ['transform-es2015-modules-systemjs', 'transform-es2015-for-of']
      },
      dist: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['*.js'],
          dest: 'dist',
          ext: '.js'
        }]
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*'],
        tasks: ['default'],
        options: {spawn: false}
      }
    }

  })

  grunt.registerTask('default', ['clean', 'copy:src_to_dist', 'copy:pluginDef', 'copy:img_to_dist', 'copy:css_to_dist', 'babel'])
}
