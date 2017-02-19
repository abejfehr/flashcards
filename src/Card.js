export default class Card {
  constructor (front, back) {
    // The front and back text of the card
    this._front = front;
    this._back = back;

    // Whether this card is face up or not
    this._flipped = false;
  }

  flip () {
    this._flipped = !this._flipped;
  }

  get flipped () {
    return this._flipped;
  }

  get front () {
    return this._front;
  }

  get back () {
    return this._back;
  }
};
