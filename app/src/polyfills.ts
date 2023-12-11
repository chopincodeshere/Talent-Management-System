/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/** IE9, IE10, IE11, and older browsers require the following polyfills. **/

// Support for 'classlist' on IE9, IE10, and IE11
import 'classlist.js';

// Support for 'web-animations' on IE9, IE10, and IE11
import 'web-animations-js';

/** Evergreen browsers require these. **/

// Support for 'core-js' (core features of ECMAScript)
import 'core-js';

// Support for 'zone.js' (manages async operations in the browser)
import 'zone.js/dist/zone';

/***************************************************************************************************
 * APPLICATION IMPORTS
 */

// Add your application-specific polyfills below this line.

// Polyfills for Firefox
import 'zone.js/dist/zone-patch-fetch'; // Support for fetch API in Firefox

// Polyfills for Google Chrome
import 'zone.js/dist/zone-patch-canvas'; // Support for HTMLCanvasElement.toBlob() in Chrome

// Polyfills for Microsoft Bing (Edge)
import 'zone.js/dist/zone-patch-webapis'; // Support for browser APIs in Edge

// Polyfills for Safari
import 'zone.js/dist/zone-patch-media-query'; // Support for MediaQueryList in Safari
import 'zone.js/dist/zone-patch-resize-observer'; // Support for ResizeObserver in Safari
