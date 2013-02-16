// app namespace
;this.figallery = this.figallery || {};

(function() {
	'use strict';

	/*
	* ImageLoader
	* @pathArray 	: array of image paths
	*/
	var ImageLoader = function(pathArray) {
		// base vals
		var i = 0,
			count = pathArray.length,
			images = [], 
			loadedImages = 0, 
			postFunction = function() {};

		// method called after each loaded image, if all is dont.. call callback
		function imageloadpost(){
			loadedImages++;
			if (loadedImages==pathArray.length){
				postFunction(images); //call postFunction and pass in newimages array as parameter
			}
		}

		// loop and create Image instance, setup listeners
		for (i; i < count; i++){
			images[i] = new Image();
			images[i].src = pathArray[i];
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
	};

	figallery.ImageLoader = ImageLoader;

}).call(this);