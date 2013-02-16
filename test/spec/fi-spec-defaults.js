describe("FI Gallery", function() {
	
	describe("Defaults", function() {
		it("should namespace key", function() {
			var fi = figallery.defaults;
			expect(fi).to.include.key('namespace')
		});

		it("should have default namespace", function() {
			var fi = figallery.defaults;
			expect(fi.namespace).to.be.equal("fi");
		});

		it("should have default spacing", function() {
			var fi = figallery.defaults;
			expect(fi.spacing).to.be.equal(10);
		});

		it("should have default transitionInTime", function() {
			var fi = figallery.defaults;
			expect(fi.transitionInTime).to.be.equal(70);
		});

		it("shouldn't have default gallerywidth", function() {
			var fi = figallery.defaults;
			expect(fi.gallerywidth).to.be.equal(null);
		});
	});
});