describe('ng-quill-component', function() {
	
	beforeEach(module('ngQuill'));


	describe('Component: ngQuillEditor', function() {

		var $compile;
		var $rootScope;
		var $componentController;
		var $controller;

		// TODO: ADD TEMPLATE AS A VARIABLE HERE
		var invalidFormat = angular.element("<ng-quill-editor></ng-quill-editor>");
		var validFormat = angular.element('<ng-quill-editor name="editor1" callback="editorCallback(editor, name)" ' + 
			'ng-model="message" translations="translations" toolbar="true" show-toolbar="showToolbar" ' + 
			'link-tooltip="true" image-tooltip="true" toolbar-entries="font size bold list bullet italic ' +
			'underline strike align color background link image" editor-required="true" required="" ' +
			'read-only="isReadonly()" error-class="input-error" fontsize-options="fontsizeOptions" ' + 
			'fontfamily-options="fontfamilyOptions"></ng-quill-editor>');

		beforeEach(inject(function(_$compile_, _$rootScope_, _$controller_, _$componentController_) {
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			$controller = _$controller_;
			$componentController = _$componentController_;
		}));

		describe('creates component correctly', function() {

			it('should not create componenet without required attributes and configuration', function() {
				// use a try catch block to capture the error when compiling 
				var elem = $compile(invalidFormat)($rootScope);
				var divElements = elem.find('div');
				var spanElements = elem.find('span');
				expect(divElements.length).toBe(0);
				expect(spanElements.length).toBe(0);
			});

			it('should compile component', function() {
				var elem = $compile(validFormat)($rootScope);
				$rootScope.$digest();
				var divElements = elem.find('div');
				var spanElements = elem.find('span');
				expect(divElements.length).not.toBe(0);
				expect(spanElements.length).not.toBe(0);
			});
		});

		describe('handles changing config options correctly', function() {
			
			var element; // html element
			var ctrl;
			var $scope; // this is a generic scope object right now

			beforeEach(function() {
				$scope = $rootScope.$new();
				element = $compile(validFormat)($scope);
				
			});

			it('sample', function() {
				ctrl = $componentController('ngQuillEditor', {
					$scope: $scope,
					$element: element
				}); // access to the component's controller 
				// console.log(element);
				// console.log($scope);
				console.log(ctrl); // check that all bindings are correctly set 
				console.log($scope.toolbar);
			});

		});


	});
});