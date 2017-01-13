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

    preprocessors: { './src/ng-quill.js': 'coverage' },

    autoWatch: true,

    frameworks: ['jasmine'],

    reporters: ['mocha', 'coverage'],

    singleRun: true,

    coverageReporter: {
      reporter: [{
        type : 'html',
        dir : 'coverage/'
      }, {
        type: 'text-summary'
      }]
    }
  });
};