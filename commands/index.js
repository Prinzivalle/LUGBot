'use strict';

const moment = require('moment');
const commands = require('../modules/command-manager');
const orari = require('../modules/orari-roma3');
const dipartimenti = require('../modules/dipartimenti');
const User = require('../modules/user-manager').User;
const errors = require('../lib/errors');

const startCommand = require('./start-help').startCommand;
const helpCommand = require('./start-help').helpCommand;
const auleLibereCommand = require('./aule-libere').auleLibereCommand;
const postiLiberiCampusCommand = require('./ing-campus').postiLiberiCampusCommand;

commands.on('/start', startCommand);
commands.on('/help', helpCommand);
commands.on('/aulelibere', auleLibereCommand);
commands.on('/campus', postiLiberiCampusCommand);

commands.on('/lezioni', (msg, telegramBot)=> {
  telegramBot.sendMessage(msg.chat.id, 'Mi dispiace, ma gli scansafatiche del LUG Roma Tre ancora non mi hanno' +
    ' insegnato come scrivere le lezioni odierne!')
});

commands.on('/dimenticami', (msg, telegramBot)=> {
  const user = new User(msg.from.id, telegramBot);
  user.forget().then(function () {
    telegramBot.sendMessage(msg.chat.id, 'Ooh che mal di testa... Non mi ricordo più chi sei!')
  }).catch(function (err) {
    errors.handleGenericError(err, msg, telegramBot);
  });
});

commands.on('/cometichiami', (msg, telegramBot)=> {
  telegramBot.sendMessage(msg.chat.id, 'Mi chiamo LUG Roma Tre Bot!')
});

commands.on('/info', (msg, telegramBot)=> {
  telegramBot.sendMessage(msg.chat.id,
    'Questo bot è un progetto del <a href="https://www.facebook.com/LUGRoma3/">LUG Roma Tre</a>.\n\n<b>AUTORI</b>\n&#8226; Christian Micocci\n&#8226; Lorenzo Pizzari\n\n<b>RINGRAZIAMENTI</b>\nI dati in tempo reale sull\'<i>Aula Campus</i> (Ingegneria) sono forniti dall\'applicativo ospitato dal <a href="http://muglab.uniroma3.it/">MUG Roma Tre</a> e creato da:\n&#8226; Lorenzo Ariemma\n&#8226; Gaetano Bonofiglio.\n\n<b>LICENZA</b>\nQuesto bot è coperto da licenza <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.html">GPLv2</a>.\nPuoi trovare il codice sorgente su <a href="https://github.com/LUGRomaTre/LUGBot">GitHub</a>.',
    {parse_mode: 'HTML'})
});

commands.on('/grazie', (msg, telegramBot)=> {
  telegramBot.sendMessage(msg.chat.id, 'Prego!')
});

// TODO Access this command only in debug mode
//commands.on('/debug', function (msg, telegramBot) {
//});

commands.on('/default', (msg, telegramBot)=> {
  let message = '';
  const rand = Math.floor(Math.random() * 5);
  switch (rand) {
    case 0:
      message = 'Mi dispiace ma non ho capito!';
      break;
    case 1:
      message = 'Hey, non sono mica così intelligente!';
      break;
    case 2:
      message = 'Ma tu non hai fame?';
      break;
    case 3:
      message = "\"Software is like sex: it's better when it's free.\" - Linus Torvalds";
      break;
    case 4:
      message = "Scusami... Ma non so proprio cosa dirti!";
      break;
  }
  message += '\n\nDigita /help per la lista dei comandi disponibili!';
  telegramBot.sendMessage(msg.chat.id, message);
});
