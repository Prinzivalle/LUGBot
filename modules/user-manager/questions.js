'use strict';

const dipartimenti = require('../dipartimenti');
const speaker = require('../speaker');
const utils = require('../utils');
const InputValidationError = require('../../lib/errors').InputValidationError;

var askDipartimento = function (telegramId, telegramBot) {
  const nDipartimenti = dipartimenti.length - 1;
  const cols = 4;
  let message = "Di quale dipartimento fai parte?";
    for (var i = 1; i < dipartimenti.length; i++) {
        message += '\n' + i + ') ' + dipartimenti[i].name;
    }
    telegramBot.sendMessage(telegramId, message, {
        reply_markup: JSON.stringify({
            keyboard: utils.generateArrayOfArrayOfNumbers(1, nDipartimenti, Math.ceil(nDipartimenti / cols), cols),
            resize_keyboard: true,
            one_time_keyboard: true
        })
    });
};

var responseDipartimento = function (msg, telegramBot) {
  const dipartimentoUtente = parseInt(msg.text);
    if (dipartimentoUtente) {
      if (dipartimentoUtente > dipartimenti.length - 1 || dipartimentoUtente < 1) {
        return Promise.reject(new InputValidationError('Questo numero non è un dipartimento valido.'));
      } else {
        return Promise.resolve(dipartimentoUtente);
      }
    } else {
      return Promise.reject(new InputValidationError('Ho bisogno del numero del dipartimento per capire cosa intendi.'))
    }
};

speaker.addQuestion('dipartimento', askDipartimento, responseDipartimento);
