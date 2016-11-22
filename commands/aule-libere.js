const moment = require('moment');
const orari = require('../modules/orari-roma3');
const dipartimenti = require('../modules/dipartimenti');
const User = require('../modules/user-manager').User;
const errors = require('../lib/errors');

exports.auleLibereCommand = function auleLibereCommand(msg, telegramBot) {
  const hideKeyboardOpts = {reply_markup: JSON.stringify({remove_keyboard: true})};
  const user = new User(msg.from.id, telegramBot);
  user.getDipartimento()
    .then(getAuleLibereFromDipartimentoId)
    .then(getAuleLibereMessage)
    .then(sendMessage)
    .catch(errorHandler);

  function sendMessage(message) {
    return telegramBot.sendMessage(msg.chat.id, message, hideKeyboardOpts);
  }

  function errorHandler(err) {
    if (err instanceof errors.InputValidationError) {
      telegramBot.sendMessage(msg.chat.id, err.message, hideKeyboardOpts);
    }
    else {
      errors.handleGenericError(err, msg, telegramBot);
    }
  }
};

function getAuleLibereFromDipartimentoId(dipartimentoId) {
  return orari.getAuleLibere(dipartimenti[dipartimentoId]);
}

function getAuleLibereMessage(aule) {
  let message = '';
  if (aule.length == 0) {
    return message = 'Scusa ma non sono riuscito a trovare aule libere nel tuo dipartimento.\n' +
      'Potrebbero non esserci aule libere in questo momento, oppure un problema sui server di Ateneo';
  }
  message = `Lista delle aule dove non c'è lezione:`;
  aule.forEach(function (item) {
    message += `\n - ${item.aula}`;
    if (item.date.getDate() == new Date().getDate()) {
      message += ` fino alle ${moment(item.date).format('HH:mm')}`;
    }
    else {
      message += ' fino alla chiusura';
    }
  });
  return message;
}
