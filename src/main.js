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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceworker.js').catch(function(err) {
    console.error('ServiceWorker registration failed: ', err);
  });
}
