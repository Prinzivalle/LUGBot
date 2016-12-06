'use strict';

const telegramBot = require('../../modules/telegram-bot');
const User = require('../../modules/user-manager').User;
const commands = require('./menu');

const settingsInlineKeyboard = [];
for (const c of Object.values(commands)) {
  settingsInlineKeyboard.push([{text: c.name, callback_data: '' + c.menuId}]);
}

class SettingsEngine {
  static command(msg, telegramBot) {
    telegramBot.sendMessage(msg.chat.id, "Impostazioni", {reply_markup: JSON.stringify({inline_keyboard: settingsInlineKeyboard})});
  }

  static goToMainMenu(query) {
    telegramBot.editMessageText('Impostazioni', {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      reply_markup: JSON.stringify({inline_keyboard: settingsInlineKeyboard}),
    });
  }

  static handleError(query, e) {
    console.error(e.stack);
    telegramBot.editMessageText('Si è verificato un errore, verrà risolto al più presto', {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id
    });
  }

  static onCallbackQuery(query) {
    const data = query.data;
    if (!data) return;

    const args = data.split('\t');
    const menuId = args.shift();

    const command = commands[menuId];
    const user = new User(query.from.id, telegramBot);

    if (args.length == 0) {
      telegramBot.editMessageText(command.questionText, {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: JSON.stringify({inline_keyboard: command.inlineKeyboard}),
      });
      telegramBot.answerCallbackQuery(query.id, '', false);
    } else {
      command.onCallback(user, ...args).then(result => {
        telegramBot.answerCallbackQuery(query.id, result.notificationText, result.showAlert);
        if (result.completed) SettingsEngine.goToMainMenu(query);
      }).catch(e => {
        SettingsEngine.handleError(query, e);
      });
    }
  }

}

telegramBot.on('callback_query', function (query) {
  SettingsEngine.onCallbackQuery(query);
});

exports.settingsCommand = SettingsEngine.command;
