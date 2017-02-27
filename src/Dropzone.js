export default class Dropzone {
  constructor () {
    this._callback = null;

    // Make the element
    this._element = document.createElement('div');
    this._element.id = 'drop';
    this._element.className = 'overlay invisible';
    this._element.innerHTML = `
    <div>
      That's it! Just let go of the mouse button and you'll be 10% smarter.
    </div>`;
    document.body.appendChild(this._element);

    // Bind to the drag/drop events
    document.addEventListener('dragover', this._handleDragOver.bind(this));
    document.addEventListener('dragleave', this._handleDragLeave.bind(this));
    document.addEventListener('drop', this._handleDrop.bind(this));
    document.addEventListener('paste', this._handlePaste.bind(this));
  }

  onDrop (callback) {
    // Call the callback when shit goes down
    this._callback = callback;
  }

  _handlePaste (e) {
    this._callback(e.clipboardData.getData('text'));
  }

  _handleDrop (e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();

      reader.onload = function (file) {
        if (file.target.result) {
          this._callback(file.target.result);
        } else {
          // TODO: Notify that the file is empty somehow
        }
      }.bind(this);

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
    this._element.classList.add('invisible');
  }

  _handleDragOver (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.

    this._element.classList.remove('invisible');
  }

  _handleDragLeave (e) {
    this._element.classList.add('invisible');
  }


};
