'use strict';

/**
 * Some custom errors
 * @module
 */

exports.InputValidationError = class InputValidationError extends Error {
};

/**
 * @param {Error} err
 * @param {Message} msg
 * @param {TelegramBot} telegramBot
 */
exports.handleGenericError = function handleGenericError(err, msg, telegramBot) {
  telegramBot.sendMessage(msg.chat.id, "Si è verificato un errore, verrà risolto al più presto.");
  console.error(err.stack);
};
