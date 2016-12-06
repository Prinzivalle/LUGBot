'use strict';

module.exports = function keyboardGenerator(buttons) {
  const keyboard = [];
  let b = false;
  for (const button of buttons) {
    if (b) keyboard[keyboard.length - 1].push(button);
    else keyboard.push([button]);
    b = !b;
  }
  return keyboard;
};
