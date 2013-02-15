 /*
 * FI Gallery
 *
 * Copyright 2013 Pierre Laveklint
 *
 * Dependency: lodash https://github.com/bestiejs/lodash
 *
 * Expect a json-object. The JSON should be defined as follow:
 *
 * 	{ 
 *		'options' : [
 *		  {
 *			'namespace': 'fi',
 *			'itemwidth': 0,
 *			'spacing': 10,
 *			'perpage': 0,
 *			'maxcols': 0,
 *			'maxrows': 0,
 *			'transitionInTime': 70
 *		  }
 *		] 
 *  	'images' : [ 
 *  	  { 
 *    		'thumb' : 'http://lorempixum.com/150/150',
 *    		'large' : 'http://lorempixum.com/400/600'
 *		  }
 *  	]
 * 	}
 *
 * Can give extra styling with css with the following classnames: 
 * (namespace is passed in from json, defaults to 'fi')
 *		
 *		namespace-gallery 			// outer dom if no dom was passed in as container
 *		namespace-gallery-wrapper 	// wrapper within container
 * 		namespace-gallery-single 	// single view wrapper dom
 */

;(function(window, document, _, undefined) {

	window.FIGallery = function(container, settings) { // constructor 
		'use strict';

		// base vals
		var el = document.querySelector(container) ? document.querySelector(container) : null,
			container = null,
			options = _.extend({}, FIGallery.defaults, settings),
			config = {},
			methods = {},
			displayingSingle = false,
			models = [],
			items = [],
			galleryItems = [],
			count = 0,
			viewportWidth = 0,
			viewportHeight = 0,
			itemWidth = 0,
			resizeTimeout = 0,
			pages = {},
			pagesCount = 0,
			pageIndex = 0,
			imageIndex = 0;

		/*
		*	Methods Object :: private
		*/
		methods = {

			init: function() {	// init the gallery

				// check if we got jsondata and an existing element in the dom  ::  return false and die silently
				if( !options.jsonData && el === null ) return false;

				// is the jsondata stringify'able  ::  return false and die silently
				if( JSON.stringify(options.jsonData) ) {
					methods.build(options.jsonData);
				} else {
					return false;
				}

			},

			build: function(itemsData) {	// if we have valid json, grab data and start things up
				var itemsArray = itemsData.images,
					jsonOptions = itemsData.options ? itemsData.options[0] : null;

				count = itemsArray.length;

				// did the json contain an 'options'-object, then lets merge it with out existing options
				if( jsonOptions ) {
					options = _.extend(options, FIGallery.defaults, jsonOptions);
				}

				// setup dom - pass the imageArray from our json
				methods.setup(itemsArray);
			},

			setup: function(itemsArray) {	// set things up, create dom's
				var i, model;

				// if an existing dom element was't passed in as an argument.. let's create one
				if( el === null ) el = methods.createEl('div', options.namespace+'-gallery', document.body);
				el.style.overflowX = 'hidden';

				// set max-width of gallery-container if passed in from json
				if(options.gallerywidth !== null) el.style.cssText = 'max-width:'+options.gallerywidth+';overflow-x:hidden;';

				// create a wrapper
				container = methods.createEl('div', options.namespace+'-gallery-wrapper', el);
				container.style.position = 'relative';
				container.style.display = 'block';
				
				// set default val of isAnimating
				config.transitions = methods.getTransitionState();
				config.isAnimating = false;

				// for each item on our data, create model and pass in settings from our json
				// create item instance passing in the model
				for(i = 0; i<count; i++) {
					model = methods.createItemModel(itemsArray[i].id,itemsArray[i].thumb,itemsArray[i].large);
					methods.createItem(model);
				}

				// if(options.perpage !== 0 && options.perpage < count) 
				methods.createPages();

				// create an array of each 'div' in our container
				galleryItems = methods.getElements();
				console.log(galleryItems);
				// preload all images, once loaded lay it all out and show our items
				// set isAnimating to true
				preloadImages(galleryItems).done(function(imgs) {
					methods.reposition();
					itemWidth = options.itemwidth > 0 ? options.itemwidth : imgs[0].width;
					methods.layout();
					methods.show();
					config.isAnimating = true;
				});
				
				window.onresize=function(){
					clearTimeout(resizeTimeout);
					resizeTimeout = setTimeout(function() {
						methods.reposition();
					},100);
				};

			},

			createEl: function(tag, cls, parent) {	// method for creating dom elements and setting classname
				var _el = document.createElement(tag);
				_el.className = cls ? cls : '';

				// if a parent is passed in as argument, append the dom
				if(parent) parent.appendChild(_el);

				// return the newly created dom
				return _el;
			},

			createItemModel: function(id, thumb, large) {	// method for creating a model object instance
				var model = {
					thumb: thumb,
					large: large,
					active: false,
					inview: false
				}

				// push the model into our models array
				models.push(model);

				// return the newly created model object
				return model;
			},

			createItem: function(model) {	// method for creating basic dom structure and creating a FIItem instance
				var self = this;

				// create a FIItem instance passing in the dom structure and a model object
				var item = new FIItem( model, config.pref, config.prop, options.filter );

				// set callback to click
				item.onSelected( function(model) {
					self.displaySingle(model);
				});
				
				// push the instance into our items array
				items.push(item);

				// append the base dom of the FIItem to our container
				// container.appendChild(item.getElement());
			},

			createPages: function(){
				var p,q,i,j,
					sum = options.perpage > 0 ? options.perpage : count;

				pagesCount = Math.ceil(count/sum);
				
				for(var p=0; p<pagesCount;p++) {
					pages[p] = {};
				}

				var q=0;
				for(var i=0; i<pagesCount; i++) {
					for(var j=0; j<sum && q < count; j++) {
						if(q < count) {
							pages[i][j] = items[q];
							q++;
						}
					}
					pages[i].length = j;
				}
			},

			getElements: function() {
				var a = Array.prototype.slice.call(pages[pageIndex]);
				var imgs = _.map(a, function(item,key) { container.appendChild(item.getElement()); return item.getImageElement().src; });
				return imgs;
			},

			changePage: function(delta) {

			},

			displaySingle: function(model) { // method called after clicking an image
				displayingSingle = true;

				// create dom structor for our single view
				var div = document.createElement('div'),
					frag = document.createDocumentFragment(),
					inner = document.createElement('div'),
					img = document.createElement('img'),
					blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
					image;

				// set initial styling
				div.className = options.namespace+'-gallery-single';
				div.style.opacity = '0';
				div.style.cssText = '-'+config.pref+'-transition:all 0.4s;opacity:1;cursor:crosshair;background:rgba(0,0,0,0.88);z-index:1;position:fixed;width:100%;height:'+viewportHeight+'px;left:0;top:0;'
				inner.style.cssText = 'position:relative;display:table-cell;vertical-align:middle;'+config.prop+':translate3d(0,0,0);max-width:100%;width:'+viewportWidth+'px;height:'+viewportHeight+'px;text-align:center';
				img.style.cssText = 'vertical-align:middle;display:inline;max-width:80%;height:auto;'+config.prop+':translateY(-200%)';
				frag.appendChild(img);
				inner.appendChild(frag);
				div.appendChild(inner);
				el.appendChild(div);

				container.style.setProperty('-'+config.pref+'-transition', 'all 0.5s ease-in-out');
				container.style.setProperty(config.prop, 'scale(0.9,0.9) translateY(-4%)');

				image = new Image();
				image.onload = function() {
					if(image.src == blank) return;
					setTimeout(function(){
						img.style.setProperty('-'+config.pref+'-transition', 'all 0.5s ease-out');
						img.style.setProperty(config.prop, 'translateY(0%)');
						image = null;
					},100);
				}

				img.src = model.large;
				image.src = blank;
				image.src = img.src;

				div.addEventListener('click', function cleanOut() {
					div.style.opacity = 0;
					img.style.setProperty('-'+config.pref+'-transition', 'all 0.4s ease-in');
					img.style.setProperty(config.prop, 'translateY(-200%)');
					container.style.setProperty(config.prop, 'scale(1,1)');

					setTimeout(function() {
						div.removeEventListener('click', cleanOut, false);
						inner.removeChild(img);
						div.removeChild(inner);
						el.removeChild(div);
						img = null;
						inner = null;
						div = null;
					}, 600);
				});
			},

			reposition: function() {
				viewportWidth = window.innerWidth;
				viewportHeight = window.innerHeight;
				methods.layout();

				if( displayingSingle ) {
					var inner = document.getElementsByClassName(options.namespace+'-gallery-single')[0];
					inner.style.width = viewportWidth+'px';
					inner.style.height = viewportHeight+'px';

				}
			},

			layout: function() {	// method for laying out all the pieces

				// local vars
				var numberOfColumns, fakeWidth, columnHeights, column, tallest, actualColumns, i, tmpCols;

				// reset vals
				tallest = 0;
				actualColumns = 0;

				// calculate number of columns to use based on viewport witdth
				numberOfColumns = 1 + Math.floor((el.offsetWidth - itemWidth) / (itemWidth + options.spacing));

				// hold a tmp of numberOfColumns
				tmpCols = numberOfColumns;

				// ensure we got 1 column, or set to maxcols 
				//otherwise create an extra column so we can keep a full width layout without scaling up the images
				numberOfColumns = (numberOfColumns === 0) ? 1 : options.maxcols > 0 ? options.maxcols : numberOfColumns +1;

				// set a fakewidth if we're setting a full width layout
				fakeWidth = tmpCols === numberOfColumns -1 ? (el.offsetWidth / (numberOfColumns)) - (options.spacing) : itemWidth;
				
				// array to push the column heights into
				columnHeights = [];

				// reset iterator var
				i = 0;

				// loop through numberOfColumns, set each slot to 0
				for (i; i < numberOfColumns; i++) {
					columnHeights[i] = 0;
				}
				
				_.each(items, function(item, key) {	// for each item in galleryItems
					
					// make sure we got dom-rendered items
					item.ensureRendered();

					// increment actualComuns val
					actualColumns++;

					// get best suited column to place the current item
					column = columnHeights.min();

					// if we should't animate the set css
					// else : animate the item to its delegated position
					if (!config.isAnimating || !config.transitions) {
						item.positionStatic(columnHeights[column] +'px', column * (fakeWidth + options.spacing) +'px', fakeWidth +'px');
					} else {
						item.positionAnimate('-'+config.pref+'-transition-property:left,top;-'+config.pref+'-transition-duration:0.45s;width:'+fakeWidth+'px;height:auto;position:absolute;top:'+columnHeights[column]+'px;left:'+(column * (fakeWidth + options.spacing))+'px;');
					}

					// assign val to columnHeights array
					columnHeights[column] = columnHeights[column] + item.getHeight() + options.spacing;

					// is the current column the tallest?
					if (columnHeights[column] > tallest) {
						tallest = columnHeights[column];
					}
				});

				if (true) {
					numberOfColumns = (actualColumns < numberOfColumns) ? actualColumns : numberOfColumns;
				}

				// set height/width of the container, center it
				container.style.height = tallest+'px';
				container.style.width = (((numberOfColumns) * (fakeWidth + options.spacing)) - options.spacing) +'px';
				container.style.margin = '0 auto';
				
			},

			show: function() {	// call show method on each FIItem

				// loop our FIItem's and call show method on each item
				// passes in queue delay
				var i = 0,
					delay = options.transitionInTime;
				for(var i = 0; i < items.length; i++) {
					items[i].show(i*delay);
				}
			},

			getTransitionState: function() {
				return (function() {
					var obj = document.createElement('div'),
					props = ['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransition', 'msTransform'];
					for (var i in props) {
						if ( obj.style[ props[i] ] !== undefined ) {
							config.pref = props[i].replace('Transform','').toLowerCase();
							config.prop = '-' + config.pref + '-transform';
							return true;
						}
					}
					return false;
				}());
			}

		};

		// call init method to get it started
		methods.init();
	};


	FIGallery.defaults = {	// default props of the gallery

		namespace: 'fi',
		itemwidth: 0,
		spacing: 10,
		perpage: 0,
		maxcols: 0,
		maxrows: 0,
		transitionInTime: 70,
		gallerywidth: null

	};

	/*
	*	FIItem function
	*	@args: dom element, model object
	*/
	function FIItem(model,pref,prop,filter) {

		this.pref = pref;
		this.prop = prop;
		this.filter = filter;
		this.model = model;

		// build dom
		this.build();

		// call init
		this.init();
	};

	FIItem.prototype = {	// prototype FIItem

		build: function() {
			// create basic dom elems
			var itemDom = document.createElement('div'),
				image = document.createElement('img');

			// put it together
			itemDom.appendChild(image);

			// set reference to item base dom
			this.el = itemDom;
		},

		init: function() {
			this.el.style.cssText = 'box-sizing:border-box;-moz-box-sizing:border-box;position:absolute;visibility:hidden;z-index:1;';
			
			this.img = this.el.getElementsByTagName('img')[0];
			this.img.style.cssText = 'box-sizing:border-box;-moz-box-sizing:border-box;cursor:pointer;max-width:100%;height:auto;position:relative;';
			
			this.listen();
			this.loadThumb();
		},

		listen: function() {
			var self = this;

			self.el.addEventListener('mouseover', function() {
				self.img.style.setProperty('-'+self.pref+'-transition', 'all 0.3s ease-in');
				self.img.style.setProperty('border', '8px solid white');
			});

			self.el.addEventListener('mouseout', function() {
				self.img.style.setProperty('border', '0');
			});
		},

		onSelected: function(fn) {
			var self = this;

			self.el.addEventListener('click', function() {
				fn(self.model);
			});
		},

		loadThumb: function() {
			this.img.src = this.model.thumb;
		},

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

		getWidth: function() {
			return this.el.offsetWidth;
		},

		getHeight: function() {
			return this.el.offsetHeight;
		},

		getElement: function() {
			return this.el;
		},

		getImageElement: function() {
			console.log(this.img);
			return this.img;
		},

		ensureRendered: function() {
			if (this.el.style.display == 'none') {
				this.el.style.display = 'block';
			}
		},

		positionStatic: function(top, left, width) {
			this.el.style.top = top;
			this.el.style.left = left;
			this.el.style.width = width;
		},

		positionAnimate: function(style) {
			this.el.style.cssText = style;
		}

	};

	/*
	*	Prototype Array with a method to return the min val
	*	of the array 
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

	/* 
	*	Preload all images
	*/
	function preloadImages(imgs) {
		// base vals
		var i = 0,
			// imgs = getImages(),
			count = imgs.length,
			images = [], 
			loadedImages = 0, 
			postFunction = function() {};

		// method called after each loaded image, if all is dont.. call callback
		function imageloadpost(){
			loadedImages++;
			if (loadedImages==imgs.length){
				postFunction(images); //call postFunction and pass in newimages array as parameter
			}
		}

		// get all 'img' doms within our parent dom
		function getImages() {
			var im = [];
			_.each(parent, function(p) {
				im.push(p.getElementsByTagName('img')[0].src);
			} );
			return im;
		}

		// loop and create Image instance, setup listeners
		for (i; i < count; i++){
			images[i] = new Image();
			console.log(imgs[i]);
			images[i].src = imgs[i];
			images[i].onload = function(){
				imageloadpost();
			}
			images[i].onerror = function(){
				imageloadpost();
			}
		}

		// return object with chanined 'done' method
		return {
			done: function(fn) {
				postFunction=fn || postFunction;
			}
		}
	}

})(window, document, _);