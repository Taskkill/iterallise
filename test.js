//import Iterallise from 'iterallise';
const Iterallise = require('./main');

// standard generator Example

function* gener(input) {
  while (true) {
    yield input++;
  }
}

let iter = gener(4);

console.log(iter.next().value);
console.log(iter.next().value);
console.log(iter.next().value);
console.log(iter.next().value);
console.log(iter.next().value);

// parallel
// it returns promise not '{done: bool, value: val}'

let it2 = Iterallise(gener, 4);

it2.next().then(res => console.log(res));
it2.next().then(res => console.log(res));
it2.next().then(res => console.log(res));
it2.next().then(res => console.log(res));
it2.next().then(res => console.log(res));
