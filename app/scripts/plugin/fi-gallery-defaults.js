// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	/**
	 * default props of the gallery
	 */
	var defaults = {

		// the namespace for classes
		namespace: 'fi',

		// trick gallery to set a width of each item
		itemwidth: 0,

		// the spacing between items
		spacing: 10,

		// the number of items to display on each page
		// 0 makes a single page with all items
		perpage: 0,

		// max number of columns
		maxcols: 0,

		// the transition time for fading in each item
		// set to 0 to skip fade in
		transitionInTime: 70,

		// hover frame color
		hoverframecolor: 'rgba(255,255,255, 1)',

		// hover frame width
		hoverframewidth: '8px',

		// set a width of the gallery container
		gallerywidth: null

	};

	figallery.defaults = defaults;

}).call(this);