'use strict';

const http = require("http");
const errors = require('../lib/errors');
const moment = require('moment');
const CampusCondition = require('../modules/ing-campus/campus-condition');
const MapSettings = require('../etc/ing-campus-maps');

const campusCondition = new CampusCondition('/campus/statoCampus.txt', MapSettings.campusMatrix, 1);
const arataCondition = new CampusCondition('/campus/statoArata.txt', MapSettings.arataMatrix, 2);

exports.postiLiberiCampusCommand = function postiLiberiCampusCommand(msg, telegramBot) {

  arataCondition.getCondition()
    .then(campusCondition.getCondition.bind(campusCondition))
    .then(() => {
      telegramBot.sendMessage(msg.chat.id,
        `Posti liberi Aula Campus: <b>${campusCondition.free}</b>/${campusCondition.total},` +
        `\n<i>aggiornato ${moment(campusCondition.lastUpdatedDate).fromNow()}</i>.` +
        `\n\nPosti liberi Aula Arata: <b>${arataCondition.free}</b>/${arataCondition.total},` +
        `\n<i>aggiornato ${moment(arataCondition.lastUpdatedDate).fromNow()}</i>.`,
        {parse_mode: 'HTML'}
      );
    })
    .catch(e => {
      errors.handleGenericError(e, msg, telegramBot);
    });
};

exports.mappaCampusCommand = function mappaCampusCommand(conditionString) {
  const condition = {
    'campus': campusCondition,
    'arata': arataCondition,
  }[conditionString];

  return function (msg, telegramBot) {
    let statusString;
    let shouldISave;

    condition.getCondition()
      .then(() => {
        statusString = condition.statusString;
        return condition.getTelegramPhoto(statusString)
      })
      .then(data => {
        shouldISave = typeof data != 'string';
        return telegramBot.sendPhoto(msg.chat.id, data);
      })
      .then(msg => {
        if (shouldISave) condition.saveTelegramPhoto(statusString, msg.photo[0].file_id);
      })
      .catch(e => {
        errors.handleGenericError(e, msg, telegramBot);
      });
  };
};

