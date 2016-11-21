'use strict';

var db = require('../database').db;

class ConversationLogger {
  constructor() {
    this.conversationCollection = db.collection('conversations');
  }

  /**
   * Log a message
   * @param {number} chatId
   * @param {string} message
   * @param {boolean} isSent
   * @returns {Promise}
   */
  log(chatId, message, isSent) {
    return this.conversationCollection.insertOne({
      message: message,
      chatId: chatId,
      isSent: isSent
    });
  }

  /**
   * Get a list of chatid
   * @returns {Promise}
   */
  getConversationsList() {
    return this.conversationCollection.distinct('chatId', {});
  }

  /**
   * Get conversation by chatid
   * @param chatId
   * @returns {Cursor}
   */
  getConversation(chatId) {
    return this.conversationCollection.find({chatId: chatId});
  }
}


module.exports = new ConversationLogger();
