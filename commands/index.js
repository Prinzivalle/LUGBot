'use strict';

const moment = require('moment');
const commands = require('../modules/command-manager');
const orari = require('../modules/orari-roma3');
const dipartimenti = require('../modules/dipartimenti');
const errors = require('../lib/errors');

const startCommand = require('./start-help').startCommand;
const helpCommand = require('./start-help').helpCommand;
const auleLibereCommand = require('./aule-libere').auleLibereCommand;
const postiLiberiCampusCommand = require('./ing-campus').postiLiberiCampusCommand;
const mappaCampusCommand = require('./ing-campus').mappaCampusCommand;
const orariCorsoCommand = require('./orari-corso').orariCorsoCommand;
const settingsCommand = require('./settings').settingsCommand;

commands.on('/start', startCommand);
commands.on('/help', helpCommand);
commands.on('/aulelibere', auleLibereCommand);
commands.on('/laboratori', postiLiberiCampusCommand);
commands.on('/campus', postiLiberiCampusCommand);
commands.on('/mappacampus', mappaCampusCommand('campus'));
commands.on('/mappaarata', mappaCampusCommand('arata'));
commands.on('/lezione', orariCorsoCommand);
commands.on('/oraricorso', orariCorsoCommand);
commands.on('/settings', settingsCommand);

require('./extra')(commands);

const defaultMessages = [
  'Mi dispiace ma non ho capito!',
  'Hey, non sono mica così intelligente!',
  'Ma tu non hai fame?',
  `<i>"Software is like sex: it's better when it's free."</i> - Linus Torvalds`,
  "Scusami... Ma non so proprio cosa dirti!"
];
const defaultPostMessage = '\n\nDigita /help per la lista dei comandi disponibili!';
commands.on('/default', (msg, telegramBot)=> {
  const rand = parseInt(Math.random() * defaultMessages.length);
  const message = defaultMessages[rand] + defaultPostMessage;
  telegramBot.sendMessage(msg.chat.id, message, {parse_mode: 'HTML'});
});
