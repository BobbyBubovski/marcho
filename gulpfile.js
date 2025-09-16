// // Импортируем функции из gulp, которые используются для работы с задачами
// const { src, dest, watch, parallel, series } = require('gulp');

// // Подключаем gulp-sass для компиляции SCSS в CSS
// const scss = require('gulp-sass')(require('sass'));

// // Подключаем gulp-concat для объединения нескольких файлов в один
// const concat = require('gulp-concat');

// // Подключаем gulp-uglify-es для минимизации JavaScript файлов
// const uglify = require('gulp-uglify-es').default;

// // Подключаем browser-sync для обновления браузера при изменении файлов
// const browserSync = require('browser-sync').create();

// // Подключаем gulp-clean для удаления файлов или папок
// const clean = require('gulp-clean');

// // Подключаем gulp-postcss для обработки CSS с помощью PostCSS-плагинов
// const postcss = require('gulp-postcss');

// // Подключаем autoprefixer для добавления вендорных префиксов в CSS
// const autoprefixer = require('autoprefixer');

// // Функция для обработки стилей
// function styles() {
//     return src('app/scss/style.scss') // Указываем исходный файл SCSS
//         .pipe(postcss([autoprefixer({ overrideBrowserslist: ['last 10 versions'] })])) // Добавляем вендорные префиксы
//         .pipe(concat('style.min.css')) // Объединяем всё в один CSS-файл
//         .pipe(scss({ style: 'compressed' }).on('error', scss.logError)) // Компилируем SCSS в сжатый CSS
//         .pipe(dest('app/css')) // Сохраняем результат в папку 'app/css'
//         .pipe(browserSync.stream()) // Обновляем браузер
// }

// // Функция для обработки JavaScript
// function scripts() {
//     return src(['app/js/main.js']) // Указываем исходный JavaScript файл
//         .pipe(concat('main.min.js')) // Объединяем всё в один JS-файл
//         .pipe(uglify()) // Минимизируем JavaScript
//         .pipe(dest('app/js')) // Сохраняем результат в папку 'app/js'
//         .pipe(browserSync.stream()) // Обновляем браузер
// }

// // Функция для наблюдения за изменениями файлов
// function watching() {
//     watch(['app/scss/style.scss'], styles); // Следим за изменениями SCSS и вызываем styles
//     watch(['app/js/main.js', '!app/js/main.min.js'], scripts); // Следим за изменениями JS и вызываем scripts
//     watch(['app/**/*.html']).on('change', browserSync.reload); // Следим за HTML-файлами и обновляем браузер
// }

// // Функция для запуска локального сервера
// function browsersync() {
//     browserSync.init({
//         server: {
//             baseDir: 'app/' // Указываем папку для сервера
//         }
//     });
// }

// // Функция для очистки папки dist
// function cleanDist() {
//     return src('dist') // Указываем папку для очистки
//         .pipe(clean()); // Удаляем её содержимое
// }

// // Функция для сборки проекта в папку dist
// function building() {
//     return src([
//         'app/css/style.min.css', // Добавляем сжатый CSS
//         'app/js/main.min.js', // Добавляем сжатый JavaScript
//         'app/**/*.html' // Копируем HTML-файлы
//     ], { base: 'app' }) // Сохраняем структуру папок
//         .pipe(dest('dist')); // Сохраняем всё в папку dist
// }

// // Экспортируем задачи для использования в командной строке
// exports.styles = styles; // Экспорт функции обработки стилей
// exports.scripts = scripts; // Экспорт функции обработки JS
// exports.browsersync = browsersync; // Экспорт функции запуска сервера
// exports.watching = watching; // Экспорт функции наблюдения за файлами

// // Экспорт задачи сборки проекта
// exports.build = series(cleanDist, building); // Последовательное выполнение очистки и сборки

// // Экспорт задачи по умолчанию
// exports.default = parallel(styles, scripts, browsersync, watching); // Параллельное выполнение задач

// Импортируем функции из gulp, которые используются для работы с задачами
const { src, dest, watch, parallel, series } = require("gulp");

// Подключаем необходимые плагины
const scss = require("gulp-sass")(require("sass")); // Компиляция SCSS
const concat = require("gulp-concat"); // Объединение файлов
const uglify = require("gulp-uglify-es").default; // Минификация JS
const browserSync = require("browser-sync").create(); // Сервер и автообновление
const clean = require("gulp-clean"); // Удаление папок/файлов
const rename = require("gulp-rename");
const postcss = require("gulp-postcss"); // Обработка CSS
const autoprefixer = require("autoprefixer"); // Добавление вендорных префиксов
const newer = require("gulp-newer"); // Обработка только изменённых файлов
// const imagemin = require('gulp-imagemin');
const nunjucksRender = require("gulp-nunjucks-render");

