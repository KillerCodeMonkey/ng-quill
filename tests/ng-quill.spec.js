describe('ng-quill', function () {
    beforeEach(module('ngQuill'));

    describe('component: ngQuillEditor', function () {
        var $componentController,
            $compile,
            $rootScope;

        beforeEach(inject(function(_$componentController_, _$compile_, _$rootScope_) {
            $componentController = _$componentController_;
            $rootScope = _$rootScope_;
            $compile = _$compile_;
        }));

        it('should set default bindings', function () {
            var scope = $rootScope.$new();
            scope.model = '';
            var element = angular.element('<ng-quill-editor ng-model="model"></ng-quill-editor>');
            $compile(element)(scope);

            var ctrl = $componentController('ngQuillEditor', {
                $element: element
            }, {});

            expect(ctrl.$onChanges).toEqual(jasmine.any(Function));
            expect(ctrl.$postLink).toEqual(jasmine.any(Function));
            expect(ctrl.$onInit).toEqual(jasmine.any(Function));

            expect(ctrl.theme).toBeUndefined();
            expect(ctrl.module).toBeUndefined();
            expect(ctrl.readOnly).toBeUndefined();
            expect(ctrl.formats).toBeUndefined();
            expect(ctrl.placeholder).toBeUndefined();
            expect(ctrl.onEditorCreated).toBeUndefined();
            expect(ctrl.onContentChanged).toBeUndefined();
        });

        it('should render default editor', inject(function (_ngQuillConfig_) {
            var scope = $rootScope.$new();
            scope.model = '';
            var element = angular.element('<ng-quill-editor ng-model="model"></ng-quill-editor>');
            $compile(element)(scope);

            scope.$apply();

            expect(element[0].querySelectorAll('div.ql-toolbar.ql-snow').length).toBe(1);
            expect(element[0].querySelectorAll('div.ql-editor').length).toBe(1);
            expect(element[0].querySelector('div.ql-editor').dataset.placeholder).toEqual(_ngQuillConfig_.placeholder);
        }));

        it('should render editor with initial model', function () {
            var scope = $rootScope.$new();
            scope.model = '1234';
            var element = angular.element('<ng-quill-editor ng-model="model"></ng-quill-editor>');
            $compile(element)(scope);

            scope.$apply();

            expect(element[0].querySelector('div.ql-editor').textContent).toEqual('1234');
        });

        it('should render editor with custom placeholder', function () {
            var scope = $rootScope.$new();
            var element = angular.element('<ng-quill-editor placeholder="1234" ng-model="model"></ng-quill-editor>');
            $compile(element)(scope);

            scope.$apply();

            expect(element[0].querySelector('div.ql-editor').dataset.placeholder).toEqual('1234');
        });

        it('should set editor to readOnly', function () {
            var scope = $rootScope.$new();
            scope.readOnly = true;
            var element = angular.element('<ng-quill-editor ng-model="model" read-only="readOnly"></ng-quill-editor>');
            $compile(element)(scope);

            scope.$apply();

            expect(element[0].querySelector('div.ql-editor').getAttribute('contenteditable')).toEqual('false');

            scope.readOnly = false;
            scope.$apply();

            expect(element[0].querySelector('div.ql-editor').getAttribute('contenteditable')).toEqual('true');
        });

        it('should call onEditorCreated after editor created', function () {
            var scope = $rootScope.$new();
            var quillEditor;
            scope.editorCreated = function (editor) {
                quillEditor = editor;
            };

            spyOn(scope, 'editorCreated').and.callThrough();

            var element = angular.element('<ng-quill-editor ng-model="model" on-editor-created="editorCreated(editor)"></ng-quill-editor>');
            $compile(element)(scope);

            scope.$apply();

            expect(scope.editorCreated).toHaveBeenCalled();
            expect(quillEditor).toBeDefined();
            expect(quillEditor).toEqual(jasmine.any(Quill));
        });

        it('should call onContentChanged after editor content changed', function () {
            var scope = $rootScope.$new();
            var editor, text, html;

            scope.editorCreated = function (editor_) {
                editor = editor_;
            };

            scope.contentChanged = function (editor_, html_, text_) {};

            spyOn(scope, 'contentChanged');

            var element = angular.element('<ng-quill-editor ng-model="model" on-editor-created="editorCreated(editor)" on-content-changed="contentChanged(editor, html, text)"></ng-quill-editor>');
            $compile(element)(scope);

            scope.$apply();

            editor.setText('1234');
            scope.$apply();

            expect(scope.contentChanged).toHaveBeenCalledWith(editor, '<p>1234</p>', '1234\n');
        });
    });

    describe('service: ngQuillConfig', function () {
        var ngQuillConfig;

        beforeEach(inject(function (_ngQuillConfig_) {
            ngQuillConfig = _ngQuillConfig_; 
        }));

        it('should return default config', function () {
            expect(ngQuillConfig).toEqual({
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
            });
        });
    });

    describe('provider: ngQuillConfigProvider', function () {
        var ngQuillConfigProvider;
        var ngQuillConfig;

        beforeEach(function () {
            module(function (_ngQuillConfigProvider_) {
                ngQuillConfigProvider = _ngQuillConfigProvider_; // to use the provider in other parts
                ngQuillConfigProvider.set({}, 'test', ' ', [], true, true);
            });
        });
        beforeEach(inject(function (_ngQuillConfig_) {
            ngQuillConfig = _ngQuillConfig_; 
        }));

        it('should return custom config', function () {
            expect(ngQuillConfig).toEqual({
                modules: {},
                theme: 'test',
                placeholder: ' ',
                formats: [],
                readOnly: true,
                boundary: true
            });
        });
    })
});
