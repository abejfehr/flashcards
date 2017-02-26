import Card from './Card.js';

// How many next/previous cards' order should be maintained
const SHUFFLE_BUFFER = 3;

export default class Deck {
  constructor (data) {
    // Keep two stacks for this data structure
    this._cards = [];

    // Parse the given data into a deck
    this._parseData(data);
  };

  _parseData (data) {
    // Separate the cards by the dashes
    var lines = data.split(/\n+\-{3,}\n+/g);
    for (let i = 0; i < lines.length; i += 2) {
      var front = lines[i];
      var back = i + 1 < lines.length ? lines[i + 1] : '';
      this._cards.push(new Card(front, back));
    }

    // Shuffle the deck
    this._shuffle(this._cards);
  }

  _shuffle (list) {
    for (let i = list.length; i; --i) {
      let j = ~~(Math.random() * i);
      [list[i - 1], list[j]] = [list[j], list[i - 1]];
    }
  }

  /**
   * Shuffles the inside of the deck. This way the user's immediate previous and
   * next cards are still familiar, but the deck does get randomized in some way
   */
  _shuffleMiddle () {
    // Only do this if the deck is big enough, otherwise don't worry about it
    var shufflableCards = this._cards.length - 2 * SHUFFLE_BUFFER;
    if (shufflableCards < 2) { return; }

    // Grab two arbitrary cards from the middle of the deck and swap them
    var i = ~~(Math.random() * shufflableCards) + SHUFFLE_BUFFER;
    var j = ~~(Math.random() * shufflableCards) + SHUFFLE_BUFFER;
    [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
  }

  previous () {
    if (this.top.flipped) {
      this.top.flip()
    }
    this._cards.unshift(this._cards.pop());

    this._shuffleMiddle();
  }

  next () {
    if (this.top.flipped) {
      this.top.flip()
    }
    this._cards.push(this._cards.shift());

    this._shuffleMiddle();
  }

  get top () {
    return this._cards[0];
  }
};
