 /**
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

// app namespace
;this.figallery = this.figallery || {};

(function(window, document, _, undefined) {

	figallery.options = {};

	/**
	 * Gallery Function :: constructor
	 */
	var	Gallery = function(settings,container) {
		'use strict';

		// base vals
		var el = document.querySelector(container) ? document.querySelector(container) : null,
			container = null,
			options = _.extend({}, figallery.defaults, settings),
			methods = {},
			models = [],
			items = [],
			galleryItems = [],
			itemWidth = 0,
			resizeTimeout = 0,
			toppanel,
			loaderAnim;

		/**
		 * Methods Object :: private
		 */
		methods = {

			/**
			 * init the gallery
			 */
			init: function() {

				// check if we got jsondata and an existing element in the dom  ::  return false and die silently
				if( !options.jsonData && el === null ) return false;

				// is the jsondata stringify'able  ::  return false and die silently
				if( JSON.stringify(options.jsonData) ) {
					methods.build(options.jsonData);
				} else {
					return false;
				}
			},

			/**
			 * if we have valid json, grab data and start things up
			 */
			build: function(itemsData) {
				var itemsArray = itemsData.images,
					jsonOptions = itemsData.options ? itemsData.options[0] : null;

				figallery.config.count = itemsArray.length;

				// did the json contain an 'options'-object, then lets merge it with out existing options
				if( jsonOptions ) {
					options = _.extend(options, figallery.defaults, jsonOptions);
				}

				// assign options to our base object
				figallery.options = options;

				// setup dom - pass the imageArray from our json
				methods.setup(itemsArray);
			},

			/**
			 * set things up, create dom's
			 */
			setup: function(itemsArray) {
				var i, model;

				// if an existing dom element was't passed in as an argument.. let's create one
				if( el === null ) el = figallery.utils.createEl('div', options.namespace+'-gallery', document.body);
				el.style.overflowX = 'hidden';

				// set max-width of gallery-container if passed in from json
				if(options.gallerywidth !== null) el.style.cssText = 'max-width:'+options.gallerywidth+';overflow-x:hidden;';

				// create a wrapper
				container = figallery.utils.createEl('div', options.namespace+'-gallery-wrapper', el);
				container.style.cssText = 'position:relative;display:block;overflow:hidden';

				// for each item on our data, create model and pass in settings from our json
				// create item instance passing in the model
				for(i = 0; i<figallery.config.count; i++) {
					model = methods.createItemModel(i,itemsArray[i].thumb,itemsArray[i].large);
					methods.createItem(model);
				}

				// if(options.perpage !== 0 && options.perpage < figallery.config.count) 
				methods.createPages();

				// call initial reposition
				methods.reposition();

				// display initial page (all images if we only got 1 page)
				methods.displayPage();

				// create new instance of toppanel navigation
				toppanel = new figallery.TopPanel();
				el.appendChild(toppanel.getElement());
				toppanel.toggle(figallery.config.pages.length > 1);
				
				// listen to window resize : reposition each time window get resized
				window.onresize=function(){
					clearTimeout(resizeTimeout);
					resizeTimeout = setTimeout(function() {
						methods.reposition();
					}, 100);
				};

				document.addEventListener("pageevent", methods.changePage, false);

			},

			/**
			 * method for creating a model object instance
			 * @id 		:model id
			 * @thumb 	:path to thumb
			 * @large	:path to large
			 */
			createItemModel: function(id, thumb, large) {
				var model = {
					id: id,
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

			/**
			 * method for creating new instance of FIItem
			 * sets callback to item selected
			 * pushes item into items array
			 * @model 	:model to assign to the FIItem
			 */
			createItem: function(model) {
				var self = this;

				// create a FIItem instance passing in the dom structure and a model object
				var item = new figallery.FIItem( model );

				// set callback to click
				item.onSelected( function(model) {
					figallery.config.setSingleIndex(model.id);
					self.displaySingle(model);
				});
				
				// push the instance into our items array
				items.push(item);
			},

			/**
			 * method for building up pages object
			 * creates an object containing arrays of FIItems instances
			 * each slot holds the instances that fits into each page
			 */
			createPages: function(){
				var i = 0,
					j = 0,
					p = 0,
					q = 0,
					sum = options.perpage > 0 ? options.perpage : figallery.config.count;

				// how many pages do we have
				figallery.config.pagesCount = Math.ceil(figallery.config.count/sum);
				
				// create an empty object in each slot of 'pages'
				for(p; p<figallery.config.pagesCount;p++) {
					figallery.config.pages[p] = {};
				}

				// set object structure with pages holding instances of FIItem's
				// sets length to each object so it's transformable to array
				for(i; i<figallery.config.pagesCount; i++) {
					for(j = 0; j<sum && q < figallery.config.count; j++) {
						if(q < figallery.config.count) {
							figallery.config.pages[i][j] = items[q];
							q++;
						}
					}
					figallery.config.pages[i].length = j;
				}
				figallery.config.pages.length = i;
			},

			/**
			 * map all FIItem instances
			 * add each item to container
			 * return array of current items
			 */
			getElements: function() {
				var a = Array.prototype.slice.call(figallery.config.pages[figallery.config.pageIndex]);
				var imgs = _.map(a, function(item,key) { container.appendChild(item.getElement()); return item; });
				return imgs;
			},

			/**
			 * map all current FIItem instances and pluck the image url
			 */
			getElementImageSource: function() {
				var paths = _.map(galleryItems, function(item,key) { return item.getImageElement().src; });
				return paths;
			},

			/**
			 * change page
			 * hide current content
			 * display new page content
			 */
			changePage: function() {
				methods.hide();
				setTimeout(function() {
					container.innerHTML = '';
					methods.displayPage();
				}, 500);
			},

			/**
			 * display page
			 * get span of page images
			 * load through imageloader
			 * display new set of images
			 */
			displayPage: function() {
				// methods.reposition();
				figallery.config.isAnimating = false;
				// create an array of each 'div' in our container
				galleryItems = methods.getElements();
				var imagePaths = methods.getElementImageSource();

				// display loaderanim
				loaderAnim = new figallery.LoaderAnim(4,35);
				el.appendChild(loaderAnim.getElement());
				
				// preload all images, once loaded lay it all out and show our items
				// set isAnimating to true
				figallery.ImageLoader(imagePaths).done(function(imgs) {
					
					// reposition
					methods.reposition();

					// set itemWidth prop
					itemWidth = options.itemwidth > 0 ? options.itemwidth : imgs[0].width;

					// lay it all out
					methods.layout();

					// time to show everything
					methods.show();

					// let it animate
					figallery.config.isAnimating = true;
					
					// destroy loaderanim
					loaderAnim.destroy();
				});
			},

			/**
			 * callback function after an FIItem was clicked
			 * creates a new instance of SingleView
			 * displays a single image
			 * @model 	: model instance to set to SingleView
			 */
			displaySingle: function(model) {
				
				// we are now displaying single view
				figallery.config.displayingSingle = true;

				// create a new SingleView instance
				var singleView = new figallery.SingleView(model);

				toppanel.toggle(figallery.config.displayingSingle);

				// set callback to closing of SingleView
				singleView.onClose(function() {
					figallery.config.displayingSingle = false;
					toppanel.toggle( (figallery.config.displayingSingle || figallery.config.pages.length > 1 ) );
					container.style.setProperty(figallery.config.prop, 'scale(1,1)');

					setTimeout(function(){
						if(singleView && singleView.getElement()) {
							el.removeChild(singleView.getElement());
							singleView = null;
						}
					}, 300);
				});

				// add SingleView to dom
				el.appendChild(singleView.getElement());

				// dim out grid
				container.style.setProperty('-'+figallery.config.pref+'-transition', 'all 0.5s ease-in-out');
				container.style.setProperty(figallery.config.prop, 'scale(0.9,0.9) translateY(-4%)');
			},

			/**
			 * method to set various vals, called on window resize
			 */
			reposition: function() {
				figallery.config.viewportWidth = window.innerWidth;
				figallery.config.viewportHeight = window.innerHeight;
				methods.layout();

				// if SingleView is active, set width / height of SingleView inner wrapper
				if( figallery.config.displayingSingle ) {
					var single = document.getElementsByClassName(options.namespace+'-gallery-single')[0],
						inner = single.childNodes[0];
					single.style.width = inner.style.width = figallery.config.viewportWidth+'px';
					single.style.height = inner.style.height = figallery.config.viewportHeight+'px';
				}
			},

			/**
			 * method for laying out all the pieces
			 */
			layout: function() {

				// local vars
				var numberOfColumns, fakeWidth, columnHeights, column, tallest, actualColumns, i, tmpCols, perpage;

				// reset vals
				perpage = figallery.options.perpage;
				tallest = 0;
				actualColumns = 0;

				// calculate number of columns to use based on viewport witdth
				numberOfColumns = 1 + Math.floor((el.offsetWidth - itemWidth) / (itemWidth + options.spacing));

				// hold a tmp of numberOfColumns
				tmpCols = numberOfColumns;

				// ensure we got 1 column, or set to maxcols 
				//otherwise create an extra column so we can keep a full width layout without scaling up the images
				numberOfColumns = (numberOfColumns === 0) ? 1 : options.maxcols > 0 ? options.maxcols : perpage <= numberOfColumns ? perpage : numberOfColumns +1;

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
				
				// for each item in galleryItems

				_.each(galleryItems, function(item, key) {
					
					// make sure we got dom-rendered items
					item.ensureRendered();

					// increment actualComuns val
					actualColumns++;

					// get best suited column to place the current item
					column = columnHeights.min();

					// if we should't animate the set css
					// else : animate the item to its delegated position
					if (!figallery.config.isAnimating || !figallery.config.transitions) {
						item.positionStatic(columnHeights[column] +'px', column * (fakeWidth + options.spacing) +'px', fakeWidth +'px');
					} else {
						item.positionAnimate('-'+figallery.config.pref+'-transition-property:left,top;-'+figallery.config.pref+'-transition-duration:0.45s;width:'+fakeWidth+'px;height:auto;position:absolute;top:'+columnHeights[column]+'px;left:'+(column * (fakeWidth + options.spacing))+'px;');
					}

					// assign val to columnHeights array
					columnHeights[column] = columnHeights[column] + item.getHeight() + options.spacing;

					// is the current column the tallest?
					if (columnHeights[column] > tallest) {
						tallest = columnHeights[column];
					}
				});

				numberOfColumns = (actualColumns < numberOfColumns) ? actualColumns : numberOfColumns;
				
				// set height/width of the container, center it
				container.style.height = tallest+'px';
				container.style.width = (((numberOfColumns) * (fakeWidth + options.spacing)) - options.spacing) +'px';
				container.style.margin = '0 auto';
				
			},

			/**
			 * show method
			 * show container
			 * iterate items and call show method on each item
			 */
			show: function() {	// call show method on each FIItem

				// set container visibility to visible
				container.style.visibility = 'visible';

				// loop our FIItem's and call show method on each item
				// passes in queue delay
				var i = 0,
					delay = options.transitionInTime;
				for(var i = 0; i < galleryItems.length; i++) {
					galleryItems[i].show(i*delay);
				}
			},

			/**
			 * hide method
			 * hide container
			 * iterate items and call hide method on each item
			 */
			hide: function() {	// call hide method on each FIItem
				container.style.height = '0px';
				container.style.visibility = 'hidden';
				// loop our FIItem's and call hide method on each item
				// passes in queue delay
				var i = 0,
					delay = options.transitionInTime;
				for(var i = 0; i < items.length; i++) {
					items[i].setOut(i*delay);
				}
			}

		};

		// call init method to get it started
		methods.init();

		// for test purpose
		return {
			methods : methods,
			config  : figallery.config,
			options  : figallery.options 
		}
	};

	figallery.Gallery = Gallery;

})(window, document, _);