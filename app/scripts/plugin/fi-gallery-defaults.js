// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	/*
	* default props of the gallery
	*/
	var defaults = {

		namespace: 'fi',
		itemwidth: 0,
		spacing: 10,
		perpage: 0,
		maxcols: 0,
		transitionInTime: 70,
		showpanel: true,
		gallerywidth: null

	};

	figallery.defaults = defaults;

}).call(this);