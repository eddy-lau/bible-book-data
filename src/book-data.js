/*jshint esversion: 6 */

/*

Book IDs defined in
https://ubsicap.github.io/usfm/identification/books.html

*/
var localizedData = require('./data/localized-data.json');
const BOOK_DATA = require('./data/default-data.json');
const SECTIONS_DATA = require('./data/sections.json');

var cache = {};

function sectionOfBook(i, lang) {

  var total = 0;
  var section = SECTIONS_DATA[lang].sections.find( section => {
    total += section.numberOfBooks;
    return i < total;
  });

  if (!section) {
    return undefined;
  }

  var orderInSection = section.numberOfBooks - (total - i) + 1;

  total = 0;
  var category = section.categories.find( category => {
    total += category.numberOfBooks;
    return orderInSection < total + 1;
  });

  var orderInCategory = category.numberOfBooks - (total - orderInSection);

  return {
    name: section.name,
    order: orderInSection,
    numberOfBooks: section.numberOfBooks,
    category: {
      name: category.name,
      order: orderInCategory,
      numberOfBooks: category.numberOfBooks
    }
  };
}

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
      description: BOOK_DATA[i+3],
      section: sectionOfBook(i/4, lang)
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
