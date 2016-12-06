'use strict';

const emoji = require('node-emoji');
const User = require('../modules/user-manager').User;
const dipartimenti = require('../modules/dipartimenti');

const disappointedMessage = `Purtroppo non riesco ad aiutarti in nessun modo se sei in questo dipartimento. ${emoji.get('disappointed')}`;
const commandsHelps = {
  'aulelibere': 'Mostra le aule libere adesso',
  'oraricorso': 'Cerca gli orari di un corso',
  'laboratori': 'Controlla se ci sono posti liberi nei laboratori',
  'settings': 'Modifica le tue impostazioni personali',
  'help': 'Mostra la lista dei comandi disponibili',
  'info': 'Chi ha reso questo bot possibile',
};
const commandsAlwaysAvailable = ['settings', 'info', 'help'];

/**
 *
 * @param {Message} msg
 * @param {TelegramBot} telegramBot
 */
exports.startCommand = function startCommand(msg, telegramBot) {
  const user = new User(msg.from.id, telegramBot);
  user.getDipartimento().then(getHelpMessage).then(function (helpMessage) {
    telegramBot.sendMessage(
      msg.chat.id,
      `Ciao ${msg.from.first_name}! ${helpMessage}`,
      {reply_markup: JSON.stringify({remove_keyboard: true})}
    );
  });
};

/**
 *
 * @param {Message} msg
 * @param {TelegramBot} telegramBot
 */
exports.helpCommand = function startCommand(msg, telegramBot) {
  const user = new User(msg.from.id, telegramBot);
  user.getDipartimento().then(getHelpMessage).then(function (helpMessage) {
    telegramBot.sendMessage(msg.chat.id, helpMessage, {reply_markup: JSON.stringify({remove_keyboard: true})});
  });
};

/**
 *
 * @param {number} dipartimentoId
 * @return {string}
 */
function getHelpMessage(dipartimentoId) {
  const commandsAvailable = dipartimenti[dipartimentoId].commands;
  let helpMessage = "";

  if (commandsAvailable.length == 0) helpMessage = disappointedMessage;
  else helpMessage = "In cosa posso aiutarti?";

  for (let command of commandsAvailable.concat(commandsAlwaysAvailable)) {
    helpMessage += `\n/${command} - ${commandsHelps[command]}`;
  }

  return helpMessage;
}
