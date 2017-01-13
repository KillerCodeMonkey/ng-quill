module.exports = function(config) {
  config.set({

    basePath: '',

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/quill/dist/quill.js',

      './src/ng-quill.js',

      './tests/ng-quill.spec.js',
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    reporters: ['mocha'],

    browsers: ['PhantomJS'],

    singleRun: true

  });
};