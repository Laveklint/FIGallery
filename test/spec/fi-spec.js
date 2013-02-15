describe("FI Gallery", function() {
	var fi;
	beforeEach(function() {
		fi = new FIGallery();
	});

	describe("Basics", function() {
		it("Should die silently if no json-was passed in", function() {
			expect(fi).to.be.an("object");
		});
	});
});