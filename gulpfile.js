  var
  // JMMDEBUG get gulp4 package.json dep off github & onto npm as soon as
  // possible.
  gulp = require('gulp'),
  browserify = require('browserify'),
  watchify = require('watchify'),
  vss = require('vinyl-source-stream'),
  vbuffer = require('vinyl-buffer'),
  babelify = require('babelify'),
  uglify = require('gulp-uglify'),
  exorcist = require('exorcist'),
  fs = require('fs'),
  del = require('del'),
  path = require('path'),
  gulpif = require('gulp-if'),
  hoganify = require('hoganify'),
  bulkify = require('bulkify'),
  eslintify = require('eslintify'),
  glob = require('globby'),
  // Build process config
  cfg = {
    watch: process.argv.indexOf('--watch') >= 0,
  },
  env = process.env.NODE_ENV || 'development',
  enable_source_maps = env !== 'production',
  paths = {};

cfg.paths = paths;

paths.dist = path.join(__dirname, 'dist');
paths.app = {};
paths.app.dist = path.join(paths.dist, 'app');
paths.app.dist_rsrc = path.join(paths.app.dist, 'rsrc');
paths.test = {};
paths.test.dist = path.join(paths.dist, 'test');

cfg.libs = {
  jquery: require.resolve('jquery/dist/jquery.js'),
  underscore: require.resolve('underscore/underscore.js'),
  backbone: require.resolve('backbone/backbone.js'),
};

/**
 * Empty app dist dir.
 */
gulp.task('build:empty', function (cb) {
  del([paths.app.dist], cb);
});
// build:empty

/**
 * Copy app static files to dist dir.
 */
gulp.task('build:copy', function () {
  var files = [
    'src/*.html',
    'src/rsrc/jeopardy.css',
  ];

  if (cfg.watch) {
    gulp.watch(files, copy);
  }

  return copy();

  function copy (event) {
    var copy_files = [].concat((event && event.path) || files);
    return gulp
      .src(copy_files, {base: "src"})
      .pipe(gulp.dest(paths.app.dist));
  }
  // copy
});
// build:copy

/**
 * Build app libs dist file.
 */
gulp.task('build:libs', function (done) {
  var out_file = "libs.js";

  var noParse;
  // Args for b.require() calls.
  var requires = [];

  noParse = Object.keys(cfg.libs).map(function (key) {
    requires.push([cfg.libs[key], {expose: key}]);
    return cfg.libs[key];
  });

  var b = browserify({
    noParse: noParse,
    debug: enable_source_maps,
  });

  requires.forEach(function (args) {
    b.require.apply(b, args);
  });

  return b
    .bundle()
    .pipe(vss(out_file))
    .pipe(gulpif(env === 'production', vbuffer()))
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(cfg.paths.app.dist_rsrc));
});
// build:libs

/**
 * Browserify app.
 */
function bundle () {
  var pathmod = require('pathmodify');

  var
    out_file = 'app.js',
    dest = paths.app.dist_rsrc,
    b_opts;

  b_opts = {
    debug: enable_source_maps,
  };

  if (cfg.watch) {
    b_opts.cache = {};
    b_opts.packageCache = {};
  }

  var b = browserify([
    './src/rsrc/jeopardy',
  ], b_opts);

  var opts = {};
  opts.mods = [
    pathmod.mod.dir('app', path.join(__dirname, 'src', 'rsrc'), true),
    pathmod.mod.dir('jeopardy', function (rec) {
      return {
        id: rec.id,
        expose: rec.id,
      };
    }),
  ];

  b.plugin(pathmod(), opts);

  b.external(Object.keys(cfg.libs));

  b
    .transform(eslintify)
    .transform(babelify.configure({
      sourceMapRelative: path.join(__dirname, 'src'),
    }), {global: false})
    .transform(hoganify)
    .transform(bulkify);

  if (cfg.watch) {
    b = watchify(b);
    b.on('update', function (ids) {
      console.log("Bundle updated: " + ids.join(", "));
      bundle();
    });
  }

  return bundle();

  function bundle () {
    return b
      .bundle()
      .on('error', function (err) {
        console.log("Error: " + err);
      })
      .pipe(exorcist(dest + "/" + out_file + ".map"))
      .pipe(vss(out_file))
      .pipe(gulpif(env === 'production', vbuffer()))
      .pipe(gulpif(env === 'production', uglify()))
      .pipe(gulp.dest(dest));
  }
  // bundle
}
// bundle

gulp.task('build:bundle', bundle);
// build:bundle

/**
 * Empty test dist dir.
 */
gulp.task('build:test:empty', function test_empty (done) {
  del([paths.test.dist], done);
});

/**
 * Perform complete test build. Copy and browserify files.
 */
gulp.task('build:test', gulp.series('build:test:empty', function (done) {
  var
    pending = 0,
    temp = {},
    dest = ['.', 'dist', 'test'],
    test_dir = path.join(__dirname, 'test'),
    b,
    b_opts = {};

  b_opts.basedir = test_dir;

  if (cfg.watch) {
    b_opts.cache = {};
    b_opts.packageCache = {};
  }

  function all_done () {
    if (--pending === 0) done();
  }

  [
    path.join.apply(path, dest.slice(0, -1)),
    path.join.apply(path, dest),
  ].forEach(function (dir) {
    try {
      fs.mkdirSync(dir);
    }
    catch (e) {}
  });

  pending++;
  gulp
    .src([
      'test/index.html',
    ])
    .pipe(
      gulp.dest(paths.test.dist)
        .on('finish', all_done)
    );

    pending++;
    gulp
      .src([
        'mocha/mocha.css',
        'mocha/mocha.js',
        'chai/chai.js',
        'sinon/pkg/sinon.js',
      ].map(function (path) {
        return require.resolve(path);
      }), {base: path.join(__dirname, 'node_modules')})
      .pipe(
        gulp.dest('dist/test/lib')
          .on('finish', all_done)
      );


  var tests = glob.sync([
    'unit/**/*.js',
  ], {cwd: test_dir})
    .map(function (test) {
      return require.resolve(path.join(test_dir, test));
    });

  b_opts.entries = b_opts.noParse = tests;

  pending++;
  b = browserify(b_opts);
  b.require('assert', {expose: 'app/assert'});
  b.require('underscore', {expose: 'underscore'});

  if (cfg.watch) {
    b = watchify(b);
    b.on('update', function (ids) {
      console.log("Bundle updated: " + ids.join(", "));
      bundle();
    });
  }

  bundle();

  function bundle () {
    b.bundle()
      .pipe(fs.createWriteStream(path.join.apply(
        path, dest.concat('bundle.js')
      )).on('finish', all_done));
  }
  // bundle
}));
// build:test

/**
 * Perform complete app build.
 */
gulp.task('build', gulp.series(
  'build:empty',
  'build:copy',
  'build:libs',
  'build:bundle'
));
// build

/**
 * Perform complete app and test builds.
 */
gulp.task('build:all', gulp.series('build', 'build:libs', 'build:test'));