// Функция для обработки стилей
function styles() {
  return (
    src("app/scss/*.scss", "app/module/**/*.scss") // Указываем исходный SCSS файл
      //.pipe(concat()) // Объединяем в один файл
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(newer("app/css/style.min.css")) // Проверяем, изменился ли файл
      .pipe(
        postcss([autoprefixer({ overrideBrowserslist: ["last 10 versions"] })])
      ) // Добавляем префиксы
      .pipe(
        scss({ style: "compressed" }).on("error", function (err) {
          console.error("SCSS ошибка:", err.message); // Логируем ошибку
          this.emit("end"); // Позволяем Gulp продолжить работу
        })
      )
      .pipe(dest("app/css")) // Сохраняем скомпилированный CSS
      .pipe(browserSync.stream())
  ); // Обновляем браузер
}

function nunjucks() {
  return src("app/*.njk")
    .pipe(nunjucksRender())
    .pipe(dest("app"))
    .pipe(browserSync.stream());
}

// Функция для обработки JavaScript
function scripts() {
  return src([
    "node_modules/jquery/dist/jquery.js",
    "node_modules/slick-carousel/slick/slick.js",
    "node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js",
    "node_modules/@rateyo/jquery/lib/iife/jquery.rateyo.js",
    "node_modules/ion-rangeslider/js/ion.rangeSlider.js",
    "node_modules/jquery-form-styler/dist/jquery.formstyler.js",
    "app/js/main.js",
  ]) // Указываем исходный JS файл
    .pipe(newer("app/js/main.min.js")) // Проверяем, изменился ли файл
    .pipe(concat("main.min.js")) // Объединяем в один файл
    .pipe(uglify()) // Минимизируем JavaScript
    .pipe(dest("app/js")) // Сохраняем минифицированный JS
    .pipe(browserSync.stream()); // Обновляем браузер
}

// Функция для наблюдения за изменениями файлов
function watching() {
  watch(
    ["app/**/*.scss", "app/module/**/*.scss"],
    { usePolling: true },
    styles
  ).on("change", () => {
    console.log("SCSS файл изменён");
  }); // Следим за SCSS файлами
  watch(
    ["app/js/main.js", "!app/js/main.min.js"],
    { usePolling: true },
    scripts
  ).on("change", () => {
    console.log("JS файл изменён");
  }); // Следим за JS файлами
  watch(["app/**/*.html"], { usePolling: true }).on("change", () => {
    console.log("HTML файл изменён");
    browserSync.reload(); // Обновляем браузер
  }); // Следим за HTML файлами
  watch(["app/*.njk"], nunjucks);
}

// Функция для запуска локального сервера
function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/", // Указываем папку для сервера
    },
    notify: false, // Отключаем уведомления BrowserSync
    open: true, // Автоматически открываем браузер
    port: 3000, // Устанавливаем порт
  });
  console.log("BrowserSync запущен");
}

// Функция для очистки папки dist
function cleanDist() {
  return src("dist", { allowEmpty: true }) // Указываем папку для очистки
    .pipe(clean()); // Удаляем её содержимое
}

async function images() {
  const imagemin = (await import("gulp-imagemin")).default; // Загружаем gulp-imagemin через import()

  return src("app/images/**/*.*") // Берем все изображения
    .pipe(imagemin()) // Сжимаем изображения
    .pipe(dest("dist/images")); // Сохраняем в папку dist/images
}
// Функция для сборки проекта в папку dist
function building() {
  return src(
    [
      "app/css/style.min.css", // Добавляем сжатый CSS
      "app/js/main.min.js", // Добавляем сжатый JavaScript
      "app/**/*.html", // Копируем HTML-файлы
    ],
    { base: "app" }
  ) // Сохраняем структуру папок
    .pipe(dest("dist")); // Сохраняем всё в папку dist
}

// Экспортируем задачи для использования в командной строке
exports.styles = styles; // Обработка стилей
exports.scripts = scripts; // Обработка JS
// exports.images = images;
exports.browsersync = browsersync; // Запуск локального сервера
exports.watching = watching; // Наблюдение за файлами
exports.nunjucks = nunjucks;

// Сборка проекта
exports.build = series(cleanDist, building); // Очистка папки и сборка

// Задача по умолчанию
exports.default = parallel(nunjucks, styles, scripts, browsersync, watching); // Параллельное выполнение задач
