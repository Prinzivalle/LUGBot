'use strict';

const debug = require('debug')('bot:genius');
const commands = require('../command-manager');
const {Wit, log} = require('node-wit');

const client = new Wit({accessToken: '4BRA2XGYZHRFJGDM4MFPP56X3VC3QRPX'});

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
