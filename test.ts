/*jshint esversion: 6 */
import BookData from './src/book-data'

var data = BookData('zh-Hant');

console.log(JSON.stringify(data, null, 2));
