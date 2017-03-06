'use strict';

const debug = require('debug')('bot:genius');
const commands = require('../command-manager');
const {Wit, log} = require('node-wit');
const accessToken = require('../../etc/config').witAiToken;
const execFile = require('child_process').execFile;
const config = require('../../etc/config');

if (!accessToken) {
  module.exports = {
    Middleware: function Middleware(msg, telegramBot, next) {
      return next();
    }
  };
  return;
}

const client = new Wit({accessToken: accessToken});

module.exports = {
  Middleware: function Middleware(msg, telegramBot, next) {
    client.message(msg.text, {})
      .then(data => runCommand(data, msg, telegramBot, next))
      .catch(next);
  }, VoiceHandler: function (msg, telegramBot, next) {
    if (msg.voice.duration > 9) return;
    telegramBot.getFile(msg.voice.file_id).then(fileData => {
      execFile('./bin/voicesend', [config.telegramToken, fileData.file_path, config.witAiToken], (err, stdout, stderr) => {
        if (err) return console.error(err);
        return runCommand(JSON.parse(stdout), msg, telegramBot, console.error)
      });
    }).catch(console.error);
  }
};

function runCommand(data, msg, telegramBot, next) {
  // Errors check
  if (!(data && data.entities && data.entities['intent'] && data.entities['intent'][0])) return next();
  const intent = data.entities['intent'][0];
  if (intent['confidence'] < 0.5) return next();
  const command = commands.commands['/' + intent['value']];
  if (!command) return next();

  // If everything is ok
  return command(msg, telegramBot, data.entities);
}
