'use strict';

const SelectDepartment = require('./select-department');
const ForgetMe = require('./forget-me');

/**
 * @type {object.<SettingsMenu>}
 */
module.exports = {
  1: new SelectDepartment(1),
  2: new ForgetMe(2)
};
