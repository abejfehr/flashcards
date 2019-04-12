import {markdown} from 'markdown';

export default class Card {
  constructor (front, back) {
    // The front and back text of the card
    this._front = markdown.toHTML(front);
    this._back  = markdown.toHTML(back);

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
}
