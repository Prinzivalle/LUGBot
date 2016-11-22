'use strict';

const conversationsCollection = require('../database').collections.conversations;

class ConversationLogger {
  constructor() {
  }

  /**
   * Log a message
   * @param {number} chatId
   * @param {string} message
   * @param {boolean} isSent
   * @returns {Promise}
   */
  log(chatId, message, isSent) {
    return conversationsCollection.insertOne({
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
    return conversationsCollection.distinct('chatId', {});
  }

  /**
   * Get conversation by chatid
   * @param chatId
   * @returns {Cursor}
   */
  getConversation(chatId) {
    return conversationsCollection.find({chatId: chatId});
  }
}

module.exports = new ConversationLogger();
