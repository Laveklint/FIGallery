// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	/*
	* LoaderAnim function
	* @boxcount 	: number of boxes
	* @size 		: size of boxes
	* @radius 		: the radius of orbit sphere
	*/
	var LoaderAnim = function(boxCount,size,radius) {
		var boxCount = boxCount ? boxCount : 8,
			boxes = [],
			size = size ? size : 10,
			spacing = 5,
			step = Math.PI * 2 / boxCount,
			angle = 0,
			x = 0,
			y = 0,
			animateOut = false,
			radius = radius ? radius : 20,
			point = figallery.config.viewportWidth >> 1,
			pool = [],
			timer = 0,
			stage = figallery.utils.createEl('div', 'loader-anim'),
			inner = figallery.utils.createEl('div', 'loader-anim-inner', stage);

		/*
		* init anim
		*/
		function init() {

			// figure out center pos for box sphere
			var perc = figallery.config.viewportHeight - point;
			perc = ((perc >> 1) - point) >> 1;
			stage.style.cssText = 'position:fixed;top:0;left:0;height:100%;width:100%;z-index:100;';
			inner.style.cssText = '-'+figallery.config.pref+'-transform:translateY('+perc+'px);position:relative;height:100%;';
			
			// create as many box instances as boxCount
			for(var i=0; i<boxCount; i++) {
				var box = new Box(),
					el = box.getElement();

				// set some fancy random colour
				var r = Math.round(Math.random () * 255),
					g = Math.round(Math.random () * 255),
					b = Math.round(Math.random () * 255);

				// set color of box
				box.setColor( 'rgba('+r+','+g+','+b+', '+(0.3 + Math.random()*1)+')' );

				// set size of box
				box.setSize( size, size );

				// push box into pool
				pool.push( box );

				// append box element to inner dom
				inner.appendChild(el);
			}
			
			// let's animate
			animate();
		}

		/*
		* requestanimationframe handler
		* calls rotate
		* get raf id so it can be canceled later
		*/
		function animate() {
			timer  = requestAnimationFrame( animate );
			rotate();
		}

		/*
		* rotate the boxes in a sphere
		*/
		function rotate() {
			for (var i = 0; i < boxCount; i++) {
				x = radius * Math.cos( angle ) + point;
				y = radius * Math.sin( angle ) + point;
				
				// set rotation
				pool[i].rotate( -Math.atan2( y - point, x - point ) * 180 / Math.PI + 90 + 'deg');

				// set position
				pool[i].position( x, y );

				angle += step;

				// if it's time to exit, call setOut method of each box
				if(animateOut) pool[i].setOut();
			}

			// make sure we only act once on animateOut
			if(animateOut) animateOut = false;

			// increment radius and angle of the boxes
			angle += Math.sin(Math.cos(0.03))*0.03;
			radius += Math.sin(Math.cos(angle)*2);
		}

		/*
		* returns loaderanim stage
		*/
		function getElement() {
			return stage;
		}

		/*
		* destroy, clean up
		*/
		function destroy() {
			animateOut = true;
			setTimeout(function() {
				cancelAnimationFrame( timer );
				timer = null;

				clearPool();

				stage.removeChild(inner);
				stage.parentNode.removeChild(stage);
				pool = [];
			}, 1000);
		}

		/*
		* clean up the pool
		*/
		function clearPool() {
			var i = 0, len = pool.length, boxel;
			for(i; i<len; i++) {
				boxel = pool[i].getElement();
				inner.removeChild(boxel);
				boxel = null;	
				pool[i] = null;
			}
		}

		// init loaderanim
		init();

		/*
		* api
		*/
		return {
			getElement : getElement,
			init : init,
			destroy : destroy
		}
	};

	/*
	* box object
	*/
	var Box = function() {
		this.el = document.createElement('div');
		this.el.style.position = 'absolute';
		this.el.style.setProperty('-'+figallery.config.pref+'-transition', 'opacity 0.5s ease-out');
	}

	/*
	* box prototype
	*/
	Box.prototype = {

		/*
		* sets the size of the box
		* @s 	: the size
		*/
		setSize: function( s ) {
			this.el.style.width = s + 'px';
			this.el.style.height = s + 'px';
			this.width = s;
			this.height = s;
		},

		/*
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

		/*
		* set the box color
		* @val 	: rgba val
		*/
		setColor: function( val ) {
			this.el.style.background = val;
		},

		/*
		* rotate the box
		* @val 	: rotation in deg
		*/
		rotate: function( val ) {
			this.el.style.setProperty(figallery.config.prop, 'rotate(' + val + ')');
		},
		
		/*
		* method called when it's time to leave the party
		*/
		setOut: function() {
			this.el.style.opacity = 0;
		},

		/*
		* returns the box dom element
		*/
		getElement: function() {
			return this.el;
		}

	}
	
	figallery.LoaderAnim = LoaderAnim;

}).call(this);