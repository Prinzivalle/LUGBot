'use strict';

const dipartimenti = require('../../../modules/dipartimenti');
const keyboardGenerator = require('../keyboard-generator');
const SettingsMenu = require('./base');

/**
 *
 * @type {ChangeDepartmentSettingsMenu}
 */
module.exports = class ChangeDepartmentSettingsMenu extends SettingsMenu {
  constructor(menuId) {
    super(menuId, "Cambia dipartimento");
  }

  get questionText() {
    return "Di quale dipartimento fai parte?"
  }

  get inlineKeyboard() {
    const buttons = [];
    for (let i = 1; i < dipartimenti.length; i++) {
      const d = dipartimenti[i];
      buttons.push({
        text: d.name,
        callback_data: this.generateCallbackData(d.id)
      });
    }

    return keyboardGenerator(buttons);
  }

  /**
   * @param {User} user
   * @param {string} dipartimentoId
   * @return {Promise.<SettingsCallbackResult>}
   */
  onCallback(user, dipartimentoId) {
    return user.setDipartimento(dipartimentoId).then(() => {
      return {
        notificationText: 'Dipartimento modificato: ' + dipartimenti[dipartimentoId].name,
        showAlert: false,
        completed: true
      };
    });
  }
};
