// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	/**
	 * LoaderAnim function
	 * @boxcount 	: number of boxes
	 * @size 		: size of boxes
	 * @radius 		: the radius of orbit sphere
	 */
	var LoaderAnim = function(boxCount,size,radius) {

	 	this.boxCount = boxCount ? boxCount : 8;
		this.boxes = [];
		this.size = size ? size : 10;
		this.spacing = 5;
		this.step = Math.PI * 2 / this.boxCount;
		this.angle = 0;
		this.x = 0;
		this.y = 0;
		this.animateOut = false;
		this.radius = radius ? radius : 20;
		this.point = figallery.config.viewportWidth >> 1;
		this.pool = [];
		this.timer = 0;
		this.stage = figallery.utils.createEl('div', 'loader-anim');
		this.inner = figallery.utils.createEl('div', 'loader-anim-inner', this.stage);

		this.init();
	};

	LoaderAnim.prototype = {
		/**
		 * init anim
		 */
		init: function() {

			// figure out center pos for box sphere
			var perc = figallery.config.viewportHeight - this.point;
			perc = ((perc >> 1) - this.point) >> 1;
			this.stage.style.cssText = 'position:fixed;top:0;left:0;height:'+figallery.config.viewportHeight+'px;width:100%;z-index:100;';
			this.inner.style.cssText = '-'+figallery.config.pref+'-transform:translateY('+perc+'px);position:relative;height:'+figallery.config.viewportHeight+'px';
			
			// create as many box instances as boxCount
			for(var i=0; i<this.boxCount; i++) {
				var box = new Box(),
					el = box.getElement();

				// set some fancy random colour
				var r = Math.round(Math.random () * 255),
					g = Math.round(Math.random () * 255),
					b = Math.round(Math.random () * 255);

				// set color of box
				box.setColor( 'rgba('+r+','+g+','+b+', '+(0.3 + Math.random()*1)+')' );

				// set size of box
				box.setSize( this.size, this.size );

				// push box into pool
				this.pool.push( box );

				// append box element to inner dom
				this.inner.appendChild(el);
			}
			
			// let's animate
			cancelAnimationFrame( this.timer );
			this.animate();
		},

		/**
		 * requestanimationframe handler
		 * calls rotate
		 * get raf id so it can be canceled later
		 */
		animate: function() {
			console.log("animate");
			var self = this;
			self.timer  = requestAnimationFrame( function() {
				self.animate();
			} );
			self.rotate();
		},

		/**
		 * rotate the boxes in a sphere
		 */
		rotate: function() {
			for (var i = 0; i < this.boxCount; i++) {
				this.x = this.radius * Math.cos( this.angle ) + this.point;
				this.y = this.radius * Math.sin( this.angle ) + this.point;
				
				// set rotation
				this.pool[i].rotate( -Math.atan2( this.y - this.point, this.x - this.point ) * 180 / Math.PI + 90 + 'deg');

				// set position
				this.pool[i].position( this.x, this.y );

				this.angle += this.step;

				// if it's time to exit, call setOut method of each box
				if(this.animateOut) this.pool[i].setOut();
			}

			// make sure we only act once on animateOut
			if(this.animateOut) this.animateOut = false;

			// increment radius and angle of the boxes
			this.angle += Math.sin(Math.cos(0.03))*0.03;
			this.radius += Math.sin(Math.cos(this.angle)*2);
		},

		/**
		 * returns loaderanim stage
		 */
		getElement: function() {
			return this.stage;
		},

		/**
		 * destroy, clean up
		 */
		destroy: function() {
			var self = this;
			self.animateOut = true;
			setTimeout( function() {
				cancelAnimationFrame( self.timer );
				self.timer = null;

				self.clearPool();
				self.stage.removeChild(self.inner);
				self.stage.parentNode.removeChild(self.stage);
				self.pool = [];
			}, 1000);
		},

		/**
		 * clean up the pool
		 */
		clearPool: function() {
			var i = 0, len = this.pool.length, boxel;
			for(i; i<len; i++) {
				boxel = this.pool[i].getElement();
				this.inner.removeChild(boxel);
				boxel = null;	
				this.pool[i] = null;
			}
		}
	};
	

	/**
	 * box object
	 */
	var Box = function() {
		this.el = document.createElement('div');
		this.el.style.position = 'absolute';
		this.el.style.setProperty('-'+figallery.config.pref+'-transition', 'opacity 0.5s ease-out');
	}

	/**
	 * box prototype
	 */
	Box.prototype = {

		/**
		 * sets the size of the box
		 * @s 	: the size
		 */
		setSize: function( s ) {
			this.el.style.width = s + 'px';
			this.el.style.height = s + 'px';
			this.width = s;
			this.height = s;
		},

		/**
		 * position the box
		 * @x 	: the x pos
		 * @y 	: the y pos
		 */
		position: function( x, y ) {
			var offsetX = arguments[2] ? 0 : this.width >> 1,
				offsetY = arguments[2] ? 0 : this.height >> 1;

			this.x = x;
			this.y = y;
			this.el.style.setProperty(figallery.config.prop, 'translate3D(' + (x - offsetX) + 'px, ' + (y - offsetY) + 'px,0)');
		},

		/**
		 * set the box color
		 * @val 	: rgba val
		 */
		setColor: function( val ) {
			this.el.style.background = val;
		},

		/**
		 * rotate the box
		 * @val 	: rotation in deg
		 */
		rotate: function( val ) {
			this.el.style.setProperty(figallery.config.prop, 'rotate(' + val + ')');
		},
		
		/**
		 * method called when it's time to leave the party
		 */
		setOut: function() {
			this.el.style.opacity = 0;
		},

		/**
		 * returns the box dom element
		 */
		getElement: function() {
			return this.el;
		}

	}
	
	figallery.LoaderAnim = LoaderAnim;

}).call(this);