//we need at least the vendor task and deafault task for combining all the file together

var gulp=require('gulp'),
concat=require('gulp-concat'),
plumber=require('gulp-plumber'),
gulpif=require('gulp-if'),
ngAnnotate=require('gulp-ng-annotate'),
uglify=require('gulp-uglify'),
header=require('gulp-header');
var csso = require('gulp-csso');

var banner=['/**',
'* Ecommerce',
'* (c) 2015 Mohammad Karimi',
'* License : MIT',
'Last Update <%= new Date().toUTCString() %>',
'*/',
''].join('\n');


/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
 gulp.task('minify',function () {
 	return gulp.src([
      /*
      'public/js/vendor/jquery-1.8.3.min.js',
      'public/js/vendor/jquery.elevatezoom.js',*/
 	'public/js/vendor/angular.js',
      'public/js/vendor/angular-messages.js',
      'public/js/vendor/angular-route.js',
      'public/js/vendor/angular-ui-bootstrap.js',
      'public/js/vendor/angular-ui-router.js',
      'public/js/vendor/angular-animate.js',
      'public/js/vendor/moment.min.js',
      //for using in full screen overly
      'public/js/vendor/modernizr.custom.js'
      //,'public/js/vendor/classie.js'
      ,'public/app.js'
      ,'public/controllers/*.js'
      ,'public/services/*.js'
      ,'public/filters/*.js'
      ,'public/directives/*.js'
     ]).pipe(concat('app.min.js'))
       .pipe(ngAnnotate())
       .pipe(uglify())
       .pipe(header(banner))
       .pipe(gulp.dest('public'))
       });

 /*
Minify css files
 */
 gulp.task('styles',function () {
 	return gulp.src([
 		'public/stylesheets/bootstrap.css'
            ,'public/stylesheets/elegant-icons-style.css'
            ,'public/stylesheets/EcommerceStyle.css'
            ,'public/stylesheets/animations.css'
 		]).pipe(concat('styles.min.css')).
      pipe(csso()).
      pipe(gulp.dest('public/stylesheets'))
 });

 gulp.task('watch',function (argument) {
       //watching any change in js files
       gulp.watch(['public/**/*.js','!public/app.min.js','!public/js/vendor/*.js'],['minify']);
       //watching any css files changes
       gulp.watch(['public/stylesheets/*.css','!public/stylesheets/styles.min.css'],['styles']);
 });

 gulp.task('default',['minify','styles','watch']);