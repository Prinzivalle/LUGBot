'use strict';

const http = require("http");
const errors = require('../lib/errors');
const moment = require('moment');


class CampusConditionParser {

  constructor() {
    this.free = 0;
    this.busy = 0;
    this.data = "";
    this.lastUpdatedDate = null;
  }

  /**
   * Parse data chunk from the http response
   * @param {string} chunk
   * @return {boolean} isFinished
   */
  parse(chunk) {
    this.data += chunk;
  }

  end() {
    const data = this.data.toString().split('\n');
    const seatsData = data[0];
    this.lastUpdatedDate = new Date(data[1]);
    for (let i = 0; i < seatsData.length; i++) {
      const c = seatsData[i];
      if (c == '0') this.busy++;
      else if (c == '1') this.free++;
    }
  }
}


class CampusCondition {

  constructor() {
    this.free = 0;
    this.busy = 0;
    this.lastUpdatedDate = null;
    this.requestDate = 0;
  }

  get total() {
    return this.free + this.busy;
  }

  /**
   *
   * @return {Promise.<CampusCondition>}
   */
  getCondition() {
    if ((Date.now() - this.requestDate) < 60000) {
      return Promise.resolve(this);
    }
    return this.update().then(() => this);
  }

  /**
   * @private
   * @return {Promise}
   */
  update() {
    return new Promise(function (resolve, reject) {
      const req = http.request({
        hostname: 'muglab.uniroma3.it',
        path: '/campus/statoCampus.txt'
      }, (res) => {
        const parser = new CampusConditionParser();
        res.on('data', parser.parse.bind(parser));
        res.on('end', () => {
          parser.end();
          this.free = parser.free;
          this.busy = parser.busy;
          this.lastUpdatedDate = parser.lastUpdatedDate;
          this.requestDate = Date.now();
          resolve();
        });
      });

      req.on('error', reject);

      req.end();
    }.bind(this));
  }

}


const campusCondition = new CampusCondition();
exports.postiLiberiCampusCommand = function postiLiberiCampusCommand(msg, telegramBot) {

  campusCondition.getCondition()
    .then(condition => {
      telegramBot.sendMessage(msg.chat.id,
        `Posti liberi Aula Campus: <b>${condition.free}</b>/${condition.total}.` +
        `\n\nAggiornato ${moment(condition.lastUpdatedDate).fromNow()}.`,
        {parse_mode: 'HTML'}
      );
    })
    .catch(e => {
      errors.handleGenericError(e, msg, telegramBot);
    });
};
