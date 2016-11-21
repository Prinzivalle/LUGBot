'use strict';

/**
 * This module ask a question to the user resolving a Promise when the user answers.
 * @module
 */

class Speaker {
  /**
   * @constructor
   */
  constructor() {
    this.questionsPending = {};
    this.questionNames = {};
  }

  /**
   * Adds a new question.
   *
   * @param questionName {string} the name of this
   * @param askF {function} function (telegramId, telegramBot, question) {}
   * @param responseF {function} function (msg, telegramBot, question) {return Promise.resolve(data)}
   */
  addQuestion(questionName, askF, responseF) {
    this.questionNames[questionName] = {
      askF: askF,
      responseF: responseF
    };
  }

  /**
   * Asks a question
   * @param questionName {string}
   * @param telegramId {number}
   * @param telegramBot {TelegramBot}
   * @returns {Promise}
   */
  ask(questionName, telegramId, telegramBot) {
    const that = this;
    if (typeof this.questionNames[questionName] === 'undefined') {
      throw new Error('Question not defined');
    }
    return new Promise(function (resolve, reject) {
      that.questionsPending[telegramId] = {
            telegramId: telegramId,
            questionName: questionName,
            resolve: function (data) {
              delete that.questionsPending[telegramId];
              resolve(data)
            },
            reject: function (err) {
              delete that.questionsPending[telegramId];
              reject(err)
            }
      };
      that.questionNames[questionName].askF(telegramId, telegramBot);
    });
  }

  handleResponse(msg, telegramBot) {
    const question = this.questionsPending[msg.from.id];
    if (typeof question === 'undefined') return false;
    const questionName = question.questionName;
    this.questionNames[questionName].responseF(msg, telegramBot).then(question.resolve).catch(question.reject);
    return true;
  }
}

const speaker = new Speaker();
speaker.Middleware = function (msg, telegramBot, next) {
    if (!speaker.handleResponse(msg, telegramBot)) {
        next();
    }
};
module.exports = speaker;
