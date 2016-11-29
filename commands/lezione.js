'use strict';

const moment = require('moment');
const orariRoma3 = require('../modules/orari-roma3');
const User = require('../modules/user-manager').User;
const emoji = require('node-emoji');
const errors = require('../lib/errors');

const disappointedMessage = "Mi dispiace, non ho trovato nulla! " + emoji.get('disappointed');
const helpMessage = "uso comando: /lezione &lt;query di ricerca&gt;";

exports.lezioneCommand = function lezioneCommand(msg, telegramBot) {
  const spaceIndex = msg.text.indexOf(' ');
  if (spaceIndex == -1) return sendMessage(helpMessage);

  const query = msg.text.substr(spaceIndex + 1);
  const user = new User(msg.from.id, telegramBot);

  user.getDipartimento()
    .then(queryEvents)
    .then(createMessage)
    .then(sendMessage)
    .catch(err => errors.handleGenericError(err, msg, telegramBot));

  function queryEvents(dipartimentoId) {
    return orariRoma3.getEventsFromName(dipartimentoId, query)
      .sort({score: {$meta: "textScore"}, dateInizio: 1})
      .limit(10)
      .toArray()
      .then(data => {
        let max = -1;
        return data.filter(item => {
          if (max == -1) {
            max = item.score;
            return true;
          }
          return item.score > (max - 0.5);
        });
      });
  }

  function createMessage(data) {
    let count = 0;

    let message = "";
    data.forEach(item => {
      count += 1;
      const timeString = moment(item.dateInizio).format('ddd DD, LT-') + moment(item.dateFine).format('LT');
      message += `\n\n<b>${timeString} (${item.aula})</b>:\n${item.denominazione} &#8212 <i>${item.docente}</i>`;
    });

    if (count == 0) message = disappointedMessage;
    return message;
  }

  function sendMessage(message) {
    const sendMessageOptions = {
      reply_markup: JSON.stringify({remove_keyboard: true}),
      parse_mode: 'HTML'
    };
    telegramBot.sendMessage(msg.chat.id, message, sendMessageOptions);
  }

};
