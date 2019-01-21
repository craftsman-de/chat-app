// Jan 1st 1970 00:00:00am
const moment = require('moment');

let date = new moment();

console.log(date.format('h:mm a'));

let array = [3,4,6,4];
//array.splice(1,1);
let newarray = [ ... Set(array) ];
console.log(newarray);
console.log(newarray.length);