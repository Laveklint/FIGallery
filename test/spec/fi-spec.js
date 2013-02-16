/*
* fi-gallery must expose following for test to run
{
	methods:methods,
	config : figallery.config,
	options : figallery.options
}
*/

describe("FI Gallery", function() {
	
	describe("Basics", function() {
		it("should be an object", function() {
			var fi = new figallery.Gallery();
			expect(fi).to.be.an("object");
		});

		it("should have an options object", function() {
			var fi = new figallery.Gallery();
			expect(fi.options).to.be.an("object");
		});

		it("should have an config object", function() {
			var fi = new figallery.Gallery();
			expect(fi.options).to.be.an("object");
		});

		it("should have an defaults object", function() {
			var fi = figallery.defaults;
			expect(fi).to.be.an("object");
		});
	});
});