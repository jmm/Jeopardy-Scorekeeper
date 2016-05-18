"use strict";

var assign = Object.assign;
var babelify = require("babelify");
var browserify = require("browserify");
var del = require("del");
var fs = require("fs");
// TODO:FIXME get gulp4 package.json dep off github & onto npm as soon as
// possible.
var gulp = require("gulp");
var gulpif = require("gulp-if");
var logger = require("gulplog");
var path = require("path");
var pathmodify = require("pathmodify");
var stream = require("readable-stream");
var uglify = require("gulp-uglify");
var vbuffer = require("vinyl-buffer");
var vss = require("vinyl-source-stream");
var watchify = require("watchify");

// Build-process config
var cfg = {
  env: process.env.NODE_ENV || 'development',
  watch: process.argv.indexOf('--watch') >= 0,
};

var enable_source_maps = cfg.env !== 'production';

var paths = {};

cfg.paths = paths;

paths.dist = path.join(__dirname, 'dist');
paths.app = {};
paths.app.dist = path.join(paths.dist, 'app');
paths.app.dist_rsrc = path.join(paths.app.dist, 'rsrc');
paths.test = {};
paths.test.dist = path.join(paths.dist, 'test');

// Libraries to bundle separately from app.
cfg.libs = {};
[
  "react",
  "react-dom",
  "react-redux",
  "redux",
].forEach(function (lib) {
  cfg.libs[lib] = lib;
});

if (cfg.env === "development") {
  // Enable overriding config by passing pathname of module with custom cfg. For
  // customizing config during dev with an untracked file.
  // Usage: gulp build --build-cfg=path/to/file
  // The custom config module exports a function that accepts the config hash
  // and modifies.
  process.argv.forEach(function (arg) {
    var matches = arg.match(/--build-cfg[ =](.+)/);

    if (matches) {
      require(matches[1].trim())(cfg);
    }
  });
}

/**
 * Empty app dist dir.
 */
gulp.task('build:empty', function () {
  return del([paths.app.dist]);
});
// build:empty

/**
 * Copy app static files to dist dir.
 */
gulp.task('build:copy', function () {
  var files = [
    'src/*.html',
    'src/rsrc/*.css',
  ];

  if (cfg.watch) {
    gulp.watch(files)
    .on("change", copy);
  }

  return copy();

  // Will have no arg when called initially, and pathname when called on change.
  function copy (pathname) {
    var copy_files = [].concat(pathname || files);

    var path = pathname;

    return gulp
      .src(copy_files, {base: "src"})
      .pipe(stream.Transform({
        objectMode: true,
        transform: function (file, enc, done) {
          var msg = "Copying ";
          if (pathname) msg += "watched ";
          msg += "file: " + file.path;
          logger.info(msg);
          done(null, file);
        },
      }))
      .pipe(gulp.dest(paths.app.dist));
  }
  // copy
});
// build:copy

gulp.task("build:bundle", bundle);
function bundle () {
  var
    out_file = 'app.js',
    browserify_opts;

  browserify_opts = {
    debug: enable_source_maps,
  };

  if (cfg.watch) {
    browserify_opts.cache = {};
    browserify_opts.packageCache = {};
  }

  var b = browserify("./src/rsrc/app", browserify_opts);

  if (cfg.env === "development" && cfg.initStateFile) {
    // Enable bootstrapping initial state in dev with an untracked file.
    b.require(cfg.initStateFile, {expose: "app/initial-state"})
  }

  Object.keys(cfg.libs).forEach(function (lib) {
    b.external(lib);
  });

  b
  .transform(babelify, {
    sourceMaps: enable_source_maps,
  })
  .plugin(pathmodify, {mods: [
    pathmodify.mod.dir("app", path.join(__dirname, "src", "rsrc")),
  ]})
  ;

  if (cfg.watch) {
    b = watchify(b)
    .on("update", function (ids) {
      logger.info("Bundle updated with: " + ids.join(", "));
      browserifyBundle();
    })
    ;
  }

  function browserifyBundle () {
    return b
    .plugin(require("browserify-require-not-found-parent"))
    .bundle()
    .on("error", function (err) {
      console.error(err.stack);
    })
    .pipe(vss(out_file))
    .pipe(gulpif(cfg.env === 'production', vbuffer()))
    .pipe(gulpif(cfg.env === 'production', uglify()))
    .pipe(gulp.dest(paths.app.dist_rsrc))
    ;
  }
  // browserifyBundle

  return browserifyBundle();
}
// bundle

/**
 * Build app libs dist file.
 */
gulp.task("build:libs", function (done) {
  var out_file = "libs.js";

  // Args for b.require() calls.
  var requires = Object.keys(cfg.libs).map(function (key) {
    return [cfg.libs[key], {expose: key}];
  });

  var b = browserify({
    debug: enable_source_maps,
  });

  if (cfg.env === "development") {
    var perfEntry = new stream.PassThrough;
    perfEntry.end('window.Perf = require("react-addons-perf");');
    b.add(perfEntry);
  }

  requires.forEach(function (args) {
    b.require.apply(b, args);
  });

  return b
    .bundle()
    .pipe(vss(out_file))
    .pipe(gulpif(cfg.env === 'production', vbuffer()))
    .pipe(gulpif(cfg.env === 'production', uglify()))
    .pipe(gulp.dest(cfg.paths.app.dist_rsrc));
});
// build:libs

/**
 * Perform complete app build.
 */
gulp.task("build", gulp.series(
  "build:empty",
  "build:copy",
  gulp.parallel(
    "build:libs",
    "build:bundle"
  )
));
// build
