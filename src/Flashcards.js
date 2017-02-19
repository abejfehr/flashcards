import Deck from './Deck';
import Keys from './Keys';

// The amount of pixels the input's contents is allowed to exceed its size
const SAFE  = 5;

// The most efficient way to increase the font sizes is by powers of 2
const sizes = [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];

export default class Flashcards {
  constructor () {
    this._deck = null;

    this.qrCode       = document.getElementById('qrCode');
    this.instructions = document.getElementById('instructions');
    this.drop         = document.getElementById('drop');
    this.card         = document.getElementById('card');
    this.front        = this.card.querySelector('#front');
    this.back         = this.card.querySelector('#back');
    this.frontText    = this.card.querySelector('#front .text');
    this.backText     = this.card.querySelector('#back .text');

    // Bind all of the event listeners
    document.addEventListener('dragover', this.handleDragOver.bind(this), true);
    document.addEventListener('dragleave', this.handleDragLeave.bind(this), true);
    document.addEventListener('drop', this.handleDrop.bind(this), true);
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('resize', this.render.bind(this));
  }

  previous () {
    // Move the current card away
    card.classList.remove('show-right');
    card.classList.remove('dispose-left');
    card.classList.remove('show-left');
    card.classList.add('dispose-right');

    setTimeout(function () {
      // Pick a new card
      this._deck.previous();

      // Render it to the screen
      this.render();

      // Reveal the card
      card.classList.remove('dispose-right');
      card.classList.add('show-left');
    }.bind(this), 150);
  }

  next () {
    // Move the current card away
    card.classList.remove('show-right');
    card.classList.remove('dispose-right');
    card.classList.remove('show-left');
    card.classList.add('dispose-left');

    setTimeout(function () {
      // Pick a new card
      this._deck.next();

      // Render it to the screen
      this.render();

      // Reveal the card
      card.classList.remove('dispose-left');
      card.classList.add('show-right');
    }.bind(this), 150);
  }

  render () {
    if (!this._deck) { return; }

    // Put that card's text on the front/back of the actual card
    this.frontText.innerText = this._deck.top.front;
    this.resizeText(this.frontText);
    if (this._deck.top.flipped) {
      this.card.classList.add('flipped');
    } else {
      this.card.classList.remove('flipped');
    }
    this.backText.innerText = this._deck.top.back;
    this.resizeText(this.backText);
  }

  resizeText (element) {
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
  }

  showQRCode () {
    qrCode.classList.remove('invisible');
  }

  hideQRCode () {
    qrCode.classList.add('invisible');
  }

  handleKeyDown (e) {
    if (e.keyCode == Keys.SPACE) {
      document.querySelector('.key.space').classList.add('pressed');
      this._deck.top.flip();
      this.render();
    } else if (e.keyCode == Keys.ENTER) {
      this.showQRCode();
    } else if (e.keyCode == Keys.LEFT) {
      document.querySelector('.key.left').classList.add('pressed');
      this.previous();
    } else if (e.keyCode == Keys.RIGHT) {
      document.querySelector('.key.right').classList.add('pressed');
      this.next();
    }
  }

  handleKeyUp (e) {
    if (e.keyCode == Keys.ENTER) {
      this.hideQRCode();
    } else if (e.keyCode == Keys.SPACE) {
      document.querySelector('.key.space').classList.remove('pressed');
    } else if (e.keyCode == Keys.LEFT) {
      document.querySelector('.key.left').classList.remove('pressed');
    } else if (e.keyCode == Keys.RIGHT) {
      document.querySelector('.key.right').classList.remove('pressed');
    }
  }

  handleDrop (e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();

      reader.onload = function (file) {
        if (file.target.result) {
          // Parse the results and then move them to an object
          this._deck = new Deck(file.target.result);
          this.render();
        }
      }.bind(this);

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
    drop.classList.add('invisible');
    instructions.classList.add('invisible');
  }

  handleDragOver (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.

    drop.classList.remove('invisible');
  }

  handleDragLeave (e) {
    drop.classList.add('invisible');
  }

  start () {
    // Render the first card
    this.render();
  }
};
