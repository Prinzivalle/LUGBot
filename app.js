'use strict';

const commandManager = require('./modules/command-manager');
const telegramBot = require('./modules/telegram-bot');
const genius = require('./modules/genius');
const speaker = require('./modules/speaker');

require('./scheduling');
require('./commands');
commandManager.use(speaker.Middleware);
commandManager.use(genius.Middleware);
commandManager.use(function (msg, telegramBot) {
    commandManager.commands['/default'](msg, telegramBot);
});

telegramBot.attachCommandManager(commandManager);
