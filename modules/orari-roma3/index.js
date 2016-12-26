'use strict';

const debug = require('debug')('bot:orari-roma3');
const xml2js = require('xml2js');
const util = require('util');
const http = require('http');
const database = require('../database');
const auleCollections = database.collections.aule;
const orariCollections = database.collections.orari;
const dipartimenti = require('../dipartimenti');

class OrariRomaTre {
  constructor() {
  }

  /**
   * Update the local database with data fetched from orari.uniroma3.it/$$$/esporta.php
   * @return {Promise}
   */
  updateDb() {
    const promises = [];
    for (const key of Object.keys(dipartimenti)) {
      const dipartimento = dipartimenti[key];
      if (dipartimento.orariKey) promises.push(updateDipartimentoDb(dipartimento));
    }
    return Promise.all(promises).then(values => {
      debug('Database updated');
      return values;
    }).catch(e => console.error(e.stack));
  }

  /**
   * This object represent a free room
   * @typedef {object} AulaLibera
   * @property {string} - aula name of the room
   * @property {Date} - date time when this room will become busy
   */

  /**
   * Ritorna una lista di aule libere
   * @params {object} dipartimento
   * @return {Promise.<AulaLibera[]>}
   */
  getAuleLibere(dipartimento) {
    const nowDate = new Date();
    const fromDate = new Date();
    const toDate = new Date();
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(24, 0, 0, 0);

    return new Promise(function (resolve, reject) {
      const auleObj = {};
      const auleArr = [];
      orariCollections.find({
        dateFine: {$gte: fromDate, $lte: toDate},
        dipartimento: dipartimento.id
      }, {
        _id: 0,
        aula: 1,
        dateInizio: 1,
        dateFine: 1
      }).forEach(
        function (item) {
          if (item.dateInizio < nowDate && nowDate < item.dateFine) {
            // Aula occupata
            auleObj[item.aula] = -1;
          }
          else if (typeof auleObj[item.aula] === 'undefined') {
            if (item.dateInizio < nowDate) auleObj[item.aula] = toDate;
            else auleObj[item.aula] = item.dateInizio;
          }
          else if (item.dateInizio < auleObj[item.aula] && item.dateInizio > nowDate && auleObj[item.aula] !== -1) {
            auleObj[item.aula] = item.dateInizio;
          }
        },
        function (err) {
          if (err) return reject(err);
          for (let aula in auleObj) {
            if (auleObj[aula] != -1) auleArr.push({aula: aula, date: auleObj[aula]});
          }
          auleArr.sort((a, b) => b.date.getTime() - a.date.getTime());
          return resolve(auleArr);
        });
    });
  }

  /**
   *
   * @param dipartimentoId
   * @param query
   * @return {Cursor}
   */
  getEventsFromName(dipartimentoId, query) {
    return orariCollections.find({
      $text: {
        $search: query,
        $caseSensitive: false,
        $diacriticSensitive: false
      },
      dipartimento: dipartimentoId
    }, {
      _id: 0,
      denominazione: 1,
      dipartimento: 1,
      docente: 1,
      aula: 1,
      dateInizio: 1,
      dateFine: 1,
      score: {$meta: "textScore"}
    });
  }
}

/**
 * Preleva gli orari da orari.uniroma3.it
 * @param dipartimento {object}
 * @param fromDate {Date}
 * @param toDate {Date}
 * @return {Promise}
 */
function fetchOrari(dipartimento, fromDate, toDate) {
  return new Promise(function (resolve, reject) {
    let output = "";
    const parser = new xml2js.Parser();
    parser.addListener('end', function (result) {
      resolve(result);
    });
    parser.addListener('error', reject);

    const url = util.format(
      "http://orari.uniroma3.it/%s/esporta.php?from_Month=%d&from_Day=%d&from_Year=%d" +
      "&to_Month=%d&to_Day=%d&to_Year=%d&export_type=xml&save_entry=Esporta+calendario", dipartimento.orariKey
      , fromDate.getMonth() + 1, fromDate.getDate(), fromDate.getFullYear()
      , toDate.getMonth() + 1, toDate.getDate(), toDate.getFullYear()
    );
    http.get(url, function (res) {
      res.on('data', function (chunk) {
        output += chunk;
      }).on('end', function () {
        debug("HTTP done: " + url);
        parser.parseString(output);
      });
    }).on('error', reject);
  });
}

