
// carousel.js
// =============================================
// This file contains the logic related to the carousel on the homepage
// Gus Wezerek is the original author, go to him with questions


// GLOBALS
// =============================================
var CONFIG = {
	mainExample: $('.example-main'),
	subExamples: $('.example-sub'),
	exampleCounter: 0,
	carouselLen: $('.example-sub').length,
	carouselTimer: 0,
	carouselInterval: 5000
};

// Add our first image
updateCarousel();

// Start the carousel
startCarousel();

// When everything else is ready, load the example thumbnails
$(window).load(addExampleImg());

// HELPERS
// =============================================

function startCarousel() {
	// Don't start the carousel if the main example mod is hidden
	if ( CONFIG.mainExample.css('display') !== 'block' ) {
		return;
	}
	CONFIG.carouselTimer = setInterval(advanceCarousel, CONFIG.carouselInterval);
}

function advanceCarousel() {
	// End the carousel if the main example mod is hidden
	if ( CONFIG.mainExample.css('display') !== 'block' ) {
		clearInterval(CONFIG.carouselTimer);
	}
	if (CONFIG.exampleCounter === CONFIG.carouselLen - 1) {
		CONFIG.exampleCounter = 0;
	} else {
		CONFIG.exampleCounter += 1;
	}

	updateCarousel();
}

function updateCarousel() {
	// Give the new tease the active class
	setActiveTease();

	// Swap the main img to the hovered tease
	setMain();
}

function setActiveTease() {
	CONFIG.subExamples.addClass('example-inactive').removeClass('example-active');
	CONFIG.subExamples.eq(CONFIG.exampleCounter).addClass('example-active');
}

function setMain() {
	var $newTease = CONFIG.subExamples.eq(CONFIG.exampleCounter);

	// Switch src of main img
	CONFIG.mainExample.find('.example-img-wrap').css('background-image', 'url(' + $newTease.data('img-src') + ')');

	// Switch caption of main img
	var $newCaption = CONFIG.mainExample.find('.example-caption-wrap').html($newTease.find('.example-caption-wrap').html());

	// Set product label, this should probably be templated
	$newCaption.find('.example-link').prepend('<p class="example-slug label">' + $newTease.data('graph-type') + '</p>');
}

// Restarts the carousel timer so the li you just hovered on doesn't advance 
// a second later because of the setInterval in the bground
function restartTimer() {
	clearInterval(CONFIG.carouselTimer);
	startCarousel();
}

function addExampleImg() {
	_.each(CONFIG.subExamples, function(el){
		var $el = $(el);
		$el.find('.example-img').attr('src', $el.data('img-src'));
	});
}


// HANDLERS
// =============================================

CONFIG.subExamples.on({
	mouseenter: function() {
		var newIndex = CONFIG.subExamples.index($(this));
		CONFIG.exampleCounter = newIndex;

		updateCarousel();
		restartTimer();
	},
	mouseleave: function() {
		CONFIG.subExamples.addClass('example-inactive').removeClass('example-active');
		CONFIG.subExamples.eq(CONFIG.exampleCounter).addClass('example-active');
	}
});


// WINDOW RESIZE
// =============================================

// Debounce so that we're not constantly checking for window resizing
var lazyLayout = _.debounce(function() {
	if ( CONFIG.mainExample.css('display') === 'block' ) {
		restartTimer();
	}
}, 100);

$(window).resize(lazyLayout);

// home.js
// =============================================
// This file contains the logic related to the homepage.
// Gus Wezerek is the original author; go to him with questions.


// SETUP
// =============================================

var selectTemplate = _.template($('.atlas-select-template').html());
var bodyEl = document.body;
var openbtn = document.getElementById('open-button');
var closebtn = document.getElementById('close-button');
var isOpen = false;

initSlideinNav();

function initSlideinNav() {
  openbtn.addEventListener('click', toggleNav);
  if (closebtn) {
    closebtn.addEventListener('click', toggleNav);
  }

  // close the menu element if the target is not the menu element or one of its descendants
  $('.js-content-wrap').on('click', function(e) {
    var target = e.target;
    if (isOpen && target !== openbtn) {
      toggleNav();
    }
  });
}


// HELPERS
// =============================================

function populateSelect(options, menu) {
  // Calculate which dropdowns to populate
  var toAppendString = '';

  // Sort the options alphabetically
  options.sort(function(a, b) {
    return a[0] > b[0] ? 1 : -1;
  });

  _.each(options, function(e, i) {
    toAppendString += selectTemplate({
      option: options[i]
    });
  });

  menu.html(toAppendString);
}

function toggleNav() {
  if (isOpen) {
    $(bodyEl).removeClass('show-site-nav-slidein');
  } else {
    $(bodyEl).addClass('show-site-nav-slidein');
  }
  isOpen = !isOpen;
}


// HANDLERS
// =============================================

$.ajax({
  dataType: 'json',
  url: 'api/dropdowns/countries/'
}).done(function(data) {
  populateSelect(data, $('.js-select-countries'));
});

$('.js-select-countries').on('change', function() {
  var $this = $(this);
  ga('send', {
    'hitType': 'event', // Required.
    'eventCategory': 'Explore by Country', // Required.
    'eventAction': 'click', // Required.
    'eventLabel': $this.find('option:selected').text()
  });
  window.location.href = '../explore/tree_map/export/' + $this.val() + '/all/show/2012/';
});


$('.js-select-products').on('change', function() {
  var $this = $(this);
  ga('send', {
    'hitType': 'event', // Required.
    'eventCategory': 'Explore by Product', // Required.
    'eventAction': 'click', // Required.
    'eventLabel': $this.find('option:selected').text()
  });
  window.location.href = '../explore/tree_map/export/show/all/' + $this.val() + '/2012/';
});

$('.track-click').on('click', function() {
  var $this = $(this);
  ga('send', {
    'hitType': 'event', // Required.
    'eventCategory': $this.data('ga-category'), // Required.
    'eventAction': 'click', // Required.
    'eventLabel': $this.data('ga-label')
  });
});