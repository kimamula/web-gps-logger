module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-ts'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-tslint'
  grunt.loadNpmTasks 'grunt-lintspaces'
  grunt.loadNpmTasks 'grunt-contrib-symlink'
  grunt.loadNpmTasks 'grunt-contrib-clean'

  getTestTarget = (filepath) ->
    if filepath.indexOf('_spec.js') < 0
      # if product code was edited
      src = filepath
      spec = filepath.replace('.js', '_spec.js')
    else
      # if test code was edited
      src = filepath.replace('_spec.js', '.js')
      spec = filepath
    {
      src: src
      spec: spec
    }

  grunt.registerTask('init', [
    'clean:all'
    'symlink'
  ])
  grunt.registerTask('compile', [
    'tslint:main'
    'lintspaces:main'
    'ts:main'
    'ts:spec'
  ])
  grunt.registerTask('test', [
    'uglify'
    'jasmine:main'
  ])
  grunt.registerTask('release', [
    'clean:all'
    'symlink'
    'tslint:main'
    'lintspaces:main'
    'ts:main'
    'ts:spec'
    'uglify'
#    'jasmine:main'
    'clean:intermediate'
  ])

  grunt.event.on('watch', (action, filepath) ->
    # tslint
    grunt.config('tslint.single.files.src', [filepath]);

    # lintspaces
    grunt.config('lintspaces.single.src', [filepath]);

    # compile
    compiled_js = filepath.replace('.ts', '.js')
    grunt.config('ts.single.src', filepath)
    grunt.config('ts.single.dest', compiled_js)

    # test
    test_target = getTestTarget(compiled_js)
    grunt.config('jasmine.single.src', [test_target.src])
    grunt.config('jasmine.single.options.specs', test_target.spec)
  )

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    ts:
      main:
        src: ['public/components/**/*.ts']
        options:
          target: 'es5'
      spec:
        src: ['public/components/**/*_spec.ts']
        options:
          target: 'es5'
          sourceMap: false
      single:
        options:
          target: 'es5'
          sourceMap: false

    tslint:
      main:
        options:
          configuration: grunt.file.readJSON 'tslint.json'
        files:
          src: ['public/components/**/*.ts']
      single:
        options:
          configuration: grunt.file.readJSON 'tslint.json'

    lintspaces:
      main:
        src: ['public/components/**/*.ts']
        options:
          editorconfig: '.editorconfig'
          ignores: ['js-comments']
      single:
        options:
          editorconfig: '.editorconfig'
          ignores: ['js-comments']

    watch:
      single:
        files: ['public/components/**/*.ts']
        tasks: [
          'tslint:single'
          'lintspaces:single'
          'ts:single'
#          'jasmine:single'
        ]
        options:
          nospawn: true

    jasmine:
      main:
        src: ['public/components/**/*.min.js']
        options:
          specs: 'public/components/**/*_spec.js'
          display: 'short'
          vendor: [
            'bower_components/jquery/dist/jquery.min.js'
            'bower_components/platform/platform.js'
            'bower_components/polymer/polymer.js'
          ]
      single:
        options:
          display: 'short'
          vendor: [
            'bower_components/jquery/dist/jquery.min.js'
            'bower_components/platform/platform.js'
            'bower_components/polymer/polymer.js'
          ]

    uglify:
      main:
        files:
          grunt.file.expandMapping(
            [
              'public/components/**/*.js'
              '!public/components/**/*.min.js'
            ]
            ''
            {
              rename: (dest, path) =>
                path.replace('.js', '.min.js')
            }
          )
        options:
          sourceMap: true
          sourceMapIn: (path) =>
            path + '.map'

    symlink:
      expanded:
        files: [
          {
            expand: true
            overwrite: true
            cwd: 'bower_components/bootstrap/dist'
            src: ['*']
            dest: 'public/lib/bootstrap'
          }
          {
            expand: true
            overwrite: true
            cwd: 'bower_components/jquery/dist'
            src: ['*']
            dest: 'public/lib/jquery'
          }
          {
            expand: true
            overwrite: true
            cwd: 'bower_components/platform'
            src: ['platform.js', 'platform.js.map']
            dest: 'public/lib/platform'
          }
          {
            expand: true
            overwrite: true
            cwd: 'bower_components/polymer'
            src: ['polymer.js', 'polymer.js.map', 'polymer.html', 'layout.html']
            dest: 'public/lib/polymer'
          }
        ]

    clean:
      all: [
        'public/lib/*'
        'public/components/**/*.js'
        'public/components/**/*.js.map'
      ]
      intermediate: [
        'public/components/**/*.js'
        'public/components/**/*.js.map'
        '!public/components/**/*.min.js'
        '!public/components/**/*.min.js.map'
      ]

