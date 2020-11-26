const {src, dest, series, watch} = require('gulp')
const include = require('gulp-file-include')
const del = require('del')
const sync = require('browser-sync').create()
const webpack = require('webpack-stream')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const prefixer = require('gulp-autoprefixer')

function html() {
    return src('src/**.html')
      .pipe(include({
        prefix: '@@'
      }))
      .pipe(dest('dist/'))
  }
  
function clear() {
    return del('dist')
}
 
function scss() {
  return src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(csso())
    .pipe(dest('dist/style/'))
}

function js() {
  return src('src/js/**/main.js')
    .pipe(webpack({
      mode: 'development',
      output: {
          filename: 'script.js'
      },
      watch: false,
      devtool: "source-map",
      module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', {
                      debug: true,
                      corejs: 3,
                      useBuiltIns: "usage"
                  }]]
                }
              }
            }
          ]
        }
    }))
    .pipe(dest('dist/js/'))
}

function img() {
  return src('src/img/**/*.{png,jpg,jpeg,gif,webp,svg}')
    .pipe(dest('dist/img'))
}

function icons() {
    return src('src/icons/**/*.{svg,png,gif}')
      .pipe(dest('dist/icons'))
}

function fonts() {
    return src('src/fonts/**/*.{eot,ttf,woff,woff2}')
    .pipe(dest('dist/fonts'))
}

function serve() {
    sync.init({
      server: {
        baseDir: "./dist",
        directory: true
      },
      port: 4000
    })
  
    watch('src/**/*.html', series(html)).on('change', sync.reload)
    watch('src/scss/**/*.scss', series(scss)).on('change', sync.reload)
    watch('src/js/**/*.js', series(js)).on('change', sync.reload)
    watch('src/img/**/*.{png,jpg,jpeg,gif,webp,svg}', series(img)).on('change', sync.reload)
    watch('src/fonts/**/*.{eot,ttf,woff,woff2}', series(fonts)).on('change', sync.reload)
    watch('src/icons/**/*.{svg,png,gif}', series(icons)).on('change', sync.reload)
}

  function htmlB() {
    return src('src/**.html')
      .pipe(include({
        prefix: '@@'
      }))
      .pipe(dest('build/'))
  }

  function clearB() {
    return del('build')
  }

  function scssB() {
  return src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(csso())
    .pipe(dest('build/style/'))
  }

  function jsB() {
  return src('src/js/**/main.js')
    .pipe(webpack({
      mode: 'production',
      output: {
          filename: 'script.js'
      },
      watch: false,
      module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', {
                      debug: true,
                      corejs: 3,
                      useBuiltIns: "usage"
                  }]]
                }
              }
            }
          ]
        }
    }))
    .pipe(dest('build/js/'))
  }

  function imgB() {
  return src('src/img/**/*.{png,jpg,jpeg,gif,webp,svg}')
    .pipe(dest('build/img'))
  }

  function iconsB() {
    return src('src/icons/**/*.{svg,png,gif}')
      .pipe(dest('build/icons'))
  }

  function fontsB() {
    return src('src/fonts/**/*.{eot,ttf,woff,woff2}')
    .pipe(dest('build/fonts'))
  }


exports.build = series(clearB, htmlB, scssB, jsB, imgB, fontsB, iconsB)
exports.dist = series(clear, html, scss, js, img, fonts, icons, serve)
exports.clear = clear



