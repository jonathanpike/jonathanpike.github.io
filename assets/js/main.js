window.onload = function() {
	if (window.innerWidth >= 600) {
		function getScrollTop() {
		  if (typeof window.scrollY !== 'undefined' ) {
		    // Most browsers
		    return window.scrollY;
		  }

		  var d = document.documentElement;
		  if (d.clientHeight) {
		    // IE in standards mode
		    return d.scrollTop;
		  }

		  // IE in quirks mode
		  return document.body.scrollTop;
		}

		window.onscroll = function() {
		  var box = document.getElementById('box'),
		      scroll = getScrollTop();

		  if (scroll <= 28) {
		    box.style.top = "0px";
		  }
		  else {
		    box.style.top = (scroll + 2) + "px";
		  }
		};
	};
	
	document.getElementById("day").innerHTML = dayOfWeek();

	var drop = new Drop({
  		target: document.querySelector('.drop-target'),
  		content: 'Everyday Comfort: <br/><span class="good">Good</span> <span class="better">Better</span> <span class="best">Best</span>',
  		position: 'right middle',
  		classes: 'drop-theme-arrows-bounce',
  		openOn: 'click'
  	});
};
