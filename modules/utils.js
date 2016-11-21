'use strict';

/**
 * Generate an array of array of string of numbers
 * @param {number} from - First number to generate
 * @param {number} to - Last number to generate
 * @param {number} rows - Number of rows to generate
 * @param {number} cols - Number of columns to generate
 */
exports.generateArrayOfArrayOfNumbers = function generateArrayOfArrayOfNumbers(from, to, rows, cols) {
  const arr = [];
  let i = from;
  for (let row = 0; row < rows; row++) {
    const arr2 = [];
    arr.push(arr2);
    for (let col = 0; col < cols; col++) {
      arr2.push('' + i);
      if (i == to) return arr;
      i++;
    }
  }
};
