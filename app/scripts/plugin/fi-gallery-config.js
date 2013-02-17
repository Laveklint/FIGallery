// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	// get transition state and browser prefix
	var browserTransition = figallery.utils.getTransitionState();
	
	/**
	 * Gallery Config
	 * acts as model for indexes
	 */
	var config = {

		transitions: browserTransition === false ? false : true,
		pref : browserTransition[0],
		prop : browserTransition[1],
		isAnimating: false,
		displayingSingle: false,
		viewportWidth: 0,
		viewportHeight: 0,
		count: 0,
		pages: {},
		pagesCount: 0,
		pageIndex: 0,
		imageIndex: 0,
		events: {},

		/**
		 * construct a custom event
		 * returns custom event
		 */
		constructEvent: function(name) {
			if(config.events[name]) return config.events[name];
			var evt = document.createEvent('Event');
			evt.initEvent(name, true, true);
			config.events[name] = evt;
			return evt;
		},

		/**
		 * increment index
		 * based on current state it will increment imageindex or pageindex
		 * dispatches pageevent if pageindex gets updated
		 * @force 	: boolean to force pageindex update even with single view state
		 */
		incrementIndex: function(force) {
			if(config.displayingSingle && force !== true) return config.incrementSingle();
			if(config.pageIndex < config.pagesCount-1) {
				config.pageIndex++;
			} else {
				config.pageIndex = 0;
			}
			var e = config.constructEvent('pageevent');
			document.dispatchEvent(e);
		},

		/**
		 * decrement index
		 * based on current state it will decrement imageindex or pageindex
		 * dispatches pageevent if pageindex gets updated
		 * @force 	: boolean to force pageindex update even with single view state
		 */
		decrementIndex: function(force) {
			if(config.displayingSingle && force !== true) return config.decrementSingle();
			if(config.pageIndex > 0) {
				config.pageIndex--;
			} else {
				config.pageIndex = config.pagesCount-1;
			}
			var e = config.constructEvent('pageevent');
			document.dispatchEvent(e);
		},

		/**
		 * updates image index
		 * @val 	: the new index value
		 */
		setSingleIndex: function(val) {
			config.imageIndex = val;
		},

		/**
		 * increment image index
		 * infinite pagination
		 * dispatches singleevent
		 */
		incrementSingle: function() {
			var cut;
			if(config.imageIndex < config.count-1) {
				config.setSingleIndex(config.imageIndex+1);

				cut = config.pages[config.pageIndex].length * (config.pageIndex+1);
				if(config.imageIndex === cut) config.incrementIndex(true);
			} else {
				config.setSingleIndex(0);
				config.incrementIndex(true);
			}
				var e = config.constructEvent('singleevent');
				e.model = config.getSingleItemAtPosition().model;
				document.dispatchEvent(e);
		},

		/**
		 * decrement image index
		 * infinite pagination
		 * dispatches singleevent
		 */
		decrementSingle: function() {
			if(config.imageIndex > 0) {
				config.setSingleIndex(config.imageIndex-1);

				var pi = config.pageIndex === 0 ? config.pages.length-1 : config.pageIndex-1
				var cut = config.pages[pi].length * config.pageIndex;
				if(config.imageIndex < cut) config.decrementIndex(true);
			} else {
				config.setSingleIndex(config.count-1);
				config.decrementIndex(true);
			}
				var e = config.constructEvent('singleevent');
				e.model = config.getSingleItemAtPosition().model;
				document.dispatchEvent(e);
		},

		/**
		 * returns FIItem from pages object based on current imageindex
		 */
		getSingleItemAtPosition: function() {
			var a = Array.prototype.slice.call(figallery.config.pages[figallery.config.pageIndex]),
				m = _.filter(a, function(item,key) {
				return item.model.id == config.imageIndex;
			});
			return m[0];
		}
	};

	figallery.config = config;

}).call(this);