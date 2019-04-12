// The amount of pixels the input's contents is allowed to exceed its size
const SAFE_ZONE  = 5;

// The most efficient way to increase the font sizes is by powers of 2
const sizes = [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];

export default class TextFitter {

  static watch (element) {
    // Refit the text when a) the element's contents change or b) when the window gets resized
    window.addEventListener('resize', TextFitter._refit.bind(this, element));
    (new MutationObserver(TextFitter._refit.bind(this, element))).observe(element, {
      childList: true,
    });
  }

  static _refit (element) {
    // Store the font size to use. We'll start with 1.
    var fontSize = 1;

    // And if the user hasn't entered anything, just don't bother
    if (!element.innerText) { return; }

    // Now go through each power of 2 and try adding it to the size
    for (let i = 0; i < sizes.length; ++i) {
      fontSize += sizes[i];
      element.style.fontSize = (fontSize) + 'px';

      // If it's too big, we'll just go back
      if (element.scrollWidth > element.clientWidth + SAFE_ZONE ||
          element.scrollHeight > element.clientHeight + SAFE_ZONE) {
        fontSize -= sizes[i];
        element.style.fontSize = (fontSize) + 'px';
      }
    }
  }
}
