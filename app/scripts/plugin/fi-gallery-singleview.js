// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	/*
	*	SingleView function
	*	@model 	: model instance
	*/
	var SingleView = function(model) {
		
		// create dom structor for our single view
		this.div = document.createElement('div');
		this.frag = document.createDocumentFragment();
		this.inner = document.createElement('div');
		this.img = document.createElement('img');
		this.blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
		this.image;

		// set initial styling
		this.div.className = figallery.options.namespace+'-gallery-single';
		this.div.style.opacity = '0';
		this.div.style.cssText = '-'+figallery.config.pref+'-transition:all 0.4s;opacity:1;cursor:crosshair;background:rgba(0,0,0,0.88);z-index:1;position:fixed;width:100%;height:'+figallery.config.viewportHeight+'px;left:0;top:0;'
		this.inner.style.cssText = 'position:relative;display:table-cell;vertical-align:middle;'+figallery.config.prop+':translate3d(0,0,0);max-width:100%;width:'+figallery.config.viewportWidth+'px;height:'+figallery.config.viewportHeight+'px;text-align:center';
		this.img.style.cssText = 'vertical-align:middle;display:inline;max-width:80%;height:auto;'+figallery.config.prop+':translateY(-160%)';
		
		// append dom
		this.frag.appendChild(this.img);
		this.inner.appendChild(this.frag);
		this.div.appendChild(this.inner);

		

		this.loadImage(model);

		var self = this;
		document.addEventListener("singleevent", function update(event) {
			self.loadImage(event.model, true);
		}, false);
	};

	/*
	* SingleView prototype
	*/
	SingleView.prototype =  {

		loadImage: function(model, shift) {
			var self = this;
			// display loaderanim
			var loaderAnim = new figallery.LoaderAnim();
			this.div.appendChild(loaderAnim.getElement());

			if(shift === true) {
				self.img.style.setProperty('-'+figallery.config.pref+'-transition', 'all 0.3s');
				self.img.style.setProperty('opacity', 0);
				figallery.ImageLoader([model.large]).done(function(imgs) {
					self.img.src = model.large;
					setTimeout(function(){
						self.img.style.setProperty('opacity', 1);
					}, 500);

					// destroy loaderanim
					loaderAnim.destroy();
				});
			} else {
				this.img.src = model.large;
				figallery.ImageLoader([model.large]).done(function(imgs) {
					setTimeout(function(){
						self.img.style.setProperty('-'+figallery.config.pref+'-transition', 'all 0.5s cubic-bezier(0.175, 0.885, 0.335, 1.165)');
						self.img.style.setProperty(figallery.config.prop, 'translateY(0%)');
					}, 100);

					// destroy loaderanim
					loaderAnim.destroy();
				});
			}
		},

		/*
		* method called from gallery
		* sets up close click handler
		* @fn 	: callback
		*/
		onClose: function(fn) {
			var self = this;
			// add click listener
			this.div.addEventListener('click', function cleanOut() {
				self.div.style.opacity = 0;
				self.img.style.setProperty('-'+figallery.config.pref+'-transition', 'all 0.4s ease-in');
				self.img.style.setProperty(figallery.config.prop, 'translateY(-200%)');
				
				// call callback
				fn();

				// set a little timeout to allow some out-animation
				setTimeout(function() {
					self.div.removeEventListener('click', cleanOut, false);
					self.inner.removeChild(img);
					self.div.removeChild(inner);
					self.img = null;
					self.inner = null;
					self.div = null;
				}, 600);
			});
		},

		/*
		* returns SingleView base dom element
		*/
		getElement: function() {
			return this.div;
		}
	}

	figallery.SingleView = SingleView;

}).call(this);