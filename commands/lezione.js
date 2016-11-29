'use strict';

const moment = require('moment');
const orariRoma3 = require('../modules/orari-roma3');
const User = require('../modules/user-manager').User;

exports.lezioneCommand = function lezioneCommand(msg, telegramBot) {
  const query = msg.text.substr(msg.text.indexOf(' ') + 1);
  const user = new User(msg.from.id, telegramBot);

  user.getDipartimento()
    .then(queryEvents)
    .then(createMessage)
    .then(sendMessage);

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
    if (count == 0) message = "Non ho trovato nulla :(";
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
