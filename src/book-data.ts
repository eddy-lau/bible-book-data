/*jshint esversion: 6 */

/*

Book IDs defined in
https://ubsicap.github.io/usfm/identification/books.html

*/
import * as localizedData from './data/localized-data.json';
import * as BOOK_DATA from './data/default-data.json';
import * as SECTIONS_DATA from './data/sections.json';

var cache:{ [id :string]: BookData[] } = {};

export type Category = {
  name: string
  order: number
  numberOfBooks: number
}

export type Section = {
  name: string
  order: number
  numberOfBooks: number
  category: Category
}

export type Language = 'en'|'zh-Hant'|'zh-Hans'

function sectionOfBook(i:number, lang:Language):Section | undefined {

  var total = 0;
  var section = SECTIONS_DATA[lang].sections.find( section => {
    total += section.numberOfBooks;
    return i < total;
  })!;

  if (!section) {
    return undefined;
  }

  var orderInSection = section.numberOfBooks - (total - i) + 1;

  total = 0;
  var category = section.categories.find( category => {
    total += category.numberOfBooks;
    return orderInSection < total + 1;
  })!;

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

export type BookData = {
  index:string
  id:string
  name:string
  abbreviation:string
  'alternate-names'?:string[]
  description:string
  section?: Section
}

function getBookData(lang:Language):BookData[] {

  var result:BookData[] = [];
  var localizedName:string|undefined;
  var localizedAbbreviation:string|undefined;
  var localizedAltNames:string[]|undefined;

  for (var i = 0; i<BOOK_DATA.length; i+=4) {

    if (localizedData[lang]) {
      localizedName = localizedData[lang].booknames[i/4];
      // @ts-ignore
      localizedAbbreviation = localizedData[lang].abbreviations[localizedName];
      if (localizedData[lang].altNames) {
        // @ts-ignore
        localizedAltNames = localizedData[lang].altNames[localizedName];
      }
    }

    result.push({
      index: BOOK_DATA[i],
      id: BOOK_DATA[i+1],
      name: localizedName || BOOK_DATA[i+2],
      abbreviation: localizedAbbreviation || BOOK_DATA[i+1],
      'alternate-names': localizedAltNames,
      description: BOOK_DATA[i+3],
      section: sectionOfBook(i/4, lang)
    });
  }
  return result;

}

export default function(lang?:Language, bookIds?:string[]) {

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
