// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	/**
	 * FIItem
	 * @model 	: model object
	 */
	var FIItem = function(model) {

		this.model = model;

		// call init
		this.init();
	};

	FIItem.prototype = {	// prototype FIItem

		/**
		 * init the instance
		 */
		init: function() {
			// build dom
			this.build();

			// set styles
			this.el.style.cssText = 'box-sizing:border-box;-moz-box-sizing:border-box;position:absolute;visibility:hidden;z-index:1;';
			
			// get reference to img dom
			this.img = this.el.getElementsByTagName('img')[0];

			// set styles of image dom
			this.img.style.cssText = 'box-sizing:border-box;-moz-box-sizing:border-box;cursor:pointer;max-width:100%;height:auto;position:relative;';
			
			// set up listeners
			this.listen();

			// load thumb
			this.loadThumb();
		},

		/**
		 * create FIItem dom structure
		 */
		build: function() {
			// create basic dom elems
			var itemDom = document.createElement('div'),
				image = document.createElement('img');

			// put it together
			itemDom.appendChild(image);

			// set reference to item base dom
			this.el = itemDom;
		},

		/**
		 * set up interaction listeners
		 */
		listen: function() {
			var self = this;

			// listener with anon handler for mouseover
			self.el.addEventListener('mouseover', function() {
				self.img.style.setProperty('-'+figallery.config.pref+'-transition', 'all 0.3s ease-in');
				self.img.style.setProperty('border', '8px solid white');
			});

			// listener with anon handler for mouseout
			self.el.addEventListener('mouseout', function() {
				self.img.style.setProperty('border', '0');
			});
		},

		/**
		 * method called from gallery
		 * sets up click listener and calls callback
		 * @fn 	: callback function
		 */
		onSelected: function(fn) {
			var self = this;

			// listener with anon handler for click, calls callback and passes item model as arg
			self.el.addEventListener('click', function() {
				fn(self.model);
			});
		},

		/**
		 * set image source
		 */
		loadThumb: function() {
			this.img.src = this.model.thumb;
		},

		/**
		 * method call from gallery
		 * sets opacity to 0, sets item visible
		 * based on delay it increments the opacity to 1
		 */
		show: function( delay ) {
			var t, el = this.el, o = 0;

			this.el.style.opacity = delay === 0 ? 1 : 0;
			this.el.style.visibility = 'visible';
			
			if (delay === 0) return;

			setTimeout(function(){
				t = setInterval(function() {
					if(o > 1) return clearInterval(t);
					o += 0.08;
					el.style.opacity = o;
				}, 20);
			}, delay);
			
		},

		/**
		 * method call from gallery
		 * sets opacity to 0, sets item visible
		 * it decrements the opacity to 1
		 */
		setOut: function() {
			var t, el = this.el, o = 1;

			t = setInterval(function() {
				if(o < 0) {
					return clearInterval(t);
				}
				o -= 0.10;
				el.style.opacity = o;
			}, 20);
			
		},
		
		/**
		 * ensure the item is rendered
		 */
		ensureRendered: function() {
			if (this.el.style.display == 'none') {
				this.el.style.display = 'block';
			}
		},

		/**
		 * sets static styling
		 */
		positionStatic: function(top, left, width) {
			this.el.style.top = top;
			this.el.style.left = left;
			this.el.style.width = width;
		},

		/**
		 * sets styling with transition
		 */
		positionAnimate: function(style) {
			this.el.style.cssText = style;
		},

		/**
		 * returns item width
		 */
		getWidth: function() {
			return this.el.offsetWidth;
		},

		/**
		 * returns item height
		 */
		getHeight: function() {
			return this.el.offsetHeight;
		},

		/**
		 * returns item base dom element
		 */
		getElement: function() {
			return this.el;
		},

		/**
		 * returns item image element
		 */
		getImageElement: function() {
			return this.img;
		}
	};

	figallery.FIItem = FIItem;

}).call(this);