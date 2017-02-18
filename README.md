# ng-quill [![Build Status](https://travis-ci.org/KillerCodeMonkey/ng-quill.svg?branch=develop)](https://travis-ci.org/KillerCodeMonkey/ng-quill)

<img src="https://cloud.githubusercontent.com/assets/2264672/12809927/fd4c3416-cb22-11e5-9b02-80ebd9138255.png" width="120">

[![NPM](https://nodei.co/npm/ng-quill.png)](https://nodei.co/npm/ng-quill/)

ng-quill is an [Angular.js](http://angularjs.org/) component for [Quill](http://quilljs.com/) rich text editor.
You can get an ugly as hell demo here: [ngQuill in action](https://killercodemonkey.github.io/ng-quill/demo.html)
or with AMD (RequireJS) [ngQuill requirejs](https://killercodemonkey.github.io/ng-quill/demoamd.html)

The new version is complete rewritten and is using QuillJS 1.x.
For the latest old version (0.20.1) checkout the special branch for it.

Installation
============
- `npm install ng-quill`
- or download zip from release page: https://github.com/KillerCodeMonkey/ngQuill/releases
- or grab the latest release from cdn: https://cdnjs.com/libraries/ng-quill


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
`<ng-quill-editor ng-model="message"></ng-quill-editor>`
- add this line to your css `[ng-quill-editor] { display: block; }`
- if you use it in a form and you are resetting it via $setPristine() -> you have to set editor.setHTML('') -> it will add the error class only, if the model has ng-dirty class
- add a custom toolbar using `ng-quill-toolbar` - it uses transclusion to add toolbar, avoids flickering and sets the modules toolbar config to the custom toolbar automatically:
```
<ng-quill-editor
    ng-model="title"
>
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

Configuration
=============

- use ngQuillConfigProvider.set(modules, theme, placeholder, formats, boundary, readOnly) to config toolbar module, other modules, default theme, allowed formats, ...
- set theme name: `theme="snow"` (default: 'snow')
- set readOnly: `read-only=""` (default: false) - requires true or false
- overwrite global config for each editor: `modules="modulesConfig"`
- set placeholder: `placeholder="Inser your text here"`
- override formats: `formats="formatsArray"`, per default all quill formats are allowed
- set max-length: `max-length="5"`, adds validation for maxlength (sets model state to `invalid` and adds `ng-invalid-maxlength` class)
- set max-length: `min-length="5"`, adds validation for minlength (sets model state to `invalid` and adds `ng-invalid-minlength` class), only works for values > 1, if you only want to check if there is a value --> use required/ng-required

Callback/Outputs
================

- onEditorCreated: triggered after editor is created and provides editor-object `on-editor-created="myCallback(editor)"`
- onContentChanged: triggered after changes in the editor. Provides editor-object, html representation and text representation `on-content-changed="myCallback(editor, html, text)"`

Advanced Usage and Configuration
================================

After editor creation you can use everything from the ordinary quill editor -> listen to editorCreated and work with the editor instance in your controller like you want ;).
Add modules, use the quill API or listen to Events. Keep in mind to use $timeout if you are listening / working with quill-Events and updating some $scope stuff to notify angular about it ;).
[Quill Documentation](http://quilljs.com/docs/quickstart/)

