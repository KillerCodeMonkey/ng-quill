/* globals define, angular */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['quill'], factory)
  } else if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = factory(require('quill'))
  } else {
    root.Requester = factory(root.Quill)
  }
}(this, function (Quill) {
  'use strict'

  var app
  // declare ngQuill module
  app = angular.module('ngQuill', ['ngSanitize'])

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
      bounds: document.body
    }

    this.set = function (customConf) {
      customConf = customConf || {}

      if (customConf.modules) {
        config.modules = customConf.modules
      }
      if (customConf.theme) {
        config.theme = customConf.theme
      }
      if (customConf.placeholder !== null && customConf.placeholder !== undefined) {
        config.placeholder = customConf.placeholder.trim()
      }
      if (customConf.bounds) {
        config.bounds = customConf.bounds
      }
      if (customConf.readOnly) {
        config.readOnly = customConf.readOnly
      }
      if (customConf.formats) {
        config.formats = customConf.formats
      }
    }

    this.$get = function () {
      return config
    }
  })

  app.component('ngQuillEditor', {
    bindings: {
      'modules': '<modules',
      'theme': '@?',
      'readOnly': '<?',
      'format': '@?',
      'formats': '<?',
      'placeholder': '<?',
      'bounds': '<?',
      'scrollingContainer': '<?',
      'strict': '<?',
      'onEditorCreated': '&?',
      'onContentChanged': '&?',
      'onSelectionChanged': '&?',
      'ngModel': '<',
      'maxLength': '<',
      'minLength': '<',
      'customOptions': '<?',
      'styles': '<?',
      'sanitize': '<?'
    },
    require: {
      ngModelCtrl: 'ngModel'
    },
    transclude: {
      'toolbar': '?ngQuillToolbar'
    },
    template: '<div class="ng-hide" ng-show="$ctrl.ready"><ng-transclude ng-transclude-slot="toolbar"></ng-transclude></div>',
    controller: ['$scope', '$element', '$sanitize', '$timeout', '$transclude', 'ngQuillConfig', function ($scope, $element, $sanitize, $timeout, $transclude, ngQuillConfig) {
      var config = {}
      var content
      var editorElem
      var format = 'html'
      var modelChanged = false
      var editorChanged = false
      var editor
      var placeholder = ngQuillConfig.placeholder
      var textChangeEvent
      var selectionChangeEvent

      this.setter = function (value) {
        if (format === 'html') {
          return editor.clipboard.convert(this.sanitize ? $sanitize(value) : value)
        } else if (this.format === 'json') {
          try {
            return JSON.parse(value)
          } catch (e) {
            return [{ insert: value }]
          }
        }

        return value
      }

      this.validate = function (text) {
        var textLength = text.trim().length
        if (this.maxLength) {
          if (textLength > this.maxLength) {
            this.ngModelCtrl.$setValidity('maxlength', false)
          } else {
            this.ngModelCtrl.$setValidity('maxlength', true)
          }
        }

        if (this.minLength > 0) {
          if (textLength < this.minLength && textLength) {
            this.ngModelCtrl.$setValidity('minlength', false)
          } else {
            this.ngModelCtrl.$setValidity('minlength', true)
          }
        }
      }

      this.$onChanges = function (changes) {
        if (changes.ngModel && changes.ngModel.currentValue && changes.ngModel.currentValue !== changes.ngModel.previousValue) {
          content = changes.ngModel.currentValue

          if (editor && !editorChanged) {
            modelChanged = true
            if (content) {
              if (this.format === 'text') {
                editor.setText(content)
              } else {
                editor.setContents(
                  this.setter(content)
                )
              }
            } else {
              editor.setText('')
            }
          }
          editorChanged = false
        }
        else if (editor && changes.ngModel && !changes.ngModel.currentValue) {
          editor.setText('')
        }

        if (editor && changes.readOnly) {
          editor.enable(!changes.readOnly.currentValue)
        }

        if (editor && changes.placeholder) {
          editor.root.dataset.placeholder = changes.placeholder.currentValue
        }

        if (editor && editorElem && changes.styles) {
          var currentStyling = changes.styles.currentValue
          var previousStyling = changes.styles.previousValue

          if (previousStyling) {
            for (var key in previousStyling) {
              editorElem.style[key] = ''
            }
          }
          if (currentStyling) {
            for (var activeStyle in currentStyling) {
              if (currentStyling.hasOwnProperty(activeStyle)) {
                editorElem.style[activeStyle] = currentStyling[activeStyle]
              }
            }
          }
        }
      }

      this.$onInit = function () {
        if (this.placeholder !== null && this.placeholder !== undefined) {
          placeholder = this.placeholder.trim()
        }

        if (this.format && ['object', 'html', 'text', 'json'].indexOf(this.format) > -1) {
          format = this.format
        }

        config = {
          theme: this.theme || ngQuillConfig.theme,
          readOnly: this.readOnly || ngQuillConfig.readOnly,
          modules: this.modules || ngQuillConfig.modules,
          formats: this.formats || ngQuillConfig.formats,
          placeholder: placeholder,
          bounds: this.bounds || ngQuillConfig.bounds,
          strict: this.strict,
          scrollingContainer: this.scrollingContainer
        }
      }

      this.$postLink = function () {
        // create quill instance after dom is rendered
        $timeout(function () {
          this._initEditor()
        }.bind(this), 0)
      }

      this.$onDestroy = function () {
        editor = null

        if (textChangeEvent) {
          textChangeEvent.removeListener('text-change')
        }
        if (selectionChangeEvent) {
          selectionChangeEvent.removeListener('selection-change')
        }
      }

      this._initEditor = function () {
        var $editorElem = angular.element('<div></div>')
        var container = $element.children()

        editorElem = $editorElem[0]

        if (config.bounds === 'self') {
          config.bounds = editorElem
        }

        // set toolbar to custom one
        if ($transclude.isSlotFilled('toolbar')) {
          config.modules.toolbar = container.find('ng-quill-toolbar').children()[0]
        }

        if (this.styles) {
          for (var activeStyle in this.styles) {
            if (this.styles.hasOwnProperty(activeStyle)) {
              editorElem.style[activeStyle] = this.styles[activeStyle]
            }
          }
        }

        container.append($editorElem)

        if (this.customOptions) {
          this.customOptions.forEach(function (customOption) {
            var newCustomOption = Quill.import(customOption.import)
            newCustomOption.whitelist = customOption.whitelist
            if (customOption.toRegister) {
              newCustomOption[customOption.toRegister.key] = customOption.toRegister.value
            }
            Quill.register(newCustomOption, true)
          })
        }

        editor = new Quill(editorElem, config)

        this.ready = true

        // mark model as touched if editor lost focus
        selectionChangeEvent = editor.on('selection-change', function (range, oldRange, source) {
          if (this.onSelectionChanged) {
            this.onSelectionChanged({
              editor: editor,
              oldRange: oldRange,
              range: range,
              source: source
            })
          }

          if (range) {
            return
          }
          $scope.$applyAsync(function () {
            this.ngModelCtrl.$setTouched()
          }.bind(this))
        }.bind(this))

        // update model if text changes
        textChangeEvent = editor.on('text-change', function (delta, oldDelta, source) {
          var html = editorElem.children[0].innerHTML
          var text = editor.getText()
          var content = editor.getContents()

          var emptyModelTag = ['<' + editor.root.firstChild.localName + '>', '</' + editor.root.firstChild.localName + '>']

          if (html === emptyModelTag[0] + '<br>' + emptyModelTag[1]) {
            html = null
          }
          this.validate(text)

          if (!modelChanged) {
            $scope.$applyAsync(function () {
              editorChanged = true

              if (format === 'text') {
                this.ngModelCtrl.$setViewValue(text)
              } else if (format === 'object') {
                this.ngModelCtrl.$setViewValue(content)
              } else if (this.format === 'json') {
                try {
                  this.ngModelCtrl.$setViewValue(JSON.stringify(content))
                } catch (e) {
                  this.ngModelCtrl.$setViewValue(text)
                }
              } else {
                this.ngModelCtrl.$setViewValue(html)
              }

              if (this.onContentChanged) {
                this.onContentChanged({
                  editor: editor,
                  html: html,
                  text: text,
                  content: content,
                  delta: delta,
                  oldDelta: oldDelta,
                  source: source
                })
              }
            }.bind(this))
          }
          modelChanged = false
        }.bind(this))

        // set initial content
        if (content) {
          modelChanged = true

          if (format === 'text') {
            editor.setText(content, 'silent')
          } else if (format === 'object') {
            editor.setContents(content, 'silent')
          } else if (format === 'json') {
            try {
              editor.setContents(JSON.parse(content), 'silent')
            } catch (e) {
              editor.setText(content, 'silent')
            }
          } else {
            editor.setContents(editor.clipboard.convert(this.sanitize ? $sanitize(content) : content, 'silent'))
          }

          editor.history.clear()
        }

        // provide event to get informed when editor is created -> pass editor object.
        if (this.onEditorCreated) {
          this.onEditorCreated({editor: editor})
        }
      }
    }]
  })

  return app.name
}))
