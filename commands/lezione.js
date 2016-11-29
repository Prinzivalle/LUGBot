'use strict';

const moment = require('moment');
const orariRoma3 = require('../modules/orari-roma3');
const User = require('../modules/user-manager').User;
const emoji = require('node-emoji');
const errors = require('../lib/errors');
const speaker = require('../modules/speaker');

const disappointedMessage = "Mi dispiace, non ho trovato nulla! " + emoji.get('disappointed');
const helpMessage = "uso comando: /lezione &lt;query di ricerca&gt;";

exports.lezioneCommand = function lezioneCommand(msg, telegramBot) {
  const spaceIndex = msg.text.indexOf(' ');
  if (spaceIndex == -1) return sendMessage(helpMessage);

  const query = msg.text.substr(spaceIndex + 1).replace('-', ' ');
  const user = new User(msg.from.id, telegramBot);

  user.getDipartimento()
    .then(queryEventsFromQuery)
    .then(queryEventsFromName)
    .then(createMessage)
    .then(sendMessage)
    .catch(err => errors.handleGenericError(err, msg, telegramBot));

  function queryEventsFromQuery(dipartimentoId) {
    return orariRoma3.getEventsFromName(dipartimentoId, query)
      .sort({score: {$meta: "textScore"}})
      .limit(12)
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

  function queryEventsFromName(data) {
    if (data.length == 0) return null;

    let denominazione = null;
    let docente = null;
    const events = [];
    data.forEach(item => {
      if (item.denominazione !== denominazione || item.docente !== docente) {
        denominazione = item.denominazione;
        docente = item.docente;
        events.push({denominazione, docente});
      }
    });
    if (events.length == 1) {
      return {
        denominazione: events[0].denominazione,
        docente: events[0].docente,
        dates: data
      };
    }

    return speaker.ask('lezione-selection', msg.from.id, telegramBot, events)
      .then(msg => {
        const split = msg.text.split(' \u2014 ');
        const denominazione = split[0];
        const docente = split[1];
        const data2 = data.filter(item => item.denominazione === denominazione && item.docente === docente);
        return queryEventsFromName(data2);
      });
  }

  function createMessage(data) {
    if (!data) return disappointedMessage;

    let message = `<b>${data.denominazione}</b> &#8212 <i>${data.docente}</i>`;
    data.dates.forEach(item => {
      const timeString = moment(item.dateInizio).format('ddd DD, LT - ') + moment(item.dateFine).format('LT');
      message += `\n &#8226; ${timeString} (${item.aula})`;
    });
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

function askF(telegramId, telegramBot, events) {
  const keyboard = [];
  for (let event of events) {
    keyboard.push([event.denominazione + " \u2014 " + event.docente]);
  }
  telegramBot.sendMessage(telegramId, "Quale intendi di preciso?", {
    reply_markup: JSON.stringify({
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true
    })
  });
}

function responseF(msg, telegramBot, events) {
  // if (events.indexOf(msg.text) == -1) return Promise.reject(new errors.InputValidationError(disappointedMessage));
  return Promise.resolve(msg);
}

speaker.addQuestion('lezione-selection', askF, responseF);
