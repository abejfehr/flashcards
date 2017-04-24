import Deck from './Deck';
import Keys from './Keys';
import TextFitter from './TextFitter';
import Dropzone from './Dropzone';

export default class Flashcards {
  constructor () {
    this._deck = null;

    this.instructions = document.getElementById('instructions');
    this.card         = document.getElementById('card');
    this.front        = this.card.querySelector('#front');
    this.back         = this.card.querySelector('#back');
    this.frontText    = this.card.querySelector('#front .contents');
    this.backText     = this.card.querySelector('#back .contents');

    // Bind all of the event listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Resize the cards' text areas
    TextFitter.watch(this.frontText);
    TextFitter.watch(this.backText);

    this.dropzone = new Dropzone();
    this.dropzone.onDrop(function (data) {
      // Parse the results and then move them to an object
      this._deck = new Deck(data);
      this.instructions.classList.add('invisible');
      this.render();
    }.bind(this));
  }

  previous () {
    // Move the current card away
    this.card.style.animation = 'none';
    setTimeout(function () {
      this.card.style.animation = '';
      this.card.classList.add('reversed', 'show');
      this.card.classList.remove('dispose');
    });

    setTimeout(function () {
      // Pick a new card
      this._deck.previous();

      // Render it to the screen
      this.render();

      // Reveal the card
      setTimeout(function () {
        this.card.classList.remove('show');
        this.card.classList.add('reversed', 'dispose');
      }.bind(this), 200);
    }.bind(this), 150);
  }

  next () {
    // Move the current card away
    this.card.style.animation = 'none';
    setTimeout(function () {
      this.card.classList.remove('reversed', 'show');
      this.card.style.animation = '';
      this.card.classList.add('dispose');
    });

    setTimeout(function () {
      // Pick a new card
      this._deck.next();

      // Render it to the screen
      this.render();

      // Reveal the card
      setTimeout(function () {
        this.card.classList.remove('dispose');
        this.card.classList.add('show');
      }.bind(this), 200);
    }.bind(this), 150);
  }

  render () {
    if (!this._deck) { return; }

    // If the card should be flipped, show it
    if (this._deck.top.flipped) {
      this.card.classList.add('flipped');
    } else {
      this.card.classList.remove('flipped');
    }

    // Put that card's text on the front/back of the actual card
    this.frontText.innerHTML = this._deck.top.front;
    this.backText.innerHTML  = this._deck.top.back;
  }

  handleKeyDown (e) {
    if (e.keyCode == Keys.SPACE) {
      document.querySelector('.key.space').classList.add('pressed');
      document.querySelector('.effect').innerText = 'flip card';
      if (this._deck) {
        this._deck.top.flip();
        this.render();
      }
    } else if (e.keyCode == Keys.LEFT) {
      document.querySelector('.key.left').classList.add('pressed');
      document.querySelector('.effect').innerText = 'previous card';
      if (this._deck) {
        this.previous();
      }
    } else if (e.keyCode == Keys.RIGHT) {
      document.querySelector('.key.right').classList.add('pressed');
      document.querySelector('.effect').innerText = 'next card';
      if (this._deck) {
        this.next();
      }
    }
  }

  handleKeyUp (e) {
    if (e.keyCode == Keys.SPACE) {
      document.querySelector('.key.space').classList.remove('pressed');
      if (document.querySelector('.effect').innerText == 'flip card') {
        document.querySelector('.effect').innerText = '';
      }
    } else if (e.keyCode == Keys.LEFT) {
      document.querySelector('.key.left').classList.remove('pressed');
      if (document.querySelector('.effect').innerText == 'previous card') {
        document.querySelector('.effect').innerText = '';
      }
    } else if (e.keyCode == Keys.RIGHT) {
      document.querySelector('.key.right').classList.remove('pressed');
      if (document.querySelector('.effect').innerText == 'next card') {
        document.querySelector('.effect').innerText = '';
      }
    }
  }

  start () {
    this.render();
  }
}
