/*jshint esversion: 6 */
const BookData = require('.').default;

var data = BookData('zh-Hant');

console.log(JSON.stringify(data, null, 2));
