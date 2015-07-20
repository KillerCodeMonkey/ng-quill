# ngQuill

ngQuill is an [Angular.js](http://angularjs.org/) directive for [Quill](http://quilljs.com/) rich text editor.

Installation
============
- run `bower install ngquill` or `bower ng-quill`
- or download zip from release page: https://github.com/KillerCodeMonkey/ngQuill/releases

Usage
=====
- load angular, quill, ngquill scripts in your index.html
- add dependency to your app module `var myAppModule = angular.module('quillTest', ['ngQuill']);`
- use ngquill directive in your html
`<ng-quill-editor ng-model="message" toolbar="true" link-tooltip="true" image-tooltip="true" toolbar-entries="font size bold list bullet italic underline strike align color background link image" editor-required="true" required="" error-class="input-error"></ng-quill-editor>`
- if you use it in a form and you are resetting it via $setPristine() -> you have to set editor.setHTML('') -> it will add the error class only, if the model has ng-dirty class

Configuration
=============

- show toolbar: `toolbar="true"` (default: false)
- connect model: `ng-model="message"` (required)
- set toolbar entries (formats): `toolbar-enries="font bold ..."` (separated by whitespace, if you want all -> delete the attribute, default: all)
- show link tooltip: `link-tooltip="true"` (default: false)
- show image tooltip: `image-tooltip="true"` (default: false)
- set to required: editor-required="true" (adds hidden text-input that checks length of content) and you have to add html5 attribute `required` to carry about form validation for the model (sets correct classes at the dom-node - ng-dirty, invalid and so on)
- customized error class added to editors container div: `error-class="input-error"`
- set theme name: `theme="snow"` (default: 'snow')
- set readOnly: `read-only=""` (default: false) - requires function to be executed
- set translations: `translations="dict.editor"` (object with editor translations -> default is english)

Translations
============

- font: 'Font',
- size: 'Size',
- small: 'Small',
- normal: 'Normal',
- large: 'Large',
- huge: 'Huge',
- bold: 'Bold',
- italic: 'Italic',
- underline: 'Underline',
- strike: 'Strikethrough',
- textColor: 'Text Color',
- backgroundColor: 'Background Color',
- list: 'List',
- bullet: 'Bullet',
- textAlign: 'Text Align',
- left: 'Left',
- center: 'Center',
- right: 'Right',
- justify: 'Justify',
- link: 'Link',
- image: 'Image',
- visitURL: 'Visit URL',
- change: 'Change',
- remove: 'Remove',
- done: 'Done',
- cancel: 'Cancel',
- insert: 'Insert',
- preview: 'Preview'

Events
======

- editorCreated: triggered after editor is created and provides editor-object

Advanced Usage and Configuration
================================

After editor creation you can use everything from the ordinary quill editor -> listen to editorCreated and work with the editor instance in your controller like you want ;).
Add modules, use the quill API or listen to Events. Keep in mind to use $timeout if you are listening / working with quill-Events and updating some $scope stuff to notify angular about it ;).
[Quill Documentation](http://quilljs.com/docs/quickstart/)
