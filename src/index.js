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
