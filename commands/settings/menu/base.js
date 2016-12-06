'use strict';

/**
 * @typedef {object} SettingsCallbackResult
 * @property {string} notificationText
 * @property {boolean} showAlert
 * @property {boolean} completed
 */

/**
 *
 * @type {SettingsMenu}
 */
module.exports = class SettingsMenu {
  constructor(menuId, name) {
    this.menuId = menuId;
    this.name = name;
  }

  generateCallbackData(...args) {
    return this.menuId + '\t' + args.join('\t');
  }

  /**
   *
   * @param {User} user
   * @param {string} args
   * @return {Promise.<SettingsCallbackResult>}
   */
  onCallback(user, ...args) {
    return Promise.reject("onCallback() not overridden by " + this.constructor.name);
  }

};
