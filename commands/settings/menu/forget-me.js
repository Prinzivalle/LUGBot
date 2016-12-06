'use strict';

const dipartimenti = require('../../../modules/dipartimenti');
const keyboardGenerator = require('../keyboard-generator');
const SettingsMenu = require('./base');

/**
 *
 * @type {ForgetMeMenu}
 */
module.exports = class ForgetMeMenu extends SettingsMenu {
  constructor(menuId) {
    super(menuId, "Dimenticami");
  }

  get questionText() {
    return "Vuoi veramente cancellare tutte le tue preferenze personali?"
  }

  get inlineKeyboard() {
    const buttons = [{
      text: "Sì",
      callback_data: this.generateCallbackData(1)
    }, {
      text: "No",
      callback_data: this.generateCallbackData(0)
    }];

    return keyboardGenerator(buttons);
  }

  /**
   * @param {User} user
   * @param {string} response
   * @return {Promise.<SettingsCallbackResult>}
   */
  onCallback(user, response) {
    if (response == '1') return user.forget().then(() => ({
      notificationText: 'Utente dimenticato',
      showAlert: false,
      completed: true
    }));

    else return Promise.resolve({
      notificationText: '',
      showAlert: false,
      completed: true
    });
  }
};
