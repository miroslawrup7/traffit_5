const gulp = require("gulp");
const { src, dest, watch, series, parallel } = require("gulp");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const terser = require("gulp-terser");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browsersync = require("browser-sync").create();
const clean = require("gulp-clean");

const paths = {
    all: {
        dest: "./dist/*",
    },
    html: {
        src: ["./src/**/*.html"],
        dest: "./dist/",
    },
    DB: {
        src: ["./src/config/*.json"],
        dest: "./dist/config/",
    },
    images: {
        src: ["./src/img/**/*"],
        dest: "./dist/img/",
    },
    styles: {
        src: ["./src/scss/**/*.scss"],
        dest: "./dist/css/",
    },
    scripts: {
        src: ["./src/js/**/*.js"],
        dest: "./dist/js/",
    },
    cachebust: {
        src: ["./dist/**/*.html"],
        dest: "./dist/",
    },
};

function clear() {
    return src(paths.all.dest, {
        read: false,
    }).pipe(clean());
}

function clearHtml() {
    return src(".dist/*", {
        read: false,
    }).pipe(clean());
}

function clearDB() {
    return src(paths.DB.dest, {
        read: false,
    }).pipe(clean());
}

function clearCss() {
    return src(paths.styles.dest, {
        read: false,
    }).pipe(clean());
}

function clearImg() {
    return src(paths.images.dest, {
        read: false,
    }).pipe(clean());
}

function clearScripts() {
    return src(paths.scripts.dest, {
        read: false,
    }).pipe(clean());
}

function copyHtml() {
    return src(paths.html.src).pipe(dest(paths.html.dest));
}

function copyDB() {
    return src(paths.DB.src).pipe(dest(paths.DB.dest));
}

function optimizeImages() {
    return src(paths.images.src)
        .pipe(imagemin().on("error", (error) => console.log(error)))
        .pipe(dest(paths.images.dest));
}

function compileStyles() {
    return src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write("."))
        .pipe(dest(paths.styles.dest));
}

function minifyScripts() {
    return src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(concat("all.js"))
        .pipe(terser().on("error", (error) => console.log(error)))
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write("."))
        .pipe(dest(paths.scripts.dest));
}

function cacheBust() {
    return src(paths.cachebust.src)
        .pipe(replace(/cache_bust=\d+/g, "cache_bust=" + new Date().getTime()))
        .pipe(dest(paths.cachebust.dest));
}

function browserSync(cb) {
    browsersync.init({
        server: {
            baseDir: paths.html.dest,
        },
        port: 3000,
    });
    cb();
}

function browserSyncReload(cb) {
    browsersync.reload();
    cb();
}

function watcher() {
    watch(
        paths.html.src,
        series(clearHtml, copyHtml, cacheBust, browserSyncReload)
    );
    watch(
        paths.DB.src,
        series(clearDB, copyDB, cacheBust, browserSyncReload)
    );
    watch(
        paths.images.src, 
        series(clearImg, optimizeImages)
    );
    watch(
        paths.styles.src,
        series(clearCss, compileStyles, cacheBust, browserSyncReload)
    );
    watch(
        paths.scripts.src,
        series(clearScripts, minifyScripts, cacheBust, browserSyncReload)
    );
}

exports.copyHtml = copyHtml;
exports.copyDB = copyDB;
exports.optimizeImages = optimizeImages;
exports.compileStyles = compileStyles;
exports.minifyScripts = minifyScripts;
exports.cacheBust = cacheBust;
exports.watcher = watcher;
exports.browserSync = browserSync;
exports.clear = clear;
exports.clearCss = clearCss;
exports.clearImg = clearImg;
exports.clearScripts = clearScripts;
exports.clearHtml = clearHtml;

exports.default = series(
    clear,
    parallel(copyHtml, copyDB, optimizeImages, compileStyles, minifyScripts),
    cacheBust,
    browserSync,
    watcher
);
