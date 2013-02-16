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

		History.Adapter.bind(window,'statechange', function() {
			console.log("statechange");
			console.log(History.getState());
		});
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

			var style = 'display:block;text-decoration:none;padding:25px;font-size:18px;color:#ccc;background:rgba(0,0,0,0.65);position:absolute;top:0;',
				stylePrev = style+'left:0',
				styleNext = style+'right:0';

			this.prevEl.style.cssText = stylePrev;
			this.nextEl.style.cssText = styleNext;

			this.prevEl.innerHTML = '<span><</span>';
			this.nextEl.innerHTML = '<span>></span>';
		},

		/*
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
		},
		
		/*
		* returns item base dom element
		*/
		getElement: function() {
			return this.el;
		}
	}

	figallery.TopPanel = TopPanel;

}).call(this);