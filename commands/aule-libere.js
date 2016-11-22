const moment = require('moment');
const orari = require('../modules/orari-roma3');
const dipartimenti = require('../modules/dipartimenti');
const User = require('../modules/user-manager').User;
const errors = require('../lib/errors');

/**
 *
 * @param {Message} msg
 * @param {TelegramBot} telegramBot
 */
exports.auleLibereCommand = function auleLibereCommand(msg, telegramBot) {
  const sendMessageOptions = {
    reply_markup: JSON.stringify({remove_keyboard: true}),
    parse_mode: 'HTML'
  };
  const user = new User(msg.from.id, telegramBot);
  user.getDipartimento()
    .then(getAuleLibereFromDipartimentoId)
    .then(getAuleLibereMessage)
    .then(sendMessage)
    .catch(errorHandler);

  function sendMessage(message) {
    return telegramBot.sendMessage(msg.chat.id, message, sendMessageOptions);
  }

  function errorHandler(err) {
    if (err instanceof errors.InputValidationError) {
      telegramBot.sendMessage(msg.chat.id, err.message, sendMessageOptions);
    }
    else {
      errors.handleGenericError(err, msg, telegramBot);
    }
  }
};

/**
 *
 * @param dipartimentoId
 * @return {Promise.<AulaLibera[]>}
 */
function getAuleLibereFromDipartimentoId(dipartimentoId) {
  return orari.getAuleLibere(dipartimenti[dipartimentoId]);
}

/**
 *
 * @param {AulaLibera[]} auleLibere
 * @return {string}
 */
function getAuleLibereMessage(auleLibere) {
  if (auleLibere.length == 0) {
    return 'Scusa ma non sono riuscito a trovare aule libere nel tuo dipartimento.\n' +
      'Potrebbero non esserci aule libere in questo momento, oppure un problema sui server di Ateneo';
  }

  let message = `Lista delle aule dove non c'è lezione:`;
  for (let aula of auleLibere) {
    message += `\n &#8226; <b>${aula.aula}</b> `;
    if (aula.date.getDate() == new Date().getDate()) {
      message += `fino alle ${moment(aula.date).format('HH:mm')}`;
    }
    else {
      message += 'fino alla chiusura';
    }
  }
  return message;
}
