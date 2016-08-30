module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
                files: {
                    "src/ng-quill.min.js": "src/ng-quill.min.js"
                }
            }
        },
        umd: {
            all: {
                options: {
                    src: 'src/ng-quill.js',
                    dest: 'src/ng-quill.min.js', // optional, if missing the src will be used
                    deps: { // optional, `default` is used as a fallback for rest!
                        'default': ['Quill', 'angular'],
                        amd: ['Quill', 'angular'],
                        cjs: ['quill', 'angular']
                    }
                }
            }
        },
        karma: {
            unit: {
                configFile: './karma.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['umd', 'uglify']);
};
