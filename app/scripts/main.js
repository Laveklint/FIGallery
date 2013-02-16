var cat = ['people','sports','abstract','animals','fashion','cats', 'food', 'nature'];
var j = {
  "options" : [
    {
      "namespace": 'fi',
      "max": 0,
      "spacing": 10,
      "perpage": 0,
      "maxcols": 0,
      "transitionInTime": 70,
      "itemwidth": 0,
      "gallerywidth": '100%'
    }
  ],

  "images" : [ 
    { 
      "thumb" : "http://lorempixum.com/340/340/fashion/2",
      "large" : "http://lorempixum.com/1000/650/fashion/2"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/people/2",
      "large" : "http://lorempixum.com/1000/650/people/2"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/people/3",
      "large" : "http://lorempixum.com/1000/650/people/3"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/people/4",
      "large" : "http://lorempixum.com/1000/650/people/4"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/people/5",
      "large" : "http://lorempixum.com/1000/650/people/5"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/people/6",
      "large" : "http://lorempixum.com/1000/650/people/6"
      },
     { 
      "thumb" : "http://lorempixum.com/340/340/people/7",
      "large" : "http://lorempixum.com/1000/650/people/7"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/people/8",
      "large" : "http://lorempixum.com/1000/650/people/8"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/people/9",
      "large" : "http://lorempixum.com/1000/650/people/9"
      },
    { 
      "thumb" : "http://lorempixum.com/340/340/nature/1",
      "large" : "http://lorempixum.com/1000/650/nature/1"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/nature/2",
      "large" : "http://lorempixum.com/1000/650/nature/2"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/nature/3",
      "large" : "http://lorempixum.com/1000/650/nature/3"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/nature/4",
      "large" : "http://lorempixum.com/1000/650/nature/4"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/nature/5",
      "large" : "http://lorempixum.com/1000/650/nature/5"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/nature/6",
      "large" : "http://lorempixum.com/1000/650/nature/6"
      },
     { 
      "thumb" : "http://lorempixum.com/340/340/nature/7",
      "large" : "http://lorempixum.com/1000/650/nature/7"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/fashion/2",
      "large" : "http://lorempixum.com/1000/650/fashion/2"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/fashion/3",
      "large" : "http://lorempixum.com/1000/650/fashion/3"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/fashion/4",
      "large" : "http://lorempixum.com/1000/650/fashion/4"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/fashion/5",
      "large" : "http://lorempixum.com/1000/650/fashion/5"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/fashion/6",
      "large" : "http://lorempixum.com/1000/650/fashion/6"
      },
     { 
      "thumb" : "http://lorempixum.com/340/340/fashion/7",
      "large" : "http://lorempixum.com/1000/650/fashion/7"
      },
      { 
      "thumb" : "http://lorempixum.com/340/270/fashion/8",
      "large" : "http://lorempixum.com/1000/650/fashion/8"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/fashion/9",
      "large" : "http://lorempixum.com/1000/650/fashion/9"
      },
      { 
      "thumb" : "http://lorempixum.com/340/340/abstract/1",
      "large" : "http://lorempixum.com/1000/650/abstract/1"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/abstract/2",
      "large" : "http://lorempixum.com/1000/650/abstract/2"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/abstract/3",
      "large" : "http://lorempixum.com/1000/650/abstract/3"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/abstract/4",
      "large" : "http://lorempixum.com/1000/650/abstract/4"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/abstract/5",
      "large" : "http://lorempixum.com/1000/650/abstract/5"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/abstract/6",
      "large" : "http://lorempixum.com/1000/650/abstract/6"
      },
     { 
      "thumb" : "http://lorempixum.com/340/340/abstract/7",
      "large" : "http://lorempixum.com/1000/650/abstract/7"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/abstract/8",
      "large" : "http://lorempixum.com/1000/650/abstract/8"
      },
    { 
      "thumb" : "http://lorempixum.com/340/270/abstract/9",
      "large" : "http://lorempixum.com/1000/650/abstract/9"
      },
    ]
  };


window.onload = function() {

  new figallery.Gallery({
    jsonData: j
  }, '#gallery');
}