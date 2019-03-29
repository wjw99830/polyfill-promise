const createPromise = require('../src').default;
const Promise = createPromise();

it(`should recieve "I'm in then" after 1 second.`, () => {
  const promise = new Promise((resolve) => {
    setTimeout(resolve, 1000, 'I\'m in then');
  })
  promise.then(function (payload) {
    expect(payload).toBe(`I'm in then`);
  });
});
it(`should recieve "I'm in catch" after 1 second.`, () => {
  const promise = new Promise((resolve) => {
    setTimeout(reject, 1000, 'I\'m in catch');
  })
  promise.catch(function (payload) {
    expect(payload).toBe(`I'm in catch`);
  });
});
it(`should recieve "I'm in third then".`, () => {
  const promise = new Promise((resolve) => {
    resolve(`I'm in first then`);
  })
  promise.then(() => `I'm in second then`).then(() => `I'm in third then`).then((payload) => {
    expect(payload).toBe(`I'm in third then`);
  });
});
it(`should recieve "I'm caught in last catch".`, () => {
  const promise = new Promise((resolve, reject) => {
    reject(`I'm caught in last catch`);
    resolve(`I'm resolved`);
  })
  promise.then((payload) => {
    expect(payload).toBe(NaN);
    return `I'm in second then`;
  }).then((payload) => {
    expect(payload).toBe(NaN);
  }).catch((payload) => {
    expect(payload).toBe(`I'm caught in last catch`);
  })
});
it(`should recieve "I'm thrown and I'm in finally".`, () => {
  const promise = new Promise((resolve, reject) => {
    reject(`I'm thrown and I'm in finally`);
    resolve(`I'm resolved`);
  })
  promise.then((payload) => {
    expect(payload).toBe(NaN);
    return `I'm in second then`;
  }).then((payload) => {
    expect(payload).toBe(NaN);
  }).finally((payload) => {
    expect(payload).toBe(`I'm thrown and I'm in finally`);
  })
});
it(`should recieve ["p1", "p2", "p3"]`, () => {
  Promise.all(
    new Promise(r => setTimeout(r, 3000, 'p1')),
    new Promise(r => setTimeout(r, 1000, 'p2')),
    new Promise(r => setTimeout(r, 2000, 'p3')),
  ).then(payload => expect(payload).toEqual(['p1', 'p2', 'p3']));
});
it(`should recieve "p2`, () => {
  Promise.all(
    new Promise(r => setTimeout(r, 3000, 'p1')),
    new Promise(r => setTimeout(r, 1000, 'p2')),
    new Promise(r => setTimeout(r, 2000, 'p3')),
  ).then(payload => expect(payload).toBe('p2'));
});
