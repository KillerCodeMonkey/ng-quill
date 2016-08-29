describe('ng-quill-component', function() {

	beforeEach(module('ngQuill'));

	describe('ngQuillConfigProvider', function() {
		var config;

		beforeEach(inject(function(_ngQuillConfig_) {
			config = _ngQuillConfig_;
		}));

		it('should load default properties', function() {
				var properties = Object.keys(config);
				expect(config).toBeDefined();
				expect(properties).toContain('fontSizes');
				expect(properties).toContain('fontFamilies');
				expect(properties).toContain('formats');
				expect(properties).toContain('translations');
		});
	});

	describe('ngQuillService', function() {
		var config; 
		var service;

		beforeEach(inject(function(_ngQuillConfig_, _ngQuillService_) {
			config = _ngQuillConfig_;
			service = _ngQuillService_;
		}));

		it('should load default config dependency', function() {
			expect(config).toBeDefined();
			expect(service).toBeDefined();
			expect(Object.keys(config).length).toBe(4);
			expect(service.validateFormats).toBeDefined();
		});

		it('should load custom list of formats', function() {
			var sampleFormats = ['link', 'image', 'background', 'align'];
			expect(service.validateFormats(sampleFormats)).toEqual(sampleFormats);
		});

		it('should not load invalid configurations', function() {
			var invalidFormats = ['Link', "ailgn", 'backround', 'Strike', 'circle'];
			expect(service.validateFormats(invalidFormats)).toEqual([]);
		});
	});

	describe('ngQuillEditor', function() {

		var $compile;
		var $rootScope;

		var invalidFormat = "<ng-quill-editor></ng-quill-editor>";
		var validFormat = '<ng-quill-editor name="editor1" callback="editorCallback(editor, name)" ' + 
			'ng-model="message" translations="translations" toolbar="true" show-toolbar="showToolbar" ' + 
			'link-tooltip="true" image-tooltip="true" toolbar-entries="font size bold list bullet italic ' +
			'underline strike align color background link image" editor-required="true" required="" ' +
			'read-only="isReadonly()" error-class="input-error" fontsize-options="fontsizeOptions" ' + 
			'fontfamily-options="fontfamilyOptions"></ng-quill-editor>';

		beforeEach(inject(function(_$compile_, _$rootScope_) {
			$compile = _$compile_;
			$rootScope = _$rootScope_.$new();
		}));

		describe('creates component correctly', function() {

			it('should not create componenet without required attributes and configuration', function() {
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


	});

});