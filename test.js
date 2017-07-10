//import Iterallise from 'iterallise';

// standard generator Example

function Iterallise(gener) {
  // send gener.toString() into worker
  // return object

  return {
    next: (value) => {
      // value poslat do workeru
      let __resolve;
      let __reject;

      worker.onmessage = message => {
        if (message.data.success) {
          __resolve(message.data.result);
        } else {
          __reject(message.data.error);
        }
      }

      worker.postMessage({
        value: value,
      });

      return new Promise((resolve, reject) => {
        __resolve = resolve;
        __reject = reject;
      });
    },
    done: false // s prvnim donem ve workeru se nastavi i tohle
  }
}




function* gener(input) {
  while (true) {
    yield(input++);
  }
}

let iter = gener(2);

console.log(iter.next().value);
console.log(iter.next().value);
console.log(iter.next().value);
console.log(iter.next().value);
console.log(iter.next().value);

// parallel
// it returns promise not '{done: bool, value: val}'

let it2 = Iterallise(function* gener(input) {
  while (true) {
    yield(input++);
  }
});

it2.next().then(res => console.log(res));
it2.next().then(res => console.log(res));
it2.next().then(res => console.log(res));
it2.next().then(res => console.log(res));
it2.next().then(res => console.log(res));
