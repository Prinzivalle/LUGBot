'use strict';

module.exports = function (commands) {

  commands.on('/isalive', (msg, telegramBot) => {
    telegramBot.sendMessage(msg.chat.id, "I'm alive");
  });

  commands.on('/ricevimento', (msg, telegramBot) => {
    telegramBot.sendMessage(msg.chat.id, "Non conosco ancora gli orari dei ricevimenti dei professori. Ma li sto studiando!");
  });

  commands.on('/cometichiami', (msg, telegramBot)=> {
    telegramBot.sendMessage(msg.chat.id, 'Mi chiamo LUG Roma Tre Bot!')
  });

  const infoMessage = `Questo bot è un progetto del <a href="https://www.facebook.com/LUGRoma3/">LUG Roma Tre</a>.\n\n<b>AUTORI</b>\n&#8226; Christian Micocci\n&#8226; Lorenzo Pizzari\n\n<b>RINGRAZIAMENTI</b>\nI dati in tempo reale sull'<i>Aula Campus</i> (Ingegneria) sono forniti dall'applicativo ospitato dal <a href="http://muglab.uniroma3.it/">MUG Roma Tre</a> e creato da:\n&#8226; Lorenzo Ariemma\n&#8226; Gaetano Bonofiglio\n\n<b>LICENZA</b>\nQuesto bot è coperto da licenza <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.html">GPLv2</a>.\nPuoi trovare il codice sorgente su <a href="https://github.com/LUGRomaTre/LUGBot">GitHub</a>.`;
  commands.on('/info', (msg, telegramBot)=> {
    telegramBot.sendMessage(msg.chat.id, infoMessage, {parse_mode: 'HTML'})
  });

  commands.on('/grazie', (msg, telegramBot)=> {
    telegramBot.sendMessage(msg.chat.id, 'Prego!')
  });

};
