/**
 * Blocks width (in px)
 * @type {number}
 */
exports.blockW = 38;

/**
 * Blocks height (in px)
 * @type {number}
 */
exports.blockH = 26;

/**
 * Space between blocks (in px)
 * @type {number}
 */
exports.space = 4;

/**
 * Font used for rendering the pc number
 * @type {string}
 */
exports.font = '16px "Roboto Black"';

/**
 * Color used for drawing free pc
 * @type {string}
 */
exports.freeColor = "#2E7D32";

/**
 * Color used for drawing busy pc
 * @type {string}
 */
exports.busyColor = "#C62828";

/**
 * Color used for drawing pc that ends with -B
 * @type {string}
 */
exports.bColor = "#283593";

/**
 * Color used for drawing pc "c"
 * @type {string}
 */
exports.cColor = "#757575";

/**
 *
 * @type {(number|string)[][]}
 */
exports.campusMatrix = [
  [0, 25, 0, 24, 17, 0, 0, 15, 13, 0, 12, 11, 10],
  [0, 26, 0, 23, 18, 0, 0, 16, 14, 0, 0, 0, 9],
  [0, 0, 0, 22, 19, 0, 0, 0, 0, 0, 0, 0, 8],
  [0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 7],
  [0, 0, 0, 0, 0, 0, 47, 48, 49, 50, 0, 0, 6],
  [0, 0, 0, 0, 0, 0, 46, 45, 44, 43, 0, 0, 5],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [27, 28, 0, 31, 32, 0, 42, 41, 40, 39, 0, 0, 3],
  ["29-B", "30-B", 0, 33, 34, 0, 35, 36, 37, 38, 0, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 54, 53, 52, 51, 0, 0, 0]
];

exports.arataMatrix = [
  [0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 4, "c", 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 7, 6, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 9, "c", 0, 0, "21-B", "c", 0, 0, 23, 31],
  [0, 0, 8, 0, 0, 0, 22, 0, 0, 0, 30],
  [0, 11, 10, 0, 0, 20, 19, 0, 24, 25, "c"],
  [0, 0, 15, 0, 0, 0, 18, 0, 0, 0, 29],
  [12, 13, 14, 0, 16, 17, "c", 0, 26, 27, 28]
];
