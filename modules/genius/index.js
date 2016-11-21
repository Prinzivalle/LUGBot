'use strict';

const brain = require('brain');
const phrases = require('./sentences.json');
const commands = require('../command-manager');

const net = new brain.NeuralNetwork();

function makeDict(str) {
  const ar = str.split(' ');
  const oj = {};
    ar.forEach(function (item) {
        oj[item] = 1;
    });
    return oj;
}

function normalizeSentence(sentence) {
    return sentence.toLowerCase().replace(/[^a-z ]/g, "");
}

function init() {
  const data = [];

  const keys = Object.keys(phrases);
    keys.forEach(function (key) {
      const list = phrases[key];
        list.forEach(function (p) {
          const a = {
            input: makeDict(p),
            output: {}
            };
            a.output[key] = 1;
            data.push(a)
        });
    });

    net.train(data);
}

init();

module.exports = {
  Middleware: function Middleware(msg, telegramBot, next) {
    const stats = net.run(makeDict(normalizeSentence(msg.text)));
    for (let command in stats) {
            if (stats.hasOwnProperty(command) && stats[command] > 0.5) {
                return commands.commands['/' + command](msg, telegramBot, next);
            }
        }
        console.log(stats);
        return next();
    }
};
