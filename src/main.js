/**
 * Purpose: The main entry point of the game
 * Source:  main.js
 */

/* jshint esversion: 6 */

import './css/main.scss';

var cards = [];

// The amount of pixels the input's contents is allowed to exceed its size
const SAFE  = 5;

// The most efficient way to increase the font sizes is by powers of 2
const sizes = [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];

const FRONT = 0;
const BACK  = 1;

const ENTER = 13;
const SPACE = 32;
const LEFT  = 37;
const UP    = 38;
const RIGHT = 39;
const DOWN  = 40;

var qrCode    = document.getElementById('qrCode');
var instructions = document.getElementById('instructions');
var drop = document.getElementById('drop');
var card      = document.getElementById('card');
var front     = card.querySelector('#front');
var back      = card.querySelector('#back');
var frontText = card.querySelector('#front .text');
var backText  = card.querySelector('#back .text');

var currentCard = 0;
var currentFace = FRONT;

var indices = cards.map((x, i) => i);

var shuffle = function (a) {
  for (let i = a.length; i; --i) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
};

var flip = function () {
  // Flip the card
  currentFace = (currentFace + 1) % 2
  front.className = currentFace == FRONT ? 'shown' : '';
  back.className = currentFace == BACK ? 'shown' : '';
};

var render = function () {
  if (!cards.length) {
    return;
  }

  // Put that card's text on the front/back of the actual card
  frontText.innerText = cards[currentCard].front;
  resizeText(frontText);
  front.className = currentFace == FRONT ? 'shown' : '';
  backText.innerText = cards[currentCard].back;
  resizeText(backText);
  back.className = currentFace == BACK ? 'shown' : '';
};

var previous = function () {
  // Move the current card away
  card.className = 'dispose-right';

  // Shuffle the cards if we need to
  if (currentCard % cards.length == 0) {
    shuffle(cards);
  }

  setTimeout(function () {
    // Flip the current card face forwards
    currentFace = FRONT;

    // Pick a new card
    currentCard = (currentCard - 1 + cards.length) % cards.length;

    // Render it to the screen
    render();

    // Reveal the card
    card.className = 'show-left';
  }, 150);
};

var next = function () {
  // Move the current card away
  card.className = 'dispose-left';

  // Shuffle the cards if we need to
  if (currentCard % cards.length == 0) {
    shuffle(cards);
  }

  setTimeout(function () {
    // Flip the current card face forwards
    currentFace = FRONT;

    // Pick a new card
    currentCard = ++currentCard % cards.length;

    // Render it to the screen
    render();

    // Reveal the card
    card.className = 'show-right';
  }, 150);
};

// I just basically copied/pasted this method from my bigtext project
var resizeText = function (element) {
  // Store the font size to use. We'll start with 1.
  var fontSize = 1;

  // And if the user hasn't entered anything, just don't bother
  if (!element.innerText) { return; }

  // Now go through each power of 2 and try adding it to the size
    for (let i = 0; i < sizes.length; ++i) {
      fontSize += sizes[i];
      element.style.fontSize = (fontSize) + 'px';

      // If it's too big, we'll just go back
      if (element.scrollWidth > element.clientWidth + SAFE ||
          element.scrollHeight > element.clientHeight + SAFE) {
        fontSize -= sizes[i];
        element.style.fontSize = (fontSize) + 'px';
      }
    }
};

var showQRCode = function () {
  qrCode.classList.remove('invisible');
  qrCode.classList.add('visible');
};

var hideQRCode = function () {
  qrCode.classList.remove('visible');
  qrCode.classList.add('invisible');
};

var handleKeyDown = function (e) {
  if (e.keyCode == SPACE) {
    flip();
    document.querySelector('.key.space').classList.add('pressed');
  } else if (e.keyCode == ENTER) {
    showQRCode();
  } else if (e.keyCode == LEFT) {
    previous();
    document.querySelector('.key.left').classList.add('pressed');
  } else if (e.keyCode == RIGHT) {
    next();
    document.querySelector('.key.right').classList.add('pressed');
  }
};

var handleKeyUp = function (e) {
  if (e.keyCode == ENTER) {
    hideQRCode();
  } else if (e.keyCode == SPACE) {
    document.querySelector('.key.space').classList.remove('pressed');
  } else if (e.keyCode == LEFT) {
    document.querySelector('.key.left').classList.remove('pressed');
  } else if (e.keyCode == RIGHT) {
    document.querySelector('.key.right').classList.remove('pressed');
  }
};

var parseData = function (data) {
  // Separate the data by the number of dashes or whatever
  var lines = data.split(/\n+\-{3,}\n+/g);
  var cards = [];
  for (let i = 0; i < lines.length; i += 2) {
    var card = {
      front: lines[i],
      back: i + 1 < lines.length ? lines[i + 1] : '',
    };
    cards.push(card);
  }
  return cards;
};

function handleFileSelect (e) {
  e.stopPropagation();
  e.preventDefault();

  var files = e.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(x) {
        if (x.target.result) {
          // Parse the results and then move them to an object
          cards = parseData(x.target.result);
          render();
        }
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
  }
  drop.classList.add('invisible');
  drop.classList.remove('visible');

  instructions.classList.add('invisible');
  instructions.classList.remove('visible');

}

function handleDragOver (e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.

  drop.classList.add('visible');
  drop.classList.remove('invisible');
}

function handleDragLeave (e) {
  drop.classList.add('invisible');
  drop.classList.remove('visible');
}

// Bind all of the event listeners
card.addEventListener('click', flip);
document.addEventListener('dragover', handleDragOver, true);
document.addEventListener('dragleave', handleDragLeave, true);
document.addEventListener('drop', handleFileSelect, true);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
window.addEventListener('resize', render);

// Shuffle the indices
shuffle(indices);

// Render the first card
render();

//
// document.addEventListener('DOMContentLoaded', function () {
// });
