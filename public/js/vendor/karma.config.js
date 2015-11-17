/// <reference path="../../controllers/unitTest.js" />
/// <reference path="../../app.js" />
/// <reference path="../../filter/labelCase.js" />
// Karma configuration
// Generated on Sat Jan 24 2015 13:23:31 GMT+0330 (Iran Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


      // list of files / patterns to load in the browser
      //important note is if you split the project to main part and
      //controller and service and factory and filter you should 
      //be careful about the order of the files include in this part
      //for this example we need to include the app and controller respectivly
      //in any other case we will recive error that indicate that can not find the app
    files: [
      'angular.js',
      'angular-mocks.js',
      '*.js',
      'tests/*.js',
      '../../*.js',
      '../../controllers/*.js',
      '../../filter/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
