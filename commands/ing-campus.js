'use strict';

const http = require("http");
const errors = require('../lib/errors');

exports.postiLiberiCampusCommand = function postiLiberiCampusCommand(msg, telegramBot) {

  var req = http.request({
    hostname: 'muglab.uniroma3.it',
    path: '/campus/statoCampus.txt'
  }, (res) => {
    const parser = new StatoCampusParser();
    res.on('data', parser.parse.bind(parser));
    res.on('end', () => {
      telegramBot.sendMessage(msg.chat.id, `Posti aula "Campus One":` +
        `\nliberi: ${parser.free}` +
        `\noccupati: ${parser.busy}`);
    });
  });

  req.on('error', (e) => {
    errors.handleGenericError(e, msg, telegramBot);
  });

  req.end();
};

class StatoCampusParser {

  constructor() {
    this.free = 0;
    this.busy = 0;
    this.isFinished = false;
  }

  /**
   * Parse data chunk from the http response
   * @param {string} chunk
   * @return {boolean} isFinished
   */
  parse(chunk) {
    if (this.isFinished) return true;
    for (let i = 0; i < chunk.length; i++) {
      const c = chunk[i];
      if (c == 48) this.busy++;
      else if (c == 49) this.free++;
      else return this.isFinished = true;
    }
    return false;
  }
}
