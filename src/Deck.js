import Card from './Card.js';

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
      let j = Math.floor(Math.random() * i);
      [list[i - 1], list[j]] = [list[j], list[i - 1]];
    }
  }

  previous () {
    if (this.top.flipped) {
      this.top.flip()
    }
    this._cards.unshift(this._cards.pop());
  }

  next () {
    if (this.top.flipped) {
      this.top.flip()
    }
    this._cards.push(this._cards.shift());
  }

  get top () {
    return this._cards[0];
  }
};
