'use strict';

/**
 * Parse data returned from the MUG server
 * @type {CampusConditionParser}
 */
module.exports = class CampusConditionParser {

  constructor() {
    this.free = 0;
    this.busy = 0;
    this.data = "";
    this.lastUpdatedDate = null;
  }

  get statusString() {
    return this.data.substr(0, this.data.indexOf('\n'))
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
    const seatsData = data[0];
    this.lastUpdatedDate = new Date(data[1]);
    for (let i = 0; i < seatsData.length; i++) {
      const c = seatsData[i];
      if (c == '0') this.free++;
      else if (c == '1') this.busy++;
    }
  }
};
