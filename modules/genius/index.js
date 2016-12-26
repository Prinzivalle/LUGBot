'use strict';

const debug = require('debug')('bot:genius');
const commands = require('../command-manager');
const {Wit, log} = require('node-wit');
const accessToken = require('../../etc/config').witAiToken;

if (!accessToken) {
  module.exports = {
    Middleware: function Middleware(msg, telegramBot, next) {
      return next();
    }
  };
  return;
}

const client = new Wit({accessToken: accessToken});

module.exports = {
  Middleware: function Middleware(msg, telegramBot, next) {
    client.message(msg.text, {})
      .then((data) => {
        const intent = data.entities['intent'][0];
        if (intent['confidence'] < 0.5) return next();
        return commands.commands['/' + intent['value']](msg, telegramBot, data.entities);
      })
      .catch(console.error);
  }
};
