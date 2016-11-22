'use strict';

var usersCollection = require('../database').collections.users;
var speaker = require('../speaker');
var co = require('co');

class User {
  /**
   * Create or get a new User.
   * @param {number} telegramId
   * @param {TelegramBot} telegramBot
   * @constructor
   */
  constructor(telegramId, telegramBot) {
    this.telegramId = telegramId;
    this.telegramBot = telegramBot;
  }

  /**
   * Get the user dipartimento. If it's undefined ask the user for it.
   * @returns {Promise}
   */
  getDipartimento() {
    return co(function*() {
      const user = yield this.getUser();
      if (user.dipartimentoId) return user.dipartimentoId;

      const dipartimentoId = yield speaker.ask('dipartimento', this.telegramId, this.telegramBot);
      yield this.update({dipartimentoId: dipartimentoId});
      return dipartimentoId;
    }.bind(this));
  }

  update(update) {
    return usersCollection.updateOne({telegramId: this.telegramId}, {$set: update});
  }

  /**
   * Access to Database and return the User Object or create it
   *
   * @returns {Promise}
   */
  getUser() {
    const telegramId = this.telegramId;
    return usersCollection.find({telegramId: telegramId}).limit(1).next().then(function (user) {
      if (user == null) {
        return collection.insertOne({
          telegramId: telegramId
        });
      }
      return Promise.resolve(user);
    });
  }

  /**
   * Forget everything about this user
   *
   * @returns {Promise}
   */
  forget() {
    return usersCollection.removeOne({telegramId: this.telegramId});
  }
}


module.exports = User;
