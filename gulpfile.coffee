gulp = require 'gulp'
typescript  = require 'gulp-typescript'
symlink = require 'gulp-symlink'
sourcemaps = require 'gulp-sourcemaps'
clean = require 'gulp-clean'
uglify = require 'gulp-uglify'
tslint = require 'gulp-tslint'
lintspaces = require 'gulp-lintspaces'
rs = require 'run-sequence'
lazypipe = require 'lazypipe'
karma = require 'gulp-karma'
espower = require 'gulp-espower'
through = require 'through2'
concat = require 'gulp-concat'

libArray = [
  {'name': 'bootstrap', 'src': 'bower_components/bootstrap/dist/*'}
  {'name': 'jquery','src': 'bower_components/jquery/dist/*'}
  {'name': 'platform','src': 'bower_components/platform/platform.js*'}
  {'name': 'polymer','src': ['bower_components/polymer/polymer.js*', 'bower_components/polymer/*.html']}
]
gulp.task 'clear-symlink', () ->
  gulp.src 'public/lib/*'
  .pipe clean
    force: true
libArray.forEach (lib) ->
  gulp.task 'symlink-' + lib.name, () ->
    gulp.src lib.src
    .pipe symlink 'public/lib/' + lib.name
gulp.task 'symlink', () ->
  rs 'clear-symlink', libArray.map (lib) -> 'symlink-' + lib.name

productBase = 'public/components/wgl/'
specBase = 'test/components/wgl/'
productTs = productBase + '**/*.ts'
specTs = specBase + '**/*.ts'

lint = lazypipe()
.pipe tslint
.pipe tslint.report, 'verbose'
.pipe lintspaces,
  editorconfig: '.editorconfig'
.pipe lintspaces.reporter

buildUglify = lazypipe()
.pipe typescript
.pipe uglify

withSourcemap = (_lazypipe) ->
  lazypipe()
  .pipe sourcemaps.init
  .pipe _lazypipe
  .pipe sourcemaps.write, './'

buildSpec = lazypipe()
.pipe lint
.pipe typescript
.pipe espower

runSpec = () ->
  gulp.src [
    'bower_components/platform/platform.js'
    'bower_components/jquery/dist/jquery.min.js'
    'bower_components/bootstrap/dist/js/bootstrap.min.js'
    'bower_components/polymer/polymer.js'
    'bower_components/power-assert/build/power-assert.js'
    productBase + '**/*.js'
    specBase + '**/*.js'
  ]
  .pipe karma
    configFile: 'karma.conf.js',
    action: 'run'

tsRefPath = (pathToRoot) ->
  if pathToRoot.lastIndexOf('/') == pathToRoot.length - 1
    pathToRoot = pathToRoot.slice 0, -1
  addTsRefPath = through.obj (file, enc, cb) ->
    if file.isStream()
      this.emit 'error', new Error 'Streams are not supported!'
      return cb()
    else if file.isBuffer()
      pathFromRoot = file.path.substring(file.cwd.length).replace /\\/g, '/'
      file.contents = new Buffer "///<reference path='#{pathToRoot}#{pathFromRoot}'/>"
    this.push file
    cb()
  addTsRefPath

gulp.task 'ts-ref-path', () ->
  gulp.src productTs
  .pipe tsRefPath '../../..'
  .pipe concat 'ref.ts'
  .pipe gulp.dest specBase

gulp.task 'build-product', () ->
  gulp.src productTs
  .pipe lint()
  .pipe withSourcemap(buildUglify)()
  .pipe gulp.dest productBase
gulp.task 'build-spec', ['ts-ref-path'], () ->
  gulp.src specTs
  .pipe buildSpec()
  .pipe gulp.dest specBase
gulp.task 'build', ['build-product', 'build-spec']

specDependencies = [
  'bower_components/platform/platform.js'
  'bower_components/jquery/dist/jquery.min.js'
  'bower_components/bootstrap/dist/js/bootstrap.min.js'
  'bower_components/polymer/polymer.js'
  'bower_components/power-assert/build/power-assert.js'
]
gulp.task 'spec', runSpec

getDir = (path) ->
  _path = path.replace /\\/g, '/' # for Windows
  _path.substring 0, _path.lastIndexOf '/'

onWatchError = (error) ->
  console.log(error.toString());
  this.emit('watch-error')

gulp.task 'watch', () ->
  gulp.watch productTs, (event) ->
    gulp.src event.path
    .pipe lint()
    .pipe buildUglify()
    .on 'error', onWatchError
    .pipe gulp.dest getDir event.path
    .on 'end', () ->
      runSpec()
      .on 'error', onWatchError
  gulp.watch specTs, (event) ->
    gulp.src event.path
    .pipe buildSpec()
    .on 'error', onWatchError
    .pipe gulp.dest getDir event.path
    .on 'end', () ->
      runSpec()
      .on 'error', onWatchError
