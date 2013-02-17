// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	/**
	 * Top Panel
	 */
	var TopPanel = function() {

		// call build method
		this.build();

		// set up listeners
		this.listen();
	};

	/**
	 * prototype top panel
	 */
	TopPanel.prototype = {

		/**
		 * build the panel
		 */
		build: function() {

			// create dom and set initial style
			this.el = figallery.utils.createEl('div', figallery.options.namespace+'-gallery-toppanel');
			this.el.style.cssText = 'position:fixed;top:0;left:0;width:100%;z-index:1000;';

			// create nav
			this.prevEl = figallery.utils.createEl('a', 'toppanel-prev-button', this.el);
			this.nextEl = figallery.utils.createEl('a', 'toppanel-next-button', this.el);

			// set href of nav
			this.prevEl.href = 'javascript:;';
			this.nextEl.href = 'javascript:;';

			// set style of nav
			var style = 'box-sizing:border-box;-moz-box-sizing:border-box;display:block;text-decoration:none;padding:25px;font-size:36px;color:rgb(225,225,225);background:rgba(0,0,0,0.65);position:absolute;top:0;'+figallery.config.prop+':translateY(-100%);',
				stylePrev = style+'left:0',
				styleNext = style+'right:0';

			this.prevEl.style.cssText = stylePrev;
			this.nextEl.style.cssText = styleNext;

			// set content of nav items
			this.prevEl.innerHTML = '<span>&lsaquo;</span>';
			this.nextEl.innerHTML = '<span>&rsaquo;</span>';
		},

		/**
		 * listeners
		 */
		listen: function() {
			var self = this;

			// click handler, anon callback tells config to decrement index
			this.prevEl.addEventListener('click', function(event) {
				event.preventDefault();
				figallery.config.decrementIndex();
			});

			// click handler, anon callback tells config to increment index
			this.nextEl.addEventListener('click', function(event) {
				event.preventDefault();
				figallery.config.incrementIndex();
			});

			// mouseover handler, anon callback set style
			this.prevEl.addEventListener('mouseover', function(event) {
				event.currentTarget.style.color = 'white';
				event.currentTarget.style.background = 'rgba(0,0,0,0.85)';
			});

			// mouseover handler, anon callback set style
			this.nextEl.addEventListener('mouseover', function(event) {
				event.currentTarget.style.color = 'white';
				event.currentTarget.style.background = 'rgba(0,0,0,0.85)';
			});

			// mouseout handler, anon callback set style
			this.prevEl.addEventListener('mouseout', function(event) {
				event.currentTarget.style.color = 'rgb(225,225,225)';
				event.currentTarget.style.background = 'rgba(0,0,0,0.64)';
			});

			// mouseout handler, anon callback set style
			this.nextEl.addEventListener('mouseout', function(event) {
				event.currentTarget.style.color = 'rgb(225,225,225)';
				event.currentTarget.style.background = 'rgba(0,0,0,0.64)';
			});
		},

		/**
		 * toggle
		 * @bool 	: true slides down nav, false slides up nav
		 */
		toggle: function(bool) {

			if(bool) {
				this.slideDown(this.prevEl);
				this.slideDown(this.nextEl);
			} else {
				this.slideUp(this.prevEl);
				this.slideUp(this.nextEl);
			}
		},

		/**
		 * slide down method
		 * @el 	: the element to slide down
		 */
		slideDown: function(el) {
			el.style.setProperty('-'+figallery.config.pref+'-transition', 'all 0.5s ease-in-out');
			el.style.setProperty(figallery.config.prop, 'translateY(0%)');
		},

		/**
		 * slide up method
		 * @el 	: the element to slide up
		 */
		slideUp: function(el) {
			el.style.setProperty('-'+figallery.config.pref+'-transition', 'all 0.5s ease-in-out');
			el.style.setProperty(figallery.config.prop, 'translateY(-100%)');
		},
		
		/**
		 * returns item base dom element
		 */
		getElement: function() {
			return this.el;
		}
	}

	figallery.TopPanel = TopPanel;

}).call(this);