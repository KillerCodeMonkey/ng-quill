/* global describe, beforeEach, angular, expect, it, jasmine, inject, spyOn, Quill */

describe('ng-quill', function () {
  var defaultConfig = {
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
    bounds: document.body
  }

  beforeEach(module('ngQuill'))

  describe('component: ngQuillEditor', function () {
    var $componentController,
      $compile,
      $rootScope,
      $timeout

    var createTestElement = function (htmlString, scope) {
      var element = angular.element(htmlString)
      $compile(element)(scope)
      scope.$apply()

            // flush timeout(s) for all code under test.
      $timeout.flush()

            // this will throw an exception if there are any pending timeouts.
      $timeout.verifyNoPendingTasks()

      return element
    }

    beforeEach(inject(function (_$componentController_, _$compile_, _$rootScope_, _$timeout_) {
      $componentController = _$componentController_
      $rootScope = _$rootScope_
      $compile = _$compile_
      $timeout = _$timeout_
    }))

    it('should set default bindings', function () {
      var scope = $rootScope.$new()
      scope.model = ''
      var element = createTestElement('<ng-quill-editor ng-model="model"><toolbar></toolbar></ng-quill-editor>', scope)

      var ctrl = $componentController('ngQuillEditor', {
        $element: element,
        $transclude: {
          isSlotFilled: angular.noop
        }
      }, {})

      expect(ctrl.$onChanges).toEqual(jasmine.any(Function))
      expect(ctrl.$postLink).toEqual(jasmine.any(Function))
      expect(ctrl.$onInit).toEqual(jasmine.any(Function))

      expect(ctrl.theme).toBeUndefined()
      expect(ctrl.module).toBeUndefined()
      expect(ctrl.readOnly).toBeUndefined()
      expect(ctrl.formats).toBeUndefined()
      expect(ctrl.bounds).toBeUndefined()
      expect(ctrl.placeholder).toBeUndefined()
      expect(ctrl.onEditorCreated).toBeUndefined()
      expect(ctrl.onContentChanged).toBeUndefined()
      expect(ctrl.onSelectionChanged).toBeUndefined()
    })

    it('should render default editor', inject(function (_ngQuillConfig_) {
      var scope = $rootScope.$new()
      scope.model = ''
      var element = createTestElement('<ng-quill-editor ng-model="model"></ng-quill-editor>', scope)

      expect(element[0].querySelectorAll('div.ql-toolbar.ql-snow').length).toBe(1)
      expect(element[0].querySelectorAll('div.ql-editor').length).toBe(1)
      expect(element[0].querySelector('div.ql-editor').dataset.placeholder).toEqual(_ngQuillConfig_.placeholder)
    }))

    it('should render editor with initial model', function () {
      var scope = $rootScope.$new()
      scope.model = '1234'
      var element = createTestElement('<ng-quill-editor ng-model="model"></ng-quill-editor>', scope)

      expect(element[0].querySelector('div.ql-editor').textContent).toEqual('1234')
    })

    it('should render editor with changed model', function () {
      var scope = $rootScope.$new()
      scope.model = '1234'

      var element = createTestElement('<ng-quill-editor ng-model="model"></ng-quill-editor>', scope)

      scope.model = '12345'
      scope.$apply()

      expect(element[0].querySelector('div.ql-editor').textContent).toEqual('12345')
    })

    it('should render editor without changed model', function () {
      var scope = $rootScope.$new()
      scope.model = '1234'
      var element = createTestElement('<ng-quill-editor ng-model="model"></ng-quill-editor>', scope)

      scope.model = ''
      scope.$apply()

      expect(element[0].querySelector('div.ql-editor').textContent).toEqual('')
    })

    it('should render editor with custom placeholder', function () {
      var scope = $rootScope.$new()
      var element = createTestElement('<ng-quill-editor ng-model="model" placeholder="\'1234\'"></ng-quill-editor>', scope)

      expect(element[0].querySelector('div.ql-editor').dataset.placeholder).toEqual('1234')
    })

    it('should render editor with empty placeholder', function () {
      var scope = $rootScope.$new()
      var element = createTestElement('<ng-quill-editor ng-model="model" placeholder="\'\'"></ng-quill-editor>', scope)

      expect(element[0].querySelector('div.ql-editor').dataset.placeholder).not.toBeDefined()
    })

    it('should render editor with custom toolbar', function () {
      var scope = $rootScope.$new()
      var element = createTestElement(
                '<ng-quill-editor ng-model="model" placeholder="\'1234\'"><ng-quill-toolbar><div><span class="ql-formats"><button class="ql-bold" ng-attr-title="{{\'Bold\'}}"></button></span></div></ng-quill-toolbar></ng-quill-editor>',
                scope
            )

      expect(element[0].querySelector('button.ql-bold[title=Bold]')).toBeDefined()
    })

    it('should update placeholder', function () {
      var scope = $rootScope.$new()
      scope.placeholder = 'asdf'
      var element = createTestElement(
                '<ng-quill-editor ng-model="model" placeholder="placeholder"></ng-quill-editor>',
                scope
            )

      scope.placeholder = 'test'
      scope.$apply()

      expect(element[0].querySelector('div.ql-editor').dataset.placeholder).toEqual('test')
    })

    it('should set styles', function () {
      var scope = $rootScope.$new()
      scope.styles = {
        backgroundColor: 'red'
      }
      var element = createTestElement(
                '<ng-quill-editor ng-model="model" styles="styles"></ng-quill-editor>',
                scope
            )
      scope.$apply()

      expect(element[0].querySelector('div.ql-container').style.backgroundColor).toEqual('red')
    })

    it('should dynamic set styles', function () {
      var scope = $rootScope.$new()
      scope.styles = {
        backgroundColor: 'red'
      }
      var element = createTestElement(
                '<ng-quill-editor ng-model="model" styles="styles"></ng-quill-editor>',
                scope
            )
      scope.$apply()

      scope.styles = {
        backgroundColor: 'gray'
      }
      scope.$apply()

      expect(element[0].querySelector('div.ql-container').style.backgroundColor).toEqual('gray')
    })

    it('should format text', function () {
      var scope = $rootScope.$new()
      scope.model = 'test'
      var editor

      scope.editorCreated = function (editor_) {
        editor = editor_
      }
      createTestElement(
          '<ng-quill-editor ng-model="model" bounds="\'self\'" on-editor-created="editorCreated(editor)" format="text"></ng-quill-editor>',
          scope
      )
      scope.$apply()

      scope.model = 'hallo'
      scope.$apply()
      expect(editor.getText()).toEqual('hallo\n')

      editor.setText('1234')
      scope.$apply()

      expect(scope.model).toEqual('1234\n')
    })

    it('should format object', function () {
      var scope = $rootScope.$new()
      scope.model = [
        { insert: 'Hello ' },
        { insert: 'World!', attributes: { bold: true } },
        { insert: '\n' }
      ]
      var editor

      scope.editorCreated = function (editor_) {
        editor = editor_
      }
      createTestElement(
          '<ng-quill-editor ng-model="model" on-editor-created="editorCreated(editor)" format="object"></ng-quill-editor>',
          scope
      )
      scope.$apply()

      scope.model = [
        { insert: 'Hello ' },
        { insert: '\n' }
      ]
      scope.$apply()
      expect(JSON.stringify(editor.getContents())).toEqual(JSON.stringify({'ops': [{ insert: 'Hello \n' }]}))

      editor.setContents([{ insert: 'test' }])
      scope.$apply()

      expect(JSON.stringify(scope.model)).toEqual(JSON.stringify({ ops: [{'insert': 'test\n'}] }))
    })

    it('should format json string', function () {
      var scope = $rootScope.$new()
      scope.model = JSON.stringify([
        { insert: 'Hello ' },
        { insert: 'World!', attributes: { bold: true } },
        { insert: '\n' }
      ])
      var editor

      scope.editorCreated = function (editor_) {
        editor = editor_
      }
      createTestElement(
          '<ng-quill-editor ng-model="model" on-editor-created="editorCreated(editor)" format="json"></ng-quill-editor>',
          scope
      )
      scope.$apply()

      scope.model = JSON.stringify([
        { insert: 'Hello ' },
        { insert: '\n' }
      ])
      scope.$apply()
      expect(JSON.stringify(editor.getContents())).toEqual(JSON.stringify({'ops': [{ insert: 'Hello \n' }]}))

      editor.setContents([{ insert: '\n' }])
      scope.$apply()

      expect(scope.model).toEqual(JSON.stringify({'ops': [{ 'insert': '\n' }]}))
    })

    it('should format html and sanitize string', function () {
      var scope = $rootScope.$new()
      scope.model = '<p>Hello <img src="asdf.jpg" onerror="alert(\'sanitize init\')"></p>'
      var editor

      scope.editorCreated = function (editor_) {
        editor = editor_
      }
      createTestElement(
          '<ng-quill-editor ng-model="model" sanitize="true" on-editor-created="editorCreated(editor)" format="html"></ng-quill-editor>',
          scope
      )
      scope.$apply()
      expect(JSON.stringify(editor.getContents())).toEqual(JSON.stringify({ 'ops': [{ 'insert': 'Hello ' }, { 'insert': {'image': 'asdf.jpg'} }, { 'insert': '\n' }] }))

      scope.model = '<p>Hello World <img src="asdf.jpg" onerror="alert(\'sanitize\')"></p>'
      scope.$apply()
      expect(JSON.stringify(editor.getContents())).toEqual(JSON.stringify({ ops: [{ insert: 'Hello World ' }, {insert: { image: 'asdf.jpg' }}, {insert: '\n'}] }))

      editor.setContents([{ insert: 'Hello you!' }, { insert: '\n' }])
      scope.$apply()

      expect(scope.model).toEqual('<p>Hello you!</p>')
    })

    it('should set editor to readOnly', function () {
      var scope = $rootScope.$new()
      scope.readOnly = true

      var element = createTestElement('<ng-quill-editor ng-model="model" read-only="readOnly"></ng-quill-editor>', scope)

      expect(element[0].querySelector('div.ql-editor').getAttribute('contenteditable')).toEqual('false')

      scope.readOnly = false
      scope.$apply()

      expect(element[0].querySelector('div.ql-editor').getAttribute('contenteditable')).toEqual('true')
    })

    it('should format json string as text if invalid', function () {
      var scope = $rootScope.$new()
      scope.model = JSON.stringify([
        { insert: 'Hello ' },
        { insert: 'World!', attributes: { bold: true } },
        { insert: '\n' }
      ]) + '{'
      var editor

      scope.editorCreated = function (editor_) {
        editor = editor_
      }
      createTestElement(
          '<ng-quill-editor ng-model="model" on-editor-created="editorCreated(editor)" format="json"></ng-quill-editor>',
          scope
      )
      scope.$apply()

      expect(editor.getText()).toMatch(JSON.stringify([
        { insert: 'Hello ' },
        { insert: 'World!', attributes: { bold: true } },
        { insert: '\n' }
      ]) + '{')

      scope.model = JSON.stringify([
        { insert: 'Hello' }
      ]) + '{'
      scope.$apply()

      expect(editor.getText().trim()).toEqual(JSON.stringify([
        { insert: 'Hello' }
      ]) + '{')
    })

    it('should call onEditorCreated after editor created', function () {
      var scope = $rootScope.$new()
      var quillEditor
      scope.editorCreated = function (editor) {
        quillEditor = editor
      }

      spyOn(scope, 'editorCreated').and.callThrough()

      createTestElement('<ng-quill-editor ng-model="model" on-editor-created="editorCreated(editor)"></ng-quill-editor>', scope)

      expect(scope.editorCreated).toHaveBeenCalled()
      expect(quillEditor).toBeDefined()
      expect(quillEditor).toEqual(jasmine.any(Quill))
    })

    it('should call onContentChanged after editor content changed', function () {
      var scope = $rootScope.$new()
      var editor, oldDelta, delta

      scope.editorCreated = function (editor_) {
        editor = editor_
      }

      scope.contentChanged = function (editor_, html_, text_, delta_, oldDelta_, source_) {
        oldDelta = oldDelta_
        delta = delta_
      }

      spyOn(scope, 'contentChanged').and.callThrough()

      createTestElement('<ng-quill-editor ng-model="model" on-editor-created="editorCreated(editor)" on-content-changed="contentChanged(editor, html, text, delta, oldDelta, source)"></ng-quill-editor>', scope)

      editor.setText('1234')
      scope.$apply()

      expect(scope.contentChanged).toHaveBeenCalledWith(editor, '<p>1234</p>', '1234\n', delta, oldDelta, 'api')
    })

    it('should not call onContentChanged after editor content changed', function () {
      var scope = $rootScope.$new()
      var editor

      scope.editorCreated = function (editor_) {
        editor = editor_
      }

      scope.contentChanged = angular.noop

      spyOn(scope, 'contentChanged')

      createTestElement('<ng-quill-editor ng-model="model" on-editor-created="editorCreated(editor)"></ng-quill-editor>', scope)

      editor.setText('1234')
      scope.$apply()

      expect(scope.contentChanged).not.toHaveBeenCalled()
      expect(scope.model).toEqual('<p>1234</p>')
    })

    it('should set invalid if init model > maxlength', function () {
      var scope = $rootScope.$new()
      scope.model = '1234'

      var element = createTestElement('<ng-quill-editor ng-model="model" max-length="3"></ng-quill-editor>', scope)

      expect(element[0].className).toMatch('ng-invalid-maxlength')
    })

    it('should set valid if init model <= maxlength', function () {
      var scope = $rootScope.$new()
      scope.model = '1234'

      var element = createTestElement('<ng-quill-editor ng-model="model" max-length="4"></ng-quill-editor>', scope)

      expect(element[0].className).toMatch('ng-valid-maxlength')
    })

    it('should set invalid if init model < minlength', function () {
      var scope = $rootScope.$new()
      scope.model = '12'
      var element = createTestElement('<ng-quill-editor ng-model="model" min-length="3"></ng-quill-editor>', scope)

      expect(element[0].className).toMatch('ng-invalid-minlength')
    })

    it('should set valid if minlength <= 1', function () {
      var scope = $rootScope.$new()
      scope.model = '12'

      var element = createTestElement('<ng-quill-editor ng-model="model" min-length="1"></ng-quill-editor>', scope)

      expect(element[0].className).not.toMatch('ng-invalid-minlength')

      scope.model = '2'
      scope.$apply()
      expect(element[0].className).not.toMatch('ng-invalid-minlength')
    })

    it('should not set invalid-min-length if empty', function () {
      var scope = $rootScope.$new()
      scope.model = ''

      var element = createTestElement('<ng-quill-editor ng-model="model" min-length="8"></ng-quill-editor>', scope)

      expect(element[0].className).not.toMatch('ng-invalid-minlength')

      scope.model = '1234'
      scope.$apply()
      expect(element[0].className).toMatch('ng-invalid-minlength')

      scope.model = ''
      scope.$apply()
      expect(element[0].className).toMatch('ng-valid-minlength')
    })

    it('should set valid if init model >= minlength', function () {
      var scope = $rootScope.$new()
      scope.model = '1234'

      var element = angular.element('<ng-quill-editor ng-model="model" min-length="4"></ng-quill-editor>', scope)
      $compile(element)(scope)

      scope.$apply()
                        // flush timeout(s) for all code under test.
      $timeout.flush()

            // this will throw an exception if there are any pending timeouts.
      $timeout.verifyNoPendingTasks()
      expect(element[0].className).toMatch('ng-valid-minlength')
    })
  })

  describe('service: ngQuillConfig', function () {
    it('should return default config', inject(function (_ngQuillConfig_) {
      expect(_ngQuillConfig_).toEqual(defaultConfig)
    }))
  })

  describe('provider: ngQuillConfigProvider - change everything', function () {
    beforeEach(function () {
      module(function (_ngQuillConfigProvider_) {
        _ngQuillConfigProvider_.set({
          modules: {},
          theme: 'test',
          placeholder: ' ',
          formats: [],
          readOnly: true,
          bounds: true
        })
      })
    })

    it('should return custom config', inject(function (_ngQuillConfig_) {
      expect(_ngQuillConfig_).toEqual({
        modules: {},
        theme: 'test',
        placeholder: '',
        formats: [],
        readOnly: true,
        bounds: true
      })
    }))
  })

  describe('provider: ngQuillConfigProvider - change nothing', function () {
    beforeEach(function () {
      module(function (_ngQuillConfigProvider_) {
        _ngQuillConfigProvider_.set()
      })
    })

    it('should return custom config', inject(function (_ngQuillConfig_) {
      expect(_ngQuillConfig_).toEqual(defaultConfig)
    }))
  })
})
