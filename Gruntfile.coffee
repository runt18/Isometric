# Source files. Order matters.
coffees = [
  'main'
]

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

    coffee:
      compile:
        files:
          'js/all.js': ("coffee/#{coffee}.coffee" for coffee in coffees)

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

  contribs = ['coffee', 'stylus', 'watch', 'connect', 'clean', 'jst', 'copy', 'uglify']

  for task in contribs
    grunt.loadNpmTasks "grunt-contrib-#{task}"

  grunt.registerTask 'default', ['stylus', 'coffee', 'jst']
  grunt.registerTask 'build', ['default', 'copy', 'uglify']
