'use strict';

const config = require('../../etc/config');
const token = config.telegramToken;
const logger = require('./logger');
const TelegramBot = require('node-telegram-bot-api');

class MyTelegramBot extends TelegramBot {

  attachCommandManager(commandManager) {
    this.on('message', function (msg) {
      logger.log(msg.chat.id, msg.text, false); // Log message
      commandManager.handleMessage(msg, telegramBot)
    });
    this.on('error', function eventEmitterCallback(err) {
      console.error(err.stack);
    });
  };

  sendMessage(chatId, message, options) {
    logger.log(chatId, message, true);
    super.sendMessage(chatId, message, options);
  };

}

/**
 * @type {MyTelegramBot}
 */
var telegramBot = new MyTelegramBot(token, {
  webHook: config['webHook'],
  polling: config['polling']
});

if (config.webHook) {
  telegramBot.setWebHook(config.webHook.url || 'https://' + config.webHook.domain + ':' + config.webHook.port + '/bot' + config.telegramToken, config.webHook.cert);
} else {
  telegramBot.setWebHook('');
}

module.exports = telegramBot;
