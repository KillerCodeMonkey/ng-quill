// tests for ng-quill-editor component

describe('ng-quill-editor', function() {
	
	beforeEach(module('ngQuill'));


	describe('Component: ngQuillEditor', function() {

		var $compile;
		var $rootScope;
		var $componentController;

		
		var invalidComponent = angular.element("<ng-quill-editor></ng-quill-editor>");
		var validComponent = angular.element(
			['<ng-quill-editor name="editor1" callback="editorCallback(editor, name)" ',
			'ng-model="message" translations="translations" toolbar="true" show-toolbar="showToolbar" ', 
			'link-tooltip="true" image-tooltip="true" toolbar-entries="font size bold list bullet italic ',
			'underline strike align color background link image" editor-required="true" required="" ',
			'read-only="isReadonly()" error-class="input-error" fontsize-options="fontsizeOptions" ', 
			'fontfamily-options="fontfamilyOptions"></ng-quill-editor>'].join('')
		);
		
		beforeEach(inject(function(_$compile_, _$rootScope_, _$componentController_) {
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			$componentController = _$componentController_;
		}));

		describe('Creates component correctly', function() {

			it('should not create componenet without required attributes and configuration', function() {
				var error;
				try {
					var elem = $compile(invalidComponent)($rootScope);
					$rootScope.$digest();
				} catch(err) {
					error = "cannot compile component";
				}
				expect(error).toBeDefined();
				expect(error).toBe("cannot compile component");
			});

			it('should compile component', function() {
				var elem = $compile(validComponent)($rootScope);
				$rootScope.$digest();
				var divElements = elem.find('div');
				var spanElements = elem.find('span');
				expect(divElements.length).not.toBe(0);
				expect(spanElements.length).not.toBe(0);
			});

			it('should be able to edit text after creating component', function() {
				var elem = $compile(validComponent)($rootScope);
				$rootScope.$digest();
				var inputElement = elem.find('input');
				// should include one input element with ng-valid class
				var containsValidInput = false;
				for (var i = 0; i < inputElement.length; i++) {
					if (inputElement[i].classList.contains('ng-valid')) {
						containsValidInput = true;
					}
				}
				expect(containsValidInput).toBe(true);
			});
		});
		
		describe('ngQuill Component Controller', function() {
			
			var element; 
			var scope; 

			beforeEach(function() {
				scope = $rootScope.$new();
				element = $compile(validComponent)(scope);
				scope.$digest();
			});

			describe('Custom Bindings', function() {
				
				var componentBindings = {
					'toolbar': true,
					'link-tooltip': true,
					'image-tooltip': true,
					'toolbar-entries': ['font', 'size', 'bold', 'list', 'bullet', 'italic', 'underline',
					'strike', 'align', 'color', 'background', 'link', 'image'],
					'editor-required': true,
					'required': '',
					'error-class': 'input-error'
				};

				var ctrl;

				beforeEach(function() {
					ctrl = $componentController('ngQuillEditor', {
						$scope: scope,
						$element: element
					}, componentBindings);
				});

				it('should attach controller to component', function() {
					expect(ctrl).toBeDefined();
					expect(ctrl).toBe(scope.$ctrl);
				});

				it('should have attached all bindings to controller', function() {
					expect(ctrl['toolbar']).toBeDefined();
					expect(ctrl['link-tooltip']).toBeDefined();
					expect(ctrl['image-tooltip']).toBeDefined();
					expect(ctrl['toolbar-entries']).toBeDefined();
					expect(ctrl['editor-required']).toBeDefined();
					expect(ctrl['required']).toBeDefined();
					expect(ctrl['error-class']).toBeDefined();
				});

				it('should attach toolbar options to controller', function() {
					expect(ctrl['toolbar']).toBe(true);
					expect(ctrl['link-tooltip']).toBe(true);
					expect(ctrl['image-tooltip']).toBe(true);
					expect(ctrl['toolbar-entries']).toEqual(['font', 'size', 'bold', 'list', 'bullet', 'italic', 'underline',
					'strike', 'align', 'color', 'background', 'link', 'image']);
					expect(ctrl['editor-required']).toBe(true);
					expect(ctrl['required']).toBe(false);
					expect(ctrl['error-class']).toBe('input-error');
				});

			});

			describe('Empty Bindings', function() {
				var ctrl;

				beforeEach(function() {
					ctrl = $componentController('ngQuillEditor', {
						$scope: scope,
						$element: element
					});
				});

				it('should attach controller to component', function() {
					expect(ctrl).toBeDefined();
					expect(ctrl).toBe(scope.$ctrl);
				});

				it('should set default font families and font sizes without bindings', function() {
					var defaultFontFamilies = [{
						label: 'Sans Serif',
						alias: 'sans-serif'
					}, {
						label: 'Serif',
						alias: 'serif'
					}, {
						label: 'Monospace',
						alias: 'monospace'
					}];
					var defaultFontSizes = [{
						size: '10px',
						alias: 'small'
					}, {
						size: '13px',
						alias: 'normal'
					}, {
						size: '18px',
						alias: 'large'
					}, {
						size: '32px',
						alias: 'huge'
					}];
					expect(ctrl.fontsizeOptions.length).toBe(4);
					expect(ctrl.fontfamilyOptions.length).toBe(3);
					defaultFontFamilies.forEach(function(x) {
						expect(ctrl.fontfamilyOptions).toContain(jasmine.objectContaining(x));
					});
					defaultFontSizes.forEach(function(x) {
						expect(ctrl.fontsizeOptions).toContain(jasmine.objectContaining(x));
					});
				});

			});

		});
	});
});