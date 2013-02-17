describe("FI Gallery Utils", function() {
	
	it("should be an object", function() {
		var fi = figallery.utils;
		expect(fi).to.be.an("object");
	});

	describe("FI Gallery Utils Transition State", function() {

		it("should check browser transition state", function() {
			var fi = figallery.utils;
			var trans = fi.getTransitionState();
			expect(trans).to.be.an("array");
		});

		it("should return bool prefix -webkit-transform", function() {
			var fi = figallery.utils;
			var trans = fi.getTransitionState();
			expect(figallery.config.prop).to.be.equal('-webkit-transform');
		});

		it("should return bool prefix -moz-transform", function() {
			var fi = figallery.utils;
			var trans = fi.getTransitionState();
			expect(figallery.config.prop).to.be.equal('-moz-transform');
		});

		it("should return bool prefix -o-transform", function() {
			var fi = figallery.utils;
			var trans = fi.getTransitionState();
			expect(figallery.config.prop).to.be.equal('-o-transform');
		});

		it("should return bool prefix -ms-transform", function() {
			var fi = figallery.utils;
			var trans = fi.getTransitionState();
			expect(figallery.config.prop).to.be.equal('-ms-transform');
		});

		it("should return bool prefix transform", function() {
			var fi = figallery.utils;
			var trans = fi.getTransitionState();
			expect(figallery.config.prop).to.be.equal('transform');
		});
	});

	describe("FI Gallery Utils Create EL", function() {
		it("should expect arguments", function() {
			var fi = figallery.utils;
			var el = fi.createEl();
			var fake = document.createElement('div');
			fake.className = "";
			expect(el).to.be.equal(false);
		});

		it("should create element", function() {
			var fi = figallery.utils;
			var el = fi.createEl('div', 'hey');
			var fake = document.createElement('div');
			fake.className = "hey";
			expect(el.toString()).to.be.equal(fake.toString());
		});

		it("should append element", function() {
			var fi = figallery.utils;
			var parent = document.createElement('div');
			var el = fi.createEl('div', 'hey', parent);
			var kid = parent.getElementsByClassName('hey');
			expect(kid[0]).to.be.equal(el);
		});
	});
});