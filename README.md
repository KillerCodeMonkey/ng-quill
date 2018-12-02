# ng-quill [![Build Status](https://travis-ci.org/KillerCodeMonkey/ng-quill.svg?branch=develop)](https://travis-ci.org/KillerCodeMonkey/ng-quill)

<img src="https://cloud.githubusercontent.com/assets/2264672/12809927/fd4c3416-cb22-11e5-9b02-80ebd9138255.png" width="120">

[![NPM](https://nodei.co/npm/ng-quill.png)](https://nodei.co/npm/ng-quill/)

ng-quill is an [Angular.js](http://angularjs.org/) component for [Quill](http://quilljs.com/) rich text editor.

## Donate/Support

If you like my work, feel free to support it. Donations to the project are always welcomed :)

PayPal: [PayPal.Me/bengtler](PayPal.Me/bengtler)

BTC Wallet Address:
`3QVyr2tpRLBCw1kBQ59sTDraV6DTswq8Li`

ETH Wallet Address:
`0x394d44f3b6e3a4f7b4d44991e7654b0cab4af68f`

LTC Wallet Address:
`MFif769WSZ1g7ReAzzDE7TJVqtkFpmoTyT`

XRP Wallet Address:
`rXieaAC3nevTKgVu2SYoShjTCS2Tfczqx?dt=159046833`

## Examples

- [Advanced Demo](https://killercodemonkey.github.io/ng-quill/demo.html)
- [RequireJS](https://killercodemonkey.github.io/ng-quill/demoamd.html)

## Installation

- `npm install ng-quill`
- or download zip from release page: https://github.com/KillerCodeMonkey/ngQuill/releases
- or grab the latest release from cdn: https://cdnjs.com/libraries/ng-quill
- install peerDependencies `npm install angular angular-sanitize quill`

The new version is complete rewritten and is using QuillJS 1.x.
For the latest old version (0.20.1) checkout the special branch for it.

## Contribution

This project is using GitFlow --> All Changes and Pull-Requests have to be on develop-branch!
Changes directly in the master branch are not longer allowed and will be rejected.

## Usage

- load angular, quill, ngquill scripts in your index.html
- original sources are in src-folder, build files are in dist-folder
- add dependency to your app module `var myAppModule = angular.module('quillTest', ['ngQuill']);`
- use ngQuillConfigProvider to overwrite global settings in your config-Block
- use ngquill directive in your html
`<ng-quill-editor ng-model="message"></ng-quill-editor>`
- add this line to your css `[ng-quill-editor] { display: block; }`
- if you use it in a form and you are resetting it via $setPristine() -> you have to set editor.setText('') -> it will add the error class only, if the model has ng-dirty class
- add a custom toolbar using `ng-quill-toolbar` - it uses transclusion to add toolbar, avoids flickering and sets the modules toolbar config to the custom toolbar automatically:

Recommended Usage
--
```
<ng-quill-editor ng-model="title">
    <ng-quill-toolbar>
        <div>
            <span class="ql-formats">
                <button class="ql-bold" ng-attr-title="{{'Bold'}}"></button>
            </span>
            <span class="ql-formats">
                <select class="ql-align" ng-attr-title="{{'Aligment'}}">
                    <option selected></option>
                    <option value="center"></option>
                    <option value="right"></option>
                    <option value="justify"></option>
                </select>
                <select class="ql-align">
                    <option selected></option>
                    <option value="center"></option>
                    <option value="right"></option>
                    <option value="justify"></option>
                </select>
            </span>
        </div>
    </ng-quill-toolbar>
</ng-quill-editor>
```

**[Full Quill Toolbar HTML](https://github.com/quilljs/quill/blob/f75ff2973f068c3db44f949915eb8a74faf162a8/docs/_includes/full-toolbar.html)**

Alternative Usage
--
```
let app = angular.module('app', [ 'ngQuill' ])

app.constant('NG_QUILL_CONFIG', {
  /*
   * @NOTE: this config/output is not localizable.
   */
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
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
  placeholder: '',
  readOnly: false,
  bounds: document.body
})

app.config([
  'ngQuillConfigProvider',
  'NG_QUILL_CONFIG',

  function (ngQuillConfigProvider, NG_QUILL_CONFIG) {
    ngQuillConfigProvider.set(NG_QUILL_CONFIG)
  }
])
```
\**see:* ./src/ng-quill/app.provider('ngQuillConfig').config

## Configuration


- use `ngQuillConfigProvider.set({modules: { ... }, theme: 'snow', placeholder: 'placeholder', formats: { ... }, bounds: document.body, readyOnly: false) to config toolbar module, other modules, default theme, allowed formats, ...``
- set theme name: `theme="snow"` (default: 'snow')
- set readOnly: `read-only=""` (default: false) - requires true or false
- overwrite global config for each editor: `modules="modulesConfig"`
- set placeholder: `placeholder="'Inser your text here'"` or `placeholder="''"` for empty string
- set bounds: `bounds="..."`, change the default boundary element of the editor (`document.body`) - set it to 'self' and the editor element is used
- override formats: `formats="formatsArray"`, per default all quill formats are allowed
- set max-length: `max-length="5"`, adds validation for maxlength (sets model state to `invalid` and adds `ng-invalid-maxlength` class)
- set min-length: `min-length="5"`, adds validation for minlength (sets model state to `invalid` and adds `ng-invalid-minlength` class), only works for values > 1, if you only want to check if there is a value --> use required/ng-required
- set strict: activate/deactivate strict editor mode (default: `true`)
- set scrollingContainer: set html element or css selector that gets the scrollbars
- use custom-options for adding for example custom font sizes (see example in demo.html) --> this overwrites this options **globally** !!!
- format - default 'html', possible values 'json' | 'object' | 'html' | 'text', so you are able to set quill operation object, html or plain text to your model
- styles - set dynamic inline editor styles - `styles="{ backgroundColor: 'red' }"`
- sanitize - santize the model content if format is `html` (default: `false`)

## Callback/Outputs

- onEditorCreated: triggered after editor is created and provides editor-object `on-editor-created="myCallback(editor)"`
- onContentChanged: triggered after changes in the editor. Provides editor-object, html representation and text representation `on-content-changed="myCallback(editor, html, text, content, delta, oldDelta, source)"`
- onSelectionChanged: triggered after text selection changed `on-selection-changed="myCallback(editor, range, oldRange, source)"` - content = quill editor content object, text = content as plain text, html = content as html string

## Security Hint

Angular templates provide some assurance against XSS in the form of client side sanitizing of all inputs.

Ng-quill provides the config paramter sanitize to sanitize html-strings passed as ngModel or formControl to the component.

It is deactivated per default to avoid stripping content or styling, which is not expected.

But it is recommended to activate this option, if you are working with html strings as model values.

## Advanced Usage and Configuration

After editor creation you can use everything from the ordinary quill editor -> listen to editorCreated and work with the editor instance in your controller like you want ;).
Add modules, use the quill API or listen to Events. Keep in mind to use $timeout if you are listening / working with quill-Events and updating some $scope stuff to notify angular about it ;).
[Quill Documentation](http://quilljs.com/docs/quickstart/)
