// Импортируем функции из gulp, которые используются для работы с задачами
const { src, dest, watch, parallel, series } = require('gulp');

// Подключаем gulp-sass для компиляции SCSS в CSS
const scss = require('gulp-sass')(require('sass'));

// Подключаем gulp-concat для объединения нескольких файлов в один
const concat = require('gulp-concat');

// Подключаем gulp-uglify-es для минимизации JavaScript файлов
const uglify = require('gulp-uglify-es').default;

// Подключаем browser-sync для обновления браузера при изменении файлов
const browserSync = require('browser-sync').create();

// Подключаем gulp-clean для удаления файлов или папок
const clean = require('gulp-clean');

// Подключаем gulp-postcss для обработки CSS с помощью PostCSS-плагинов
const postcss = require('gulp-postcss');

// Подключаем autoprefixer для добавления вендорных префиксов в CSS
const autoprefixer = require('autoprefixer');

// Функция для обработки стилей
function styles() {
    return src('app/scss/style.scss') // Указываем исходный файл SCSS
        .pipe(postcss([autoprefixer({ overrideBrowserslist: ['last 10 versions'] })])) // Добавляем вендорные префиксы
        .pipe(concat('style.min.css')) // Объединяем всё в один CSS-файл
        .pipe(scss({ style: 'compressed' }).on('error', scss.logError)) // Компилируем SCSS в сжатый CSS
        .pipe(dest('app/css')) // Сохраняем результат в папку 'app/css'
        .pipe(browserSync.stream()) // Обновляем браузер
}

// Функция для обработки JavaScript
function scripts() {
    return src(['app/js/main.js']) // Указываем исходный JavaScript файл
        .pipe(concat('main.min.js')) // Объединяем всё в один JS-файл
        .pipe(uglify()) // Минимизируем JavaScript
        .pipe(dest('app/js')) // Сохраняем результат в папку 'app/js'
        .pipe(browserSync.stream()) // Обновляем браузер
}




// Функция для наблюдения за изменениями файлов
function watching() {
    watch(['app/scss/style.scss'], styles); // Следим за изменениями SCSS и вызываем styles
    watch(['app/js/main.js', '!app/js/main.min.js'], scripts); // Следим за изменениями JS и вызываем scripts
    watch(['app/**/*.html']).on('change', browserSync.reload); // Следим за HTML-файлами и обновляем браузер
}

// Функция для запуска локального сервера
function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/' // Указываем папку для сервера
        }
    });
}

// Функция для очистки папки dist
function cleanDist() {
    return src('dist') // Указываем папку для очистки
        .pipe(clean()); // Удаляем её содержимое
}

// Функция для сборки проекта в папку dist
function building() {
    return src([
        'app/css/style.min.css', // Добавляем сжатый CSS
        'app/js/main.min.js', // Добавляем сжатый JavaScript
        'app/**/*.html' // Копируем HTML-файлы
    ], { base: 'app' }) // Сохраняем структуру папок
        .pipe(dest('dist')); // Сохраняем всё в папку dist
}

// Экспортируем задачи для использования в командной строке
exports.styles = styles; // Экспорт функции обработки стилей
exports.scripts = scripts; // Экспорт функции обработки JS
exports.browsersync = browsersync; // Экспорт функции запуска сервера
exports.watching = watching; // Экспорт функции наблюдения за файлами


// Экспорт задачи сборки проекта
exports.build = series(cleanDist, building); // Последовательное выполнение очистки и сборки

// Экспорт задачи по умолчанию
exports.default = parallel(styles, scripts, browsersync, watching); // Параллельное выполнение задач
