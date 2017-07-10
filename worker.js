'use strict';

module.exports.onmessage = function(message) {
  if (message.data.init) {
    const gener = buildFun(message.data.gener);
    const initVal = message.data.value;

    iter = gener(initVal);
  } else {
    let value = message.data.value;
    let next = iter.next(value);
    const ID = message.data.ID;

    this.postMessage({
      result: next.value,
      done: next.done,
      ID, ID
    });
  }
}

module.exports.buildFun = function buildFun(fnStr) {
  let fn;
  eval('fn = ' + fnStr);
  return fn;
}
