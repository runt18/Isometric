module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'

      my_target:
        files:
          'build/js/vendor.js': [
            'vendor/jquery/jquery.js'
          ]

    stylus:
      compile:
        files:
          'css/style.css': 'stylus/style.styl'

    clean: ['js/*.js', 'css/*.css', 'build']

    watch:
      scripts:
        files: ['stylus/*.styl', 'coffee/*.coffee', 'templates/*.html']
        tasks: ['default']

    jst:
      compile:
        files:
          'js/templates/index.js': ['templates/*.html']
      options:
        processName: (filename) -> filename.replace(/templates\/|\.html/gi, '')

    connect:
      server:
        options:
          keepalive: true
          port: 8005

    copy:
      main:
        files: [
          expand: true
          src: [
            # App stuff
            'index.html'
            'js/**'
            'css/**'

            # CSS and fonts
            'vendor/normalize-css/normalize.css'
          ]
          dest: 'build'
        ]

  require('load-grunt-tasks')(grunt)
