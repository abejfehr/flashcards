import QRCode from 'qrcode-js';
import GIF from 'gif.js';
import LZString from 'lz-string';

export default class AQRCode {
  create (data) {

    // Compress the data
    data = LZString.compress(data);

    return new Promise(function (resolve, reject) {
      // Returns a GIF of an animated QR code that can be shared with friends to share the cards
      var frames = [];

      const BLOCK_SIZE = 50;

      // How many blocks will be sent
      var n = Math.ceil(data.length / BLOCK_SIZE);

      for (let i = 0; i < n; ++i) {
        var block = (i < 9 ? '0' : '') + (i + 1) + data.slice(i * BLOCK_SIZE, (i + 1) * BLOCK_SIZE);
        frames.push(block);
      }

      frames = frames.map(this.makeQRCode);

      // Make the GIF that the frames will go into
      var gif = new GIF({
        workerScript: 'gif.worker.js',
        workers: 1,
        quality: 10,
        width: 164,
        height: 164,
      });

      frames = frames.map(this.convertImageToGIF.bind(this, gif));

      // Do something with the result of all of the promises
      Promise.all(frames).then(function () {
        gif.on('finished', function(blob) {
          var reader = new window.FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function() {
            var base64data = reader.result;
            // Holy fuck, this actually works.

            // ...I'm not sure what to do now to be honest.
            resolve(base64data);
          };
        });
        gif.render();
      });
    }.bind(this));
  }

  makeQRCode (data) {
    return QRCode.toDataURL(data, 4);
  }

  convertImageToGIF (gif, data) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = function() {
        gif.addFrame(image, { delay: 150 });
        resolve();
      };
      image.src = data;
    });
  }
};

//https://jsfiddle.net/gvtrvta1/
