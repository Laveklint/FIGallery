// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	/**
	 * prototype array with a method to return the min val
	 */
	Array.prototype.min = function() {
		var min = 0, i = 0, sum = this.length;
		for (i; i < sum; i++) {
			if (this[i] < this[min]) {
				min = i;
			}
		}
		return min;
	};

	/**
	 * requestAnimFrame shim
	 */
	(function() {
		var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
	                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	 
	    if (!window.requestAnimationFrame)
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	 
	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
    })();

	/**
	 * Utils object
	 */
	var utils = {

		/**
		 * method for getting the browser prefix
		 * sets figallery pref/prop val
		 * returns true if browser is supported
		 */
		getTransitionState: function() {
			return (function() {
				var obj = document.createElement('div'),
				props = ['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransition', 'msTransform'];
				for (var i in props) {
					if ( obj.style[ props[i] ] !== undefined ) {
						var pref = props[i].replace('Transform','').toLowerCase();
						var prop = '-' + pref + '-transform';
						return [pref, prop];
					}
				}
				return false;
			}());
		},

		/**
		 * method for creating dom elements and setting classname
		 * @tag 		: dom element type
		 * @cls 		: classname (optional)
		 * @parent 	: append to element (optional)
		 */
		createEl: function(tag, cls, parent) {
			if(tag === undefined) return false;
			var _el = document.createElement(tag);
			_el.className = cls ? cls : '';

			// if a parent is passed in as argument, append the dom
			if(parent) parent.appendChild(_el);

			// return the newly created dom
			return _el;
		},

	};

	figallery.utils = utils;

}).call(this);