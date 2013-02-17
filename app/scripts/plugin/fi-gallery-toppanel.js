// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	/*
	* default props of the gallery
	*/
	var TopPanel = function() {
		this.build();
		this.listen();
	};

	TopPanel.prototype = {

		/*
		* build the panel
		*/
		build: function() {
			this.el = figallery.utils.createEl('div', figallery.options.namespace+'-gallery-toppanel');
			this.el.style.cssText = 'position:fixed;top:0;left:0;width:100%;z-index:1000;';

			this.prevEl = figallery.utils.createEl('a', 'toppanel-prev-button', this.el);
			this.nextEl = figallery.utils.createEl('a', 'toppanel-next-button', this.el);

			this.prevEl.href = 'javascript:;';
			this.nextEl.href = 'javascript:;';

			var style = 'box-sizing:border-box;-moz-box-sizing:border-box;display:block;text-decoration:none;padding:25px;font-size:36px;color:rgb(225,225,225);background:rgba(0,0,0,0.65);position:absolute;top:0;'+figallery.config.prop+':translateY(-100%);',
				stylePrev = style+'left:0',
				styleNext = style+'right:0';

			this.prevEl.style.cssText = stylePrev;
			this.nextEl.style.cssText = styleNext;

			this.prevEl.innerHTML = '<span>&lsaquo;</span>';
			this.nextEl.innerHTML = '<span>&rsaquo;</span>';
		},

		/**
		 * listeners
		 */
		listen: function() {
			var self = this;
			this.prevEl.addEventListener('click', function(event) {
				event.preventDefault();
				figallery.config.decrementIndex();
			});

			this.nextEl.addEventListener('click', function(event) {
				event.preventDefault();
				figallery.config.incrementIndex();
			});

			this.prevEl.addEventListener('mouseover', function(event) {
				event.currentTarget.style.color = 'white';
				event.currentTarget.style.background = 'rgba(0,0,0,0.85)';
			});

			this.nextEl.addEventListener('mouseover', function(event) {
				event.currentTarget.style.color = 'white';
				event.currentTarget.style.background = 'rgba(0,0,0,0.85)';
			});

			this.prevEl.addEventListener('mouseout', function(event) {
				event.currentTarget.style.color = 'rgb(225,225,225)';
				event.currentTarget.style.background = 'rgba(0,0,0,0.64)';
			});

			this.nextEl.addEventListener('mouseout', function(event) {
				event.currentTarget.style.color = 'rgb(225,225,225)';
				event.currentTarget.style.background = 'rgba(0,0,0,0.64)';
			});
		},

		/**
		 * toggle
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

		slideDown: function(el) {
			el.style.setProperty('-'+figallery.config.pref+'-transition', 'all 0.5s ease-in-out');
			el.style.setProperty(figallery.config.prop, 'translateY(0%)');
		},

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