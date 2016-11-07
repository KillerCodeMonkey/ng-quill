# ngQuill
<img src="https://cloud.githubusercontent.com/assets/2264672/12809927/fd4c3416-cb22-11e5-9b02-80ebd9138255.png" width="120">
[![NPM](https://nodei.co/npm/ng-quill.png)](https://nodei.co/npm/ng-quill/)

ngQuill is an [Angular.js](http://angularjs.org/) directive for [Quill](http://quilljs.com/) rich text editor (v0.20.x).

You can get an ugly as hell demo here: [ngQuill in action](http://killercodemonkey.github.io/ngQuill/demo.html)

Installation
============
- run `bower install ngquill` or `bower ng-quill`
- or `npm install ng-quill`
- or download zip from release page: https://github.com/KillerCodeMonkey/ngQuill/releases


Breaking Changes since 1.5.0
============================

- usage of AngularJS >1.5.6
- the editor directive is now a component
- all two way bindings are now one-way bindings
- read-only is a simple one-way data binding, too (previously an function binding '&')

Contribution
============

I am using GitFlow --> All Changes and Pull-Requests have to be on develop-branch!
Changes directly in the master branch are not longer allowed and will be rejected.

Usage
=====
- load angular, quill, ngquill scripts in your index.html
- add dependency to your app module `var myAppModule = angular.module('quillTest', ['ngQuill']);`
- use ngQuillConfigProvider to overwrite global settings in your config-Block
- use ngquill directive in your html
`<ng-quill-editor ng-model="message" toolbar="true" link-tooltip="true" image-tooltip="true" toolbar-entries="font size bold list bullet italic underline strike align color background link image" editor-required="true" required="" error-class="input-error"></ng-quill-editor>`
- if you use it in a form and you are resetting it via $setPristine() -> you have to set editor.setHTML('') -> it will add the error class only, if the model has ng-dirty class

Configuration
=============

- use ngQuillConfigProvider.set(fontSizes, fontFamilies) to set fonts and available sizes
- show toolbar: `toolbar="isVisible"` (default: false)
- connect model: `ng-model="message"` (required)
- set toolbar entries (formats): `toolbar-enries="font bold ..."` (separated by whitespace, if you want all -> delete the attribute, default: all)
- show link tooltip: `link-tooltip="true"` (default: false)
- show image tooltip: `image-tooltip="true"` (default: false)
- set to required: editor-required="true" (adds hidden text-input that checks length of content) and you have to add html5 attribute `required` to carry about form validation for the model (sets correct classes at the dom-node - ng-dirty, invalid and so on)
- customized error class added to editors container div: `error-class="input-error"`
- set save format: `save="html"` (default: 'html', supports 'html', 'text', 'contents')
- set theme name: `theme="snow"` (default: 'snow')
- set readOnly: `read-only=""` (default: false) - requires true or false
- set translations: `translations="dict.editor"` (object with editor translations -> default is english)
- overwrite global config for each editor: `fontsize-options="fontsizeOptions" fontfamily-options="fontfamilyOptions"`
- name: `name="editoreName"` (optional, String) --> editor name is passed to the editorCreated event if set
- callback `callback="functionName(editor, name)"` --> another usage to get editor instance if created --> call custom function with parameters editor and optional name
- styles: `editor-styles="true"` (optional, Bool) (default: false) -  attach CSS to HEAD, do not set if you use a theme

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

- editorCreated: triggered after editor is created and provides editor-object and the optional editor name

Advanced Usage and Configuration
================================

After editor creation you can use everything from the ordinary quill editor -> listen to editorCreated and work with the editor instance in your controller like you want ;).
Add modules, use the quill API or listen to Events. Keep in mind to use $timeout if you are listening / working with quill-Events and updating some $scope stuff to notify angular about it ;).
[Quill Documentation](http://quilljs.com/docs/quickstart/)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/KillerCodeMonkey/ngquill/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
