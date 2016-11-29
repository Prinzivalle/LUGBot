'use strict';

class CommandManager {
  /**
   * CommandManager take a message, do an action and call a callback for response
   * @constructor
   */
  constructor() {
    this.commands = {};
    this.middlewares = [];
  }

  /**
   * Call a cb when the message was received
   * @param message The message that triggers the callback
   * @param cb The callback triggered by the message
   */
  on(message, cb) {
    this.commands[message] = cb;
  }

  /**
   * Add a middleware
   * @param middleware
   */
  use(middleware) {
    this.middlewares.push(middleware);
  }

  /**
   * Handle the msg.
   * @param msg
   * @param telegramBot An instance of Telegram Bot
   */
  handleMessage(msg, telegramBot) {
    let text = msg.text;
    if (text.charAt(0) == '/') {
      text = text.split('@')[0].split(' ')[0];
      const cb = this.commands[text];
      if (cb) return cb(msg, telegramBot);
    }

    const middleware = this.middlewares[0];
    middleware(msg, telegramBot, this.getNext(msg, telegramBot, 0));
  }

  /**
   * Get the next function
   * @param msg
   * @param telegramBot
   * @param index
   * @returns {function(this:CommandManager)}
   */
  getNext(msg, telegramBot, index) {
    return function () {
      this.middlewares[index + 1](msg, telegramBot, this.getNext(msg, telegramBot, index + 1));
    }.bind(this);
  }
}


module.exports = new CommandManager();
