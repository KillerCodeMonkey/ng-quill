(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["quill"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("quill"));
    } else {
        root.Requester = factory(root.Quill);
    }
}(this, function (Quill) {

    'use strict';

    var app;
    // declare ngQuill module
    app = angular.module('ngQuill', []);

    app.provider('ngQuillConfig', function () {
        var config = {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    [{ 'direction': 'rtl' }],                         // text direction

                    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    [{ 'font': [] }],
                    [{ 'align': [] }],

                    ['clean'],                                         // remove formatting button

                    ['link', 'image', 'video']                         // link and image, video
                ]
            },
            theme: 'snow',
            placeholder: 'Insert text here ...',
            readOnly: false,
            boundary: document.body
        };

        this.set = function (modules, theme, placeholder, formats, boundary, readOnly) {
            if (modules) {
                config.modules = modules;
            }
            if (theme) {
                config.theme = theme;
            }
            if (placeholder) {
                config.placeholder = placeholder;
            }
            if (boundary) {
                config.boundary = boundary;
            }
            if (readOnly) {
                config.readOnly = readOnly;
            }
            if (formats) {
                config.formats = formats;
            }
        };

        this.$get = function () {
            return config;
        };
    });

    app.component('ngQuillEditor', {
        bindings: {
            'modules': '<modules',
            'theme': '@?',
            'readOnly': '<?',
            'formats': '<?',
            'placeholder': '@?',
            'onEditorCreated': '&?',
            'onContentChanged': '&?',
            'ngModel': '<',
            'maxLength': '<',
            'minLength': '<'
        },
        require: {
            ngModelCtrl: 'ngModel'
        },
        template: '<div></div>',
        controller: ['$scope', '$element', '$q', 'ngQuillConfig', function ($scope, $element, $q, ngQuillConfig) {
            var vm = this,
                config = {},
                content,
                editorElem,
                modelChanged = false,
                editorChanged = false,
                editor,
                editorCreatedDeferred = $q.defer(),
                editorCreatedPromise = editorCreatedDeferred.promise;

            vm.validate = function (text) {
                if (vm.maxLength) {
                    if (text.length > vm.maxLength + 1) {
                        vm.ngModelCtrl.$setValidity('maxlength', false)
                    } else {
                        vm.ngModelCtrl.$setValidity('maxlength', true)
                    }
                }

                if (vm.minLength > 1) {
                    // validate only if text.length > 1
                    if (text.length <= vm.minLength && text.length > 1) {
                        vm.ngModelCtrl.$setValidity('minlength', false)
                    } else {
                        vm.ngModelCtrl.$setValidity('minlength', true)
                    }
                }
            }

            vm.$onChanges = function (changes) {
                if (changes.ngModel && changes.ngModel.currentValue !== changes.ngModel.previousValue) {
                    content = changes.ngModel.currentValue;

                    if (editor && !editorChanged) {
                        modelChanged = true;
                        if (content) {
                            editor.pasteHTML(content);
                            return;
                        }
                        editor.setText('');
                    }
                    editorChanged = false;
                }
                if (editor && changes.readOnly) {
                    editor.enable(!changes.readOnly.currentValue);
                }
            };

            vm.$onInit = function () {
                 config = {
                    theme: vm.theme || ngQuillConfig.theme,
                    readOnly: vm.readOnly || ngQuillConfig.readOnly,
                    modules: vm.modules || ngQuillConfig.modules,
                    formats: vm.formats || ngQuillConfig.formats,
                    placeholder: vm.placeholder ||  ngQuillConfig.placeholder,
                    boundary: ngQuillConfig.boundary,
                }
            };

            vm.$postLink = function () {
                editorElem = $element[0].children[0];

                $scope.$applyAsync(function() {
                    // init editor
                    editor = new Quill(editorElem, config);
                    editorCreatedDeferred.resolve(editor);
                });

                editorCreatedPromise.then(function() {
                    // mark model as touched if editor lost focus
                    editor.on('selection-change', function (range) {
                        if (range) {
                            return;
                        }
                        $scope.$applyAsync(function () {
                            vm.ngModelCtrl.$setTouched();
                        });
                    });

                    // update model if text changes
                    editor.on('text-change', function () {
                        var html = editorElem.children[0].innerHTML;
                        var text = editor.getText();

                        if (html === '<p><br></p>') {
                            html = null;
                        }
                        vm.validate(text);

                        if (!modelChanged) {
                            $scope.$applyAsync(function () {
                                editorChanged = true;

                                vm.ngModelCtrl.$setViewValue(html);

                                if (vm.onContentChanged) {
                                    vm.onContentChanged({
                                        editor: editor,
                                        html: html,
                                        text: text
                                    });
                                }
                            });
                        }
                        modelChanged = false;
                    });

                    // set initial content
                    if (content) {
                        modelChanged = true;

                        editor.pasteHTML(content);
                    }

                    // provide event to get informed when editor is created -> pass editor object.
                    if (vm.onEditorCreated) {
                        vm.onEditorCreated({editor: editor});
                    }
                });
            };
        }]
    });
}));
