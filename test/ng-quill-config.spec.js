// tests for ng-quill config provider and service

describe('ngQuill', function() {

	beforeEach(module('ngQuill'));

	describe('Provider: ngQuillConfigProvider', function() {
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

	describe('Service: ngQuillService', function() {
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



});