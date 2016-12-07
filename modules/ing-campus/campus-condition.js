'use strict';

const http = require('http');
const ingCampusCacheCollection = require('../database').collections.ingCampusCache;
const CampusConditionParser = require('./campus-condition-parser');
const MapRenderer = require('./map-renderer');

/**
 * This class permits getting free and busy seats of Roma Tre labs
 * @type {CampusCondition}
 */
module.exports = class CampusCondition {

  /**
   *
   * @param {string} urlPath
   * @param {(number|string)[][]} mapMatrix
   * @param {int} mapId
   */
  constructor(urlPath, mapMatrix, mapId) {
    this.free = 0;
    this.busy = 0;
    this.lastUpdatedDate = null;
    this.requestDate = 0;
    this.statusString = null;
    this.urlPath = urlPath;
    this.mapMatrix = mapMatrix;
    this.mapId = mapId;
  }

  get total() {
    return this.free + this.busy;
  }

  /**
   *
   * @param statusString
   * @return {Promise.<String|Buffer>}
   */
  getTelegramPhoto(statusString) {
    return ingCampusCacheCollection.findOne({mapId: this.mapId, status: statusString})
      .then(data => {
        if (!data) return MapRenderer.generateCanvas(this.mapMatrix, statusString).toBuffer();
        return data.fileId;
      });
  }

  saveTelegramPhoto(statusString, fileId) {
    ingCampusCacheCollection.insertOne({
      mapId: this.mapId,
      status: statusString,
      fileId: fileId
    });
  }

  /**
   *
   * @return {Promise.<CampusCondition>}
   */
  getCondition() {
    if ((Date.now() - this.requestDate) < 60000) {
      return Promise.resolve(this);
    }
    return this.update().then(() => this);
  }

  /**
   * @private
   * @return {Promise}
   */
  update() {
    return new Promise(function (resolve, reject) {
      const req = http.request({
        hostname: 'muglab.uniroma3.it',
        path: this.urlPath
      }, (res) => {
        const parser = new CampusConditionParser();
        res.on('data', parser.parse.bind(parser));
        res.on('end', () => {
          parser.end();
          this.lastUpdatedDate = parser.lastUpdatedDate;
          this.statusString = parser.statusString;
          this.requestDate = Date.now();

          const statusString = this.statusString;
          const map = [].concat.apply([], this.mapMatrix).filter(a => a !== 0 && a !== 'c');
          this.free = 0;
          this.busy = 0;
          for (let i = 0; i < statusString.length; i++) {
            if (typeof map[i] != 'number') continue;

            const c = statusString[i];
            if (c == '0') this.free++;
            else if (c == '1') this.busy++;
          }

          resolve();
        });
      });

      req.on('error', reject);

      req.end();
    }.bind(this));
  }

};
