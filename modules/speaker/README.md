# Speaker object

## Usage
### Define a new question

```javascript
speaker.addQuestion('dipartimento', function (telegramId, telegramBot) {
     var message = "Di quale dipartimento fai parte?";
     for (var i = 1; i < dipartimenti.length; i++) {
         message += '\n' + i + ') ' + dipartimenti[i].name;
     }
     telegramBot.sendMessage(telegramId, message);
}, function (msg, telegramBot) {
     return Promise.resolve(parseInt(msg.text));
});
```

### Ask a question

```javascript
function getDipartimento() {
    return speaker.ask('dipartimento', telegramId, telegramBot).then(...).catch(...);
}
```
