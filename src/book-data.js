/*jshint esversion: 6 */

/*

Book IDs defined in
https://ubsicap.github.io/usfm/identification/books.html

*/
var localizedData = require('./data/localized-data.json');
const BOOK_DATA = require('./data/default-data.json');

var cache = {};

function getBookData(lang) {

  var result = [];
  var localizedName;
  var localizedAbbreviation;

  for (var i = 0; i<BOOK_DATA.length; i+=4) {

    if (localizedData[lang]) {
      localizedName = localizedData[lang].booknames[i/4];
      localizedAbbreviation = localizedData[lang].abbreviations[localizedName];
    }

    result.push({
      index: BOOK_DATA[i],
      id: BOOK_DATA[i+1],
      name: localizedName || BOOK_DATA[i+2],
      abbreviation: localizedAbbreviation || BOOK_DATA[i+1],
      description: BOOK_DATA[i+3]
    });
  }
  return result;

}

module.exports = function(lang, bookIds) {

  lang = lang || 'en';

  if (!cache[lang]) {
    cache[lang] = getBookData(lang);
  }

  if (Array.isArray(bookIds)) {
    return cache[lang].filter( bookData => {
      return bookIds.indexOf(bookData.id) >= 0;
    });
  } else {
    return cache[lang];
  }

};
