var Ingegneria = require('./ingegneria/index');

var RSSRomaTre = function () {};
/**
 * Aggiorna le notizie di tutto l'ateneo
 */
RSSRomaTre.prototype.updateDb = function () {
    Ingegneria.updateDb();
    // TODO implementare le altre facoltà
    // TODO implementare gli avvisi di Ateneo
};

/**
 * Foreach news insert if not exists else update if necessary
 * @param {Array} news
 * @returns {Promise}
 */
function updateNews(news) {
  return new Promise(function (resolve, reject) {
    const collection = db.collection('news');
    const promises = [];
    news.forEach(function (element) {
      promises.push(collection.updateOne({titolo: element.titolo}, element, {upsert: true}));
    });
    Promise.all(promises).then(function (values) {
      console.log('[NEWS] Database updated');
      resolve(values);
    }).catch(function (error) {
      reject(error);
    });
  });

}

module.exports = new RSSRomaTre();
