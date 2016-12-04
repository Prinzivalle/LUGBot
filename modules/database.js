'use strict';

const debug = require('debug')('bot:database');
const mongoDbUrl = require('../etc/config').mongoDbUrl;
const MongoClient = require('mongodb').MongoClient;
let db = null;
const collections = {};

module.exports = {
  /**
   * Get the mongo Db instance
   * @returns {Db}
   */
  get db() {
    return db;
  },

  get collections() {
    return collections;
  },

  /**
   * Connect to mongo database. You must wait for this before starting the server.
   * @returns {Promise}
   */
  connect: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(mongoDbUrl, {promiseLibrary: Promise}, function (err, database) {
        if (err) return reject(err);
        db = database;
        debug('MongoClient connected');
        resolve(db);
      });
    });
  },

  /**
   * Load all collections used syncronously
   * @param {Db} db
   */
  loadCollections: function (db) {
    collections.conversations = db.collection('conversations');
    collections.users = db.collection('users');
    collections.orari = db.collection('orari');
    collections.orari.createIndex({denominazione: "text", docente: "text"});
    collections.aule = db.collection('aule');
    collections.ingCampusCache = db.collection('ingCampusCache');
    collections.ingCampusCache.createIndex({mapId: 1});
  }

};
