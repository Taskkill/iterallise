'use strict';

const buildFun = require('./worker').buildFun;
const onmessage = require('./worker').onmessage;

const source = `
  'use strict';
  let iter;
  ${buildFun.toString()}
  this.onmessage = ${onmessage.toString()}
`;

const getWorkerURL = (script) => window.URL.createObjectURL(createTextFile(script));

const createTextFile = (content) => new Blob([content], {
  type: 'text/plain'
});


module.exports = function Iterallise(gener, initValue) {
  let ID = Number.MIN_SAFE_INTEGER;
  let done = false;
  const worker = new Worker(getWorkerURL(source));

  worker.postMessage({
    gener: gener.toString(),
    value: initValue,
    init: true,
  })

  return {
    next: (value) => {

      if (done) {
        return Promise.resolve(undefined);
      }

      let __resolve;
      let __reject;

      let handler = (function(message) {
        if (message.data.ID === this.ID) {
          worker.removeEventListener('message', handler);
          done = message.data.done;
          __resolve(message.data.result);
        }
      }).bind({ID: ID});

      worker.addEventListener('message', handler);


      worker.postMessage({
        value: value,
        ID: ID++,
      });

      if (ID === Number.MAX_SAFE_INTEGER) {
        ID = Number.MIN_SAFE_INTEGER;
      }

      return new Promise((resolve, reject) => {
        __resolve = resolve;
        __reject = reject;
      });
    },
    done: done,
  }
}
