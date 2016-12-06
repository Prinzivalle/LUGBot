'use strict';

/**
 * Parse data returned from the MUG server
 * @type {CampusConditionParser}
 */
module.exports = class CampusConditionParser {

  constructor() {
    this.data = "";
    this.statusString = null;
    this.lastUpdatedDate = null;
  }

  /**
   * Parse data chunk from the http response
   * @param {string} chunk
   * @return {boolean} isFinished
   */
  parse(chunk) {
    this.data += chunk;
  }

  end() {
    const data = this.data.toString().split('\n');
    this.statusString = data[0];
    this.lastUpdatedDate = new Date(data[1]);
  }
};