/**
 * Aggiorna il database degli orari
 * @param {object} facolta
 * @param {object} dipartimento
 * @return {Promise}
 */
function updateOrari(facolta, dipartimento) {
  return new Promise(function (resolve, reject) {

    orariCollections.deleteMany({
      dipartimento: dipartimento.id
    }).then(function () {
      const lezioni = facolta['corsoLaurea'];
      const promises = [];
      for (let i = 0; i < lezioni.length; i++) {
        const lezione = lezioni[i];
        const insegnamenti = lezione['insegnamento'];
        const corsoLaurea = lezione['denominazione'][0];

        for (let j = 0; j < insegnamenti.length; j++) {
          const insegnamento = insegnamenti[j];
          const denominazione = insegnamento['denominazione'][0];
          const periodoAnnoAccademico = insegnamento['periodoAnnoAccademico'];
          const orari = periodoAnnoAccademico[0]['didattica'][0]['orari'];

          for (let k = 0; k < orari.length; k++) {
            const orario = orari[k];
            const dettagli = orario['denominazione'][0];
            const eventoFormativo = orario['eventoFormativo'][0];
            const docente = eventoFormativo['docente'][0];
            const aula = eventoFormativo['aula'][0];
            const giorno = eventoFormativo['giorno'][0];
            const orarioInizio = eventoFormativo['orarioInizio'][0];
            const orarioFine = eventoFormativo['orarioFine'][0];
            promises.push(
              orariCollections.insertOne({
                dipartimento: dipartimento.id,
                corsoLaurea: corsoLaurea,
                denominazione: denominazione,
                dettagli: dettagli,
                docente: docente,
                aula: aula,
                giorno: giorno,
                orarioInizio: orarioInizio,
                orarioFine: orarioFine,
                dateInizio: new Date(giorno + ' ' + orarioInizio),
                dateFine: new Date(giorno + ' ' + orarioFine)
              }));
          }
        }
      }
      Promise.all(promises).then(function (values) {
        resolve(values)
      }).catch(reject);
    }).catch(reject);
  });
}

/**
 * Aggiorna il database delle aule
 * @param {object} facolta
 * @param {object} dipartimento
 * @return {Promise}
 */
function updateAule(facolta, dipartimento) {
  return new Promise(function (resolve, reject) {
    auleCollections.deleteMany({
      dipartimento: dipartimento.id
    }).then(function () {

      const promises = [];
      const listaAule = facolta['listaAuleAsservite'][0]; // Array associativi: aula + capacita
      const aule = listaAule['aula'];
      const capacitas = listaAule['capacita'];

      for (let i = 0; i < aule.length; i++) {
        const aula = aule[i];
        const capacita = capacitas[i];
        promises.push(auleCollections.insertOne({
          dipartimento: dipartimento.id,
          nome: aula,
          capacita: capacita
        }));
      }

      Promise.all(promises).then(function (values) {
        resolve(values)
      }).catch(reject);

    }).catch(reject);
  });
}

/**
 * Aggiorna il database degli orari del dipartimento
 * @param {object} dipartimento
 * @returns {Promise}
 */
function updateDipartimentoDb(dipartimento) {
  const todayDate = new Date();
  const toDate = new Date(todayDate.getTime() + (86400000 * 6));

  return fetchOrari(dipartimento, todayDate, toDate)
    .then(object => {
      const facolta = object['facolta'];
      return Promise.all([updateAule(facolta, dipartimento), updateOrari(facolta, dipartimento)]);
    })
}

module.exports = new OrariRomaTre();
module.exports.updateDb();
