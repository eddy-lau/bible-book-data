/*jshint esversion: 6 */

var data = require('./src/book-data')('zh-Hans');

data.forEach( entry => {
  console.log(entry);
});
