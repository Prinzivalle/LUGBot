'use strict';

const moment = require('moment');
const orariRoma3 = require('../modules/orari-roma3');
const User = require('../modules/user-manager').User;
const emoji = require('node-emoji');
const errors = require('../lib/errors');
const speaker = require('../modules/speaker');
const co = require('co');

const disappointedMessage = "Mi dispiace, non ho trovato nulla! " + emoji.get('disappointed');

exports.orariCorsoCommand = function lezioneCommand(msg, telegramBot) {

  co(function*() {
    const user = new User(msg.from.id, telegramBot);
    const query = yield getQuery();
    const dipartimentoId = yield user.getDipartimento();
    const data = yield queryEventsFromQuery(dipartimentoId, query);
    const data2 = yield queryEventsFromName(data);
    const message = createMessage(data2);
    sendMessage(message);
  }.bind(this)).catch(err => errors.handleGenericError(err, msg, telegramBot));

  /**
   *
   * @return {Promise.<string>}
   */
  function getQuery() {
    const spaceIndex = msg.text.indexOf(' ');
    if (spaceIndex == -1) {
      return speaker.ask('oraricorso-query', msg.from.id, telegramBot)
        .then(msg => {
          return msg.text.replace('-', ' ');
        });
    }
    return Promise.resolve(msg.text.substr(spaceIndex + 1).replace('-', ' '));
  }

  /**
   *
   * @param dipartimentoId
   * @param query
   * @return {Promise.<Cursor>}
   */
  function queryEventsFromQuery(dipartimentoId, query) {
    return orariRoma3.getEventsFromName(dipartimentoId, query)
      .sort({score: {$meta: "textScore"}, denominazione: 1, dateInizio: 1})
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

  /**
   *
   * @param data
   * @return {Promise}
   */
  function queryEventsFromName(data) {
    if (data.length == 0) return Promise.resolve(null);

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
      return Promise.resolve({
        denominazione: events[0].denominazione,
        docente: events[0].docente,
        dates: data
      });
    }

    return speaker.ask('oraricorso-selection', msg.from.id, telegramBot, events)
      .then(msg => {
        const split = msg.text.split(' \u2014 ');
        const denominazione = split[0];
        const docente = split[1];
        const data2 = data.filter(item => item.denominazione === denominazione && item.docente === docente);
        return queryEventsFromName(data2);
      });
  }

  /**
   *
   * @param data
   * @return {string}
   */
  function createMessage(data) {
    if (!data) return disappointedMessage;

    let message = `<b>${data.denominazione}</b> &#8212 <i>${data.docente}</i>`;
    data.dates.forEach(item => {
      const timeString = moment(item.dateInizio).format('ddd DD, LT - ') + moment(item.dateFine).format('LT');
      message += `\n &#8226; ${timeString} (${item.aula})`;
    });
    return message;
  }

  /**
   *
   * @param message
   * @return {Promise}
   */
  function sendMessage(message) {
    const sendMessageOptions = {
      reply_markup: JSON.stringify({remove_keyboard: true}),
      parse_mode: 'HTML'
    };
    return telegramBot.sendMessage(msg.chat.id, message, sendMessageOptions);
  }

};

function askQuery(telegramId, telegramBot, events) {
  telegramBot.sendMessage(telegramId, "Di quale corso vuoi sapere gli orari?", {
    reply_markup: JSON.stringify({remove_keyboard: true}),
  });
}

function responseQuery(msg, telegramBot, events) {
  return Promise.resolve(msg);
}

function askSelection(telegramId, telegramBot, events) {
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

function responseSelection(msg, telegramBot, events) {
  return Promise.resolve(msg);
}

speaker.addQuestion('oraricorso-query', askQuery, responseQuery);
speaker.addQuestion('oraricorso-selection', askSelection, responseSelection);
