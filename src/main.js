/**
 * Purpose: The main entry point of the game
 * Source:  main.js
 */

/* jshint esversion: 6 */

import './css/main.scss';

import Flashcards from './Flashcards'

var app = new Flashcards();

document.addEventListener('DOMContentLoaded', function () {
  app.start();
});
