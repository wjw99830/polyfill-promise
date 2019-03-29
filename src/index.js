function createPromise() {
  function Promise(exec) {
    try {
      exec(resolve.bind(this), reject.bind(this));
    } catch (e) {
      reject.bind(this)(e);
    }
  }
  var PromiseStatus = {
    PENDING: 'pending',
    REJECTED: 'rejected',
    RESOLVED: 'resolved',
  };
  function resolve(payload) {
    var that = this;
    if (this.PromiseStatus !== PromiseStatus.PENDING) {
      return;
    }
    this.PromiseStatus = PromiseStatus.RESOLVED
    setTimeout(function () {
      that.resolvedHandler && that.resolvedHandler(payload);
      that.finalHandler && that.finalHandler(payload);
    }, 0);
  }
  function reject(payload) {
    var that = this;
    if (this.PromiseStatus !== PromiseStatus.PENDING) {
      return;
    }
    this.PromiseStatus = PromiseStatus.REJECTED;
    setTimeout(function () {
      that.rejectedHandler && that.rejectedHandler(payload);
      that.finalHandler  && that.finalHandler(payload);
      if (!that.rejectedHandler && !that.resolvedHandler) {
        throw new Error(payload);
      }
    }, 0);
  }
  Promise.all = function () {
    var promises = arguments;
    var length = promises.length;
    var result = [];
    var resolvedCount = 0;
    return new Promise(function (resolve, reject) {
      for (var i = 0; i < length; i++) {
        var promise = promises[i];
        if (promise instanceof Promise) {
          (function (promise, i) {
            promise.then(function (payload) {
              result[i] = payload;
              resolvedCount++;
              if (resolvedCount === length) {
                resolve(result);
              }
            }).catch(function (e) {
              reject(e);
            })
          })(promise, i);
        } else {
          result[i] = promise;
          resolvedCount++;
          if (resolvedCount === length) {
            resolve(result);
          }
        }
      }
    });
  }
  Promise.race = function () {
    var promises = arguments;
    var length = promises.length;
    return new Promise(function (resolve, reject) {
      for (var i = 0; i < length; i++) {
        var promise = promises[i];
        if (promise instanceof Promise) {
          promise.then(function (payload) {
            resolve(payload);
          }).catch(function (e) {
            reject(e);
          });
        } else {
          resolve(promise);
        }
      }
    })
  }
  var proto = Promise.prototype;
  proto.PromiseStatus = PromiseStatus.PENDING;
  proto.then = function (onResolved, onRejected) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.resolvedHandler = function (payload) {
        try {
          resolve(onResolved ? onResolved(payload) : payload);
        } catch (e) {
          reject(e);
        }
      };
      that.rejectedHandler = function (payload) {
        try {
          reject(onRejected ? onRejected(payload) : payload);
        } catch (e) {
          reject(e);
        }
      };
    });
  }
  proto.catch = function (onRejected) {
    this.rejectedHandler = function (payload) {
      onRejected && onRejected(payload);
    };
  }
  proto.finally = function (onFinished) {
    this.finalHandler = function (payload) {
      onFinished && onFinished(payload);
    };
  }
  return Promise;
}
module.exports = {
  createPromise,
  default: createPromise,
};
