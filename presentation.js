$( document ).ready(function() {

  var currentSlide = 1,
    slideRows = 14,
    balloonSolo = false,
    groundDriftFrames = 4,
    airDriftFrames = 1,
    $viewPort = $('#viewPort');

  function autoNumberSlides() {
    var currentRow=1,
      currentCol=1,
      slides = $('slide');
    slides.each(function(num, slide) {
      $(slide).attr({
        number: num + 1,
        row: currentRow,
        col: currentCol
      });
      if (num >= slideRows + groundDriftFrames + airDriftFrames - 1) {
        // Balloon down
        currentRow--;
        if ( num % 2 !== 0) {
          currentCol++;
        }
      } else if (num >= groundDriftFrames + slideRows - 1) {
        // Horizontal motion in the sky
        currentCol++
      } else if ( num >= groundDriftFrames) {
        // Balloon up
        currentRow++;
      } else {
        // Horizontal motion on the ground
        currentCol++;
      };
    });
  }
  autoNumberSlides();


  $( "body" ).keydown(function(e) {
    if(e.keyCode == 37) {
      if (slideExists(currentSlide - 1)) {
        currentSlide = currentSlide - 1;
        gotoSlide( currentSlide );
      }
      e.preventDefault();
    } else if (e.keyCode == 39 || e.keyCode == 32) {
      if (slideExists(currentSlide + 1)) {
        currentSlide = currentSlide + 1;
        gotoSlide( currentSlide );
      }
      e.preventDefault();
    } else if (e.keyCode == 78 ) { // 'n'
      $('body').toggleClass('showNotes');
      e.preventDefault();
    } else if (e.keyCode == 83 ) { // 's'
      $('body').toggleClass('showSlideNumbers');
      e.preventDefault();
    }
  });

  if ( window.location.hash ) {
    var page = window.location.hash.substring(1);
    jumpToSlide( page );
  } else {
    jumpToSlide( 1 );
  }

  function jumpToSlide(number) {
    currentSlide = parseInt(number);
    gotoSlide( number, 0 );
  }

  function slideExists( number ) {
    var slides = $('slide[number=' + number + ']');
    return slides.length > 0;
  }

  function gotoSlide( number, speed ) {
    if ( speed == null ) {
      speed = 1800;
    }
    var scrollTop = $viewPort.scrollTop(),
      scrollLeft = $viewPort.scrollLeft(),
      pos = $('slide[number=' + number + ']').position();
    $viewPort.animate({
      scrollTop: [ scrollTop + pos.top, 'sin' ],
      scrollLeft: [ scrollLeft + pos.left, 'cos' ]
    }, speed, function() {
      // Populate slide numbers
      $('#slideNumbers').html(
        number + ' / ' + $('slide').length +
        ' [' + $('slide[number=' + number + ']').attr('col') +
        ', ' + $('slide[number=' + number + ']').attr('row') + ']'
      );
      // Balloon Transitions
      if ( number > 8 ) {
        $('#balloon').attr('status', 'expanded');
      } else {
        $('#balloon').attr('status', null);
      };
      if ( number > 14 ) {
        $('#balloon').attr('status', 'full');
      }
      if ( number > 18 ) {
        $('#balloon').attr('status', 'popped');
      }
      if ( number > 19 ) {
        $('#balloon').attr('status', 'parachute');
      }
      balloonSolo = number == 12;
    });


    window.location.hash = '#' + number;
  }

  // http://stackoverflow.com/questions/4969645/how-can-i-create-a-non-linear-trajectory-using-jquery-animate
  jQuery.easing.sin = function(p, n, firstNum, diff) {
      return Math.sin(p * Math.PI / 2) * diff + firstNum;
  };

  jQuery.easing.cos = function(p, n, firstNum, diff) {
      return firstNum + diff - Math.cos(p * Math.PI / 2) * diff;
  };

  function floatBalloon(callback) {
    var pos = $('#balloon').position(),
      newTop = 440 + (75 - (Math.random() * 150)),
      newLeft = 50 + (75 - (Math.random() * 150)),
      distance = Math.sqrt( Math.pow((pos.left-newLeft), 2) + Math.pow((pos.top-newTop), 2) ),
      time = 1000 + (distance * 100);
    if ( balloonSolo ) {
      $('#balloon').animate({
        top:  ( $('#viewPort').height() / 2 ) - 412,
        left: ( $('#viewPort').width() / 2 ) - 242,
        height: 825,
        width: 484
      }, 2000, function() {
        floatBalloon();
      });
    } else {
      $('#balloon').animate({
        top: [newTop, 'sin'],
        left: [newLeft, 'cos'],
        height: 550,
        width: 323
      }, 2000, function() {
        floatBalloon();
      });
    }
  };
  floatBalloon();

});