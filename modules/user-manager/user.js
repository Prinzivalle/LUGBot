'use strict';

var database = require('../database').db;
var speaker = require('../speaker');
var co = require('co');

class User {
  /**
   * Create or get a new User.
   * @param telegramId
   * @param telegramBot
   * @constructor
   */
  constructor(telegramId, telegramBot) {
    this.telegramBot = telegramBot;
    this.telegramId = telegramId;
    this.collection = database.collection('users');
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
    return this.collection.updateOne({telegramId: this.telegramId}, {$set: update});
  }

  /**
   * Access to Database and return the User Object or create it
   *
   * @returns {Promise}
   */
  getUser() {
    const collection = this.collection;
    const telegramId = this.telegramId;
    return collection.find({telegramId: telegramId}).limit(1).next().then(function (user) {
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
    return this.collection.removeOne({telegramId: this.telegramId});
  }
}


module.exports = User;
