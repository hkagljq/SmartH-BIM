/******/
(function(modules) { // webpackBootstrap
  /******/ // The module cache
  /******/
  var installedModules = {};
  /******/
  /******/ // The require function
  /******/
  function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/
    if (installedModules[moduleId])
    /******/
      return installedModules[moduleId].exports;
    /******/
    /******/ // Create a new module (and put it into the cache)
    /******/
    var module = installedModules[moduleId] = {
      /******/
      exports: {},
      /******/
      id: moduleId,
      /******/
      loaded: false
        /******/
    };
    /******/
    /******/ // Execute the module function
    /******/
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/
    module.loaded = true;
    /******/
    /******/ // Return the exports of the module
    /******/
    return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/
  __webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/
  __webpack_require__.c = installedModules;
  /******/
  /******/ // __webpack_public_path__
  /******/
  __webpack_require__.p = "/developer/";
  /******/
  /******/ // Load entry module and return exports
  /******/
  return __webpack_require__(0);
  /******/
})
/************************************************************************/
/******/
({

  /***/
  0:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    __webpack_require__(66);

    var _vue = __webpack_require__(70);

    var _vue2 = _interopRequireDefault(_vue);

    var _axios = __webpack_require__(72);

    var _axios2 = _interopRequireDefault(_axios);

    var _energy = __webpack_require__(237);

    var _energy2 = _interopRequireDefault(_energy);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    _vue2.default.prototype.$http = _axios2.default;

    var app = new _vue2.default({
      el: '#app',
      render: function render(h) {
        return h(_energy2.default);
      }
    }).$mount('#app');

    /***/
  },

  /***/
  66:
  /***/
    function(module, exports, __webpack_require__) {

    // This file can be required in Browserify and Node.js for automatic polyfill
    // To use it:  require('es6-promise/auto');
    'use strict';
    module.exports = __webpack_require__(67).polyfill();


    /***/
  },

  /***/
  67:
  /***/
    function(module, exports, __webpack_require__) {

    var require; /* WEBPACK VAR INJECTION */
    (function(process, global) {
      /*!
       * @overview es6-promise - a tiny implementation of Promises/A+.
       * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
       * @license   Licensed under MIT license
       *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
       * @version   4.1.0
       */

      (function(global, factory) {
        true ? module.exports = factory() :
          typeof define === 'function' && define.amd ? define(factory) :
          (global.ES6Promise = factory());
      }(this, (function() {
        'use strict';

        function objectOrFunction(x) {
          return typeof x === 'function' || typeof x === 'object' && x !== null;
        }

        function isFunction(x) {
          return typeof x === 'function';
        }

        var _isArray = undefined;
        if (!Array.isArray) {
          _isArray = function(x) {
            return Object.prototype.toString.call(x) === '[object Array]';
          };
        } else {
          _isArray = Array.isArray;
        }

        var isArray = _isArray;

        var len = 0;
        var vertxNext = undefined;
        var customSchedulerFn = undefined;

        var asap = function asap(callback, arg) {
          queue[len] = callback;
          queue[len + 1] = arg;
          len += 2;
          if (len === 2) {
            // If len is 2, that means that we need to schedule an async flush.
            // If additional callbacks are queued before the queue is flushed, they
            // will be processed by this flush that we are scheduling.
            if (customSchedulerFn) {
              customSchedulerFn(flush);
            } else {
              scheduleFlush();
            }
          }
        };

        function setScheduler(scheduleFn) {
          customSchedulerFn = scheduleFn;
        }

        function setAsap(asapFn) {
          asap = asapFn;
        }

        var browserWindow = typeof window !== 'undefined' ? window : undefined;
        var browserGlobal = browserWindow || {};
        var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
        var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

        // test for web worker but not in IE10
        var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

        // node
        function useNextTick() {
          // node version 0.10.x displays a deprecation warning when nextTick is used recursively
          // see https://github.com/cujojs/when/issues/410 for details
          return function() {
            return process.nextTick(flush);
          };
        }

        // vertx
        function useVertxTimer() {
          if (typeof vertxNext !== 'undefined') {
            return function() {
              vertxNext(flush);
            };
          }

          return useSetTimeout();
        }

        function useMutationObserver() {
          var iterations = 0;
          var observer = new BrowserMutationObserver(flush);
          var node = document.createTextNode('');
          observer.observe(node, {
            characterData: true
          });

          return function() {
            node.data = iterations = ++iterations % 2;
          };
        }

        // web worker
        function useMessageChannel() {
          var channel = new MessageChannel();
          channel.port1.onmessage = flush;
          return function() {
            return channel.port2.postMessage(0);
          };
        }

        function useSetTimeout() {
          // Store setTimeout reference so es6-promise will be unaffected by
          // other code modifying setTimeout (like sinon.useFakeTimers())
          var globalSetTimeout = setTimeout;
          return function() {
            return globalSetTimeout(flush, 1);
          };
        }

        var queue = new Array(1000);

        function flush() {
          for (var i = 0; i < len; i += 2) {
            var callback = queue[i];
            var arg = queue[i + 1];

            callback(arg);

            queue[i] = undefined;
            queue[i + 1] = undefined;
          }

          len = 0;
        }

        function attemptVertx() {
          try {
            var r = require;
            var vertx = __webpack_require__(69);
            vertxNext = vertx.runOnLoop || vertx.runOnContext;
            return useVertxTimer();
          } catch (e) {
            return useSetTimeout();
          }
        }

        var scheduleFlush = undefined;
        // Decide what async method to use to triggering processing of queued callbacks:
        if (isNode) {
          scheduleFlush = useNextTick();
        } else if (BrowserMutationObserver) {
          scheduleFlush = useMutationObserver();
        } else if (isWorker) {
          scheduleFlush = useMessageChannel();
        } else if (browserWindow === undefined && "function" === 'function') {
          scheduleFlush = attemptVertx();
        } else {
          scheduleFlush = useSetTimeout();
        }

        function then(onFulfillment, onRejection) {
          var _arguments = arguments;

          var parent = this;

          var child = new this.constructor(noop);

          if (child[PROMISE_ID] === undefined) {
            makePromise(child);
          }

          var _state = parent._state;

          if (_state) {
            (function() {
              var callback = _arguments[_state - 1];
              asap(function() {
                return invokeCallback(_state, child, callback, parent._result);
              });
            })();
          } else {
            subscribe(parent, child, onFulfillment, onRejection);
          }

          return child;
        }

        /**
          `Promise.resolve` returns a promise that will become resolved with the
          passed `value`. It is shorthand for the following:
	
          ```javascript
          let promise = new Promise(function(resolve, reject){
            resolve(1);
          });
	
          promise.then(function(value){
            // value === 1
          });
          ```
	
          Instead of writing the above, your code now simply becomes the following:
	
          ```javascript
          let promise = Promise.resolve(1);
	
          promise.then(function(value){
            // value === 1
          });
          ```
	
          @method resolve
          @static
          @param {Any} value value that the returned promise will be resolved with
          Useful for tooling.
          @return {Promise} a promise that will become fulfilled with the given
          `value`
        */
        function resolve(object) {
          /*jshint validthis:true */
          var Constructor = this;

          if (object && typeof object === 'object' && object.constructor === Constructor) {
            return object;
          }

          var promise = new Constructor(noop);
          _resolve(promise, object);
          return promise;
        }

        var PROMISE_ID = Math.random().toString(36).substring(16);

        function noop() {}

        var PENDING = void 0;
        var FULFILLED = 1;
        var REJECTED = 2;

        var GET_THEN_ERROR = new ErrorObject();

        function selfFulfillment() {
          return new TypeError("You cannot resolve a promise with itself");
        }

        function cannotReturnOwn() {
          return new TypeError('A promises callback cannot return that same promise.');
        }

        function getThen(promise) {
          try {
            return promise.then;
          } catch (error) {
            GET_THEN_ERROR.error = error;
            return GET_THEN_ERROR;
          }
        }

        function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
          try {
            then.call(value, fulfillmentHandler, rejectionHandler);
          } catch (e) {
            return e;
          }
        }

        function handleForeignThenable(promise, thenable, then) {
          asap(function(promise) {
            var sealed = false;
            var error = tryThen(then, thenable, function(value) {
              if (sealed) {
                return;
              }
              sealed = true;
              if (thenable !== value) {
                _resolve(promise, value);
              } else {
                fulfill(promise, value);
              }
            }, function(reason) {
              if (sealed) {
                return;
              }
              sealed = true;

              _reject(promise, reason);
            }, 'Settle: ' + (promise._label || ' unknown promise'));

            if (!sealed && error) {
              sealed = true;
              _reject(promise, error);
            }
          }, promise);
        }

        function handleOwnThenable(promise, thenable) {
          if (thenable._state === FULFILLED) {
            fulfill(promise, thenable._result);
          } else if (thenable._state === REJECTED) {
            _reject(promise, thenable._result);
          } else {
            subscribe(thenable, undefined, function(value) {
              return _resolve(promise, value);
            }, function(reason) {
              return _reject(promise, reason);
            });
          }
        }

        function handleMaybeThenable(promise, maybeThenable, then$$) {
          if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
            handleOwnThenable(promise, maybeThenable);
          } else {
            if (then$$ === GET_THEN_ERROR) {
              _reject(promise, GET_THEN_ERROR.error);
              GET_THEN_ERROR.error = null;
            } else if (then$$ === undefined) {
              fulfill(promise, maybeThenable);
            } else if (isFunction(then$$)) {
              handleForeignThenable(promise, maybeThenable, then$$);
            } else {
              fulfill(promise, maybeThenable);
            }
          }
        }

        function _resolve(promise, value) {
          if (promise === value) {
            _reject(promise, selfFulfillment());
          } else if (objectOrFunction(value)) {
            handleMaybeThenable(promise, value, getThen(value));
          } else {
            fulfill(promise, value);
          }
        }

        function publishRejection(promise) {
          if (promise._onerror) {
            promise._onerror(promise._result);
          }

          publish(promise);
        }

        function fulfill(promise, value) {
          if (promise._state !== PENDING) {
            return;
          }

          promise._result = value;
          promise._state = FULFILLED;

          if (promise._subscribers.length !== 0) {
            asap(publish, promise);
          }
        }

        function _reject(promise, reason) {
          if (promise._state !== PENDING) {
            return;
          }
          promise._state = REJECTED;
          promise._result = reason;

          asap(publishRejection, promise);
        }

        function subscribe(parent, child, onFulfillment, onRejection) {
          var _subscribers = parent._subscribers;
          var length = _subscribers.length;

          parent._onerror = null;

          _subscribers[length] = child;
          _subscribers[length + FULFILLED] = onFulfillment;
          _subscribers[length + REJECTED] = onRejection;

          if (length === 0 && parent._state) {
            asap(publish, parent);
          }
        }

        function publish(promise) {
          var subscribers = promise._subscribers;
          var settled = promise._state;

          if (subscribers.length === 0) {
            return;
          }

          var child = undefined,
            callback = undefined,
            detail = promise._result;

          for (var i = 0; i < subscribers.length; i += 3) {
            child = subscribers[i];
            callback = subscribers[i + settled];

            if (child) {
              invokeCallback(settled, child, callback, detail);
            } else {
              callback(detail);
            }
          }

          promise._subscribers.length = 0;
        }

        function ErrorObject() {
          this.error = null;
        }

        var TRY_CATCH_ERROR = new ErrorObject();

        function tryCatch(callback, detail) {
          try {
            return callback(detail);
          } catch (e) {
            TRY_CATCH_ERROR.error = e;
            return TRY_CATCH_ERROR;
          }
        }

        function invokeCallback(settled, promise, callback, detail) {
          var hasCallback = isFunction(callback),
            value = undefined,
            error = undefined,
            succeeded = undefined,
            failed = undefined;

          if (hasCallback) {
            value = tryCatch(callback, detail);

            if (value === TRY_CATCH_ERROR) {
              failed = true;
              error = value.error;
              value.error = null;
            } else {
              succeeded = true;
            }

            if (promise === value) {
              _reject(promise, cannotReturnOwn());
              return;
            }
          } else {
            value = detail;
            succeeded = true;
          }

          if (promise._state !== PENDING) {
            // noop
          } else if (hasCallback && succeeded) {
            _resolve(promise, value);
          } else if (failed) {
            _reject(promise, error);
          } else if (settled === FULFILLED) {
            fulfill(promise, value);
          } else if (settled === REJECTED) {
            _reject(promise, value);
          }
        }

        function initializePromise(promise, resolver) {
          try {
            resolver(function resolvePromise(value) {
              _resolve(promise, value);
            }, function rejectPromise(reason) {
              _reject(promise, reason);
            });
          } catch (e) {
            _reject(promise, e);
          }
        }

        var id = 0;

        function nextId() {
          return id++;
        }

        function makePromise(promise) {
          promise[PROMISE_ID] = id++;
          promise._state = undefined;
          promise._result = undefined;
          promise._subscribers = [];
        }

        function Enumerator(Constructor, input) {
          this._instanceConstructor = Constructor;
          this.promise = new Constructor(noop);

          if (!this.promise[PROMISE_ID]) {
            makePromise(this.promise);
          }

          if (isArray(input)) {
            this._input = input;
            this.length = input.length;
            this._remaining = input.length;

            this._result = new Array(this.length);

            if (this.length === 0) {
              fulfill(this.promise, this._result);
            } else {
              this.length = this.length || 0;
              this._enumerate();
              if (this._remaining === 0) {
                fulfill(this.promise, this._result);
              }
            }
          } else {
            _reject(this.promise, validationError());
          }
        }

        function validationError() {
          return new Error('Array Methods must be provided an Array');
        };

        Enumerator.prototype._enumerate = function() {
          var length = this.length;
          var _input = this._input;

          for (var i = 0; this._state === PENDING && i < length; i++) {
            this._eachEntry(_input[i], i);
          }
        };

        Enumerator.prototype._eachEntry = function(entry, i) {
          var c = this._instanceConstructor;
          var resolve$$ = c.resolve;

          if (resolve$$ === resolve) {
            var _then = getThen(entry);

            if (_then === then && entry._state !== PENDING) {
              this._settledAt(entry._state, i, entry._result);
            } else if (typeof _then !== 'function') {
              this._remaining--;
              this._result[i] = entry;
            } else if (c === Promise) {
              var promise = new c(noop);
              handleMaybeThenable(promise, entry, _then);
              this._willSettleAt(promise, i);
            } else {
              this._willSettleAt(new c(function(resolve$$) {
                return resolve$$(entry);
              }), i);
            }
          } else {
            this._willSettleAt(resolve$$(entry), i);
          }
        };

        Enumerator.prototype._settledAt = function(state, i, value) {
          var promise = this.promise;

          if (promise._state === PENDING) {
            this._remaining--;

            if (state === REJECTED) {
              _reject(promise, value);
            } else {
              this._result[i] = value;
            }
          }

          if (this._remaining === 0) {
            fulfill(promise, this._result);
          }
        };

        Enumerator.prototype._willSettleAt = function(promise, i) {
          var enumerator = this;

          subscribe(promise, undefined, function(value) {
            return enumerator._settledAt(FULFILLED, i, value);
          }, function(reason) {
            return enumerator._settledAt(REJECTED, i, reason);
          });
        };

        /**
          `Promise.all` accepts an array of promises, and returns a new promise which
          is fulfilled with an array of fulfillment values for the passed promises, or
          rejected with the reason of the first passed promise to be rejected. It casts all
          elements of the passed iterable to promises as it runs this algorithm.
	
          Example:
	
          ```javascript
          let promise1 = resolve(1);
          let promise2 = resolve(2);
          let promise3 = resolve(3);
          let promises = [ promise1, promise2, promise3 ];
	
          Promise.all(promises).then(function(array){
            // The array here would be [ 1, 2, 3 ];
          });
          ```
	
          If any of the `promises` given to `all` are rejected, the first promise
          that is rejected will be given as an argument to the returned promises's
          rejection handler. For example:
	
          Example:
	
          ```javascript
          let promise1 = resolve(1);
          let promise2 = reject(new Error("2"));
          let promise3 = reject(new Error("3"));
          let promises = [ promise1, promise2, promise3 ];
	
          Promise.all(promises).then(function(array){
            // Code here never runs because there are rejected promises!
          }, function(error) {
            // error.message === "2"
          });
          ```
	
          @method all
          @static
          @param {Array} entries array of promises
          @param {String} label optional string for labeling the promise.
          Useful for tooling.
          @return {Promise} promise that is fulfilled when all `promises` have been
          fulfilled, or rejected if any of them become rejected.
          @static
        */
        function all(entries) {
          return new Enumerator(this, entries).promise;
        }

        /**
          `Promise.race` returns a new promise which is settled in the same way as the
          first passed promise to settle.
	
          Example:
	
          ```javascript
          let promise1 = new Promise(function(resolve, reject){
            setTimeout(function(){
              resolve('promise 1');
            }, 200);
          });
	
          let promise2 = new Promise(function(resolve, reject){
            setTimeout(function(){
              resolve('promise 2');
            }, 100);
          });
	
          Promise.race([promise1, promise2]).then(function(result){
            // result === 'promise 2' because it was resolved before promise1
            // was resolved.
          });
          ```
	
          `Promise.race` is deterministic in that only the state of the first
          settled promise matters. For example, even if other promises given to the
          `promises` array argument are resolved, but the first settled promise has
          become rejected before the other promises became fulfilled, the returned
          promise will become rejected:
	
          ```javascript
          let promise1 = new Promise(function(resolve, reject){
            setTimeout(function(){
              resolve('promise 1');
            }, 200);
          });
	
          let promise2 = new Promise(function(resolve, reject){
            setTimeout(function(){
              reject(new Error('promise 2'));
            }, 100);
          });
	
          Promise.race([promise1, promise2]).then(function(result){
            // Code here never runs
          }, function(reason){
            // reason.message === 'promise 2' because promise 2 became rejected before
            // promise 1 became fulfilled
          });
          ```
	
          An example real-world use case is implementing timeouts:
	
          ```javascript
          Promise.race([ajax('foo.json'), timeout(5000)])
          ```
	
          @method race
          @static
          @param {Array} promises array of promises to observe
          Useful for tooling.
          @return {Promise} a promise which settles in the same way as the first passed
          promise to settle.
        */
        function race(entries) {
          /*jshint validthis:true */
          var Constructor = this;

          if (!isArray(entries)) {
            return new Constructor(function(_, reject) {
              return reject(new TypeError('You must pass an array to race.'));
            });
          } else {
            return new Constructor(function(resolve, reject) {
              var length = entries.length;
              for (var i = 0; i < length; i++) {
                Constructor.resolve(entries[i]).then(resolve, reject);
              }
            });
          }
        }

        /**
          `Promise.reject` returns a promise rejected with the passed `reason`.
          It is shorthand for the following:
	
          ```javascript
          let promise = new Promise(function(resolve, reject){
            reject(new Error('WHOOPS'));
          });
	
          promise.then(function(value){
            // Code here doesn't run because the promise is rejected!
          }, function(reason){
            // reason.message === 'WHOOPS'
          });
          ```
	
          Instead of writing the above, your code now simply becomes the following:
	
          ```javascript
          let promise = Promise.reject(new Error('WHOOPS'));
	
          promise.then(function(value){
            // Code here doesn't run because the promise is rejected!
          }, function(reason){
            // reason.message === 'WHOOPS'
          });
          ```
	
          @method reject
          @static
          @param {Any} reason value that the returned promise will be rejected with.
          Useful for tooling.
          @return {Promise} a promise rejected with the given `reason`.
        */
        function reject(reason) {
          /*jshint validthis:true */
          var Constructor = this;
          var promise = new Constructor(noop);
          _reject(promise, reason);
          return promise;
        }

        function needsResolver() {
          throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
        }

        function needsNew() {
          throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
        }

        /**
          Promise objects represent the eventual result of an asynchronous operation. The
          primary way of interacting with a promise is through its `then` method, which
          registers callbacks to receive either a promise's eventual value or the reason
          why the promise cannot be fulfilled.
	
          Terminology
          -----------
	
          - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
          - `thenable` is an object or function that defines a `then` method.
          - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
          - `exception` is a value that is thrown using the throw statement.
          - `reason` is a value that indicates why a promise was rejected.
          - `settled` the final resting state of a promise, fulfilled or rejected.
	
          A promise can be in one of three states: pending, fulfilled, or rejected.
	
          Promises that are fulfilled have a fulfillment value and are in the fulfilled
          state.  Promises that are rejected have a rejection reason and are in the
          rejected state.  A fulfillment value is never a thenable.
	
          Promises can also be said to *resolve* a value.  If this value is also a
          promise, then the original promise's settled state will match the value's
          settled state.  So a promise that *resolves* a promise that rejects will
          itself reject, and a promise that *resolves* a promise that fulfills will
          itself fulfill.
	
	
          Basic Usage:
          ------------
	
          ```js
          let promise = new Promise(function(resolve, reject) {
            // on success
            resolve(value);
	
            // on failure
            reject(reason);
          });
	
          promise.then(function(value) {
            // on fulfillment
          }, function(reason) {
            // on rejection
          });
          ```
	
          Advanced Usage:
          ---------------
	
          Promises shine when abstracting away asynchronous interactions such as
          `XMLHttpRequest`s.
	
          ```js
          function getJSON(url) {
            return new Promise(function(resolve, reject){
              let xhr = new XMLHttpRequest();
	
              xhr.open('GET', url);
              xhr.onreadystatechange = handler;
              xhr.responseType = 'json';
              xhr.setRequestHeader('Accept', 'application/json');
              xhr.send();
	
              function handler() {
                if (this.readyState === this.DONE) {
                  if (this.status === 200) {
                    resolve(this.response);
                  } else {
                    reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
                  }
                }
              };
            });
          }
	
          getJSON('/posts.json').then(function(json) {
            // on fulfillment
          }, function(reason) {
            // on rejection
          });
          ```
	
          Unlike callbacks, promises are great composable primitives.
	
          ```js
          Promise.all([
            getJSON('/posts'),
            getJSON('/comments')
          ]).then(function(values){
            values[0] // => postsJSON
            values[1] // => commentsJSON
	
            return values;
          });
          ```
	
          @class Promise
          @param {function} resolver
          Useful for tooling.
          @constructor
        */
        function Promise(resolver) {
          this[PROMISE_ID] = nextId();
          this._result = this._state = undefined;
          this._subscribers = [];

          if (noop !== resolver) {
            typeof resolver !== 'function' && needsResolver();
            this instanceof Promise ? initializePromise(this, resolver) : needsNew();
          }
        }

        Promise.all = all;
        Promise.race = race;
        Promise.resolve = resolve;
        Promise.reject = reject;
        Promise._setScheduler = setScheduler;
        Promise._setAsap = setAsap;
        Promise._asap = asap;

        Promise.prototype = {
          constructor: Promise,

          /**
            The primary way of interacting with a promise is through its `then` method,
            which registers callbacks to receive either a promise's eventual value or the
            reason why the promise cannot be fulfilled.
	  
            ```js
            findUser().then(function(user){
              // user is available
            }, function(reason){
              // user is unavailable, and you are given the reason why
            });
            ```
	  
            Chaining
            --------
	  
            The return value of `then` is itself a promise.  This second, 'downstream'
            promise is resolved with the return value of the first promise's fulfillment
            or rejection handler, or rejected if the handler throws an exception.
	  
            ```js
            findUser().then(function (user) {
              return user.name;
            }, function (reason) {
              return 'default name';
            }).then(function (userName) {
              // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
              // will be `'default name'`
            });
	  
            findUser().then(function (user) {
              throw new Error('Found user, but still unhappy');
            }, function (reason) {
              throw new Error('`findUser` rejected and we're unhappy');
            }).then(function (value) {
              // never reached
            }, function (reason) {
              // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
              // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
            });
            ```
            If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	  
            ```js
            findUser().then(function (user) {
              throw new PedagogicalException('Upstream error');
            }).then(function (value) {
              // never reached
            }).then(function (value) {
              // never reached
            }, function (reason) {
              // The `PedgagocialException` is propagated all the way down to here
            });
            ```
	  
            Assimilation
            ------------
	  
            Sometimes the value you want to propagate to a downstream promise can only be
            retrieved asynchronously. This can be achieved by returning a promise in the
            fulfillment or rejection handler. The downstream promise will then be pending
            until the returned promise is settled. This is called *assimilation*.
	  
            ```js
            findUser().then(function (user) {
              return findCommentsByAuthor(user);
            }).then(function (comments) {
              // The user's comments are now available
            });
            ```
	  
            If the assimliated promise rejects, then the downstream promise will also reject.
	  
            ```js
            findUser().then(function (user) {
              return findCommentsByAuthor(user);
            }).then(function (comments) {
              // If `findCommentsByAuthor` fulfills, we'll have the value here
            }, function (reason) {
              // If `findCommentsByAuthor` rejects, we'll have the reason here
            });
            ```
	  
            Simple Example
            --------------
	  
            Synchronous Example
	  
            ```javascript
            let result;
	  
            try {
              result = findResult();
              // success
            } catch(reason) {
              // failure
            }
            ```
	  
            Errback Example
	  
            ```js
            findResult(function(result, err){
              if (err) {
                // failure
              } else {
                // success
              }
            });
            ```
	  
            Promise Example;
	  
            ```javascript
            findResult().then(function(result){
              // success
            }, function(reason){
              // failure
            });
            ```
	  
            Advanced Example
            --------------
	  
            Synchronous Example
	  
            ```javascript
            let author, books;
	  
            try {
              author = findAuthor();
              books  = findBooksByAuthor(author);
              // success
            } catch(reason) {
              // failure
            }
            ```
	  
            Errback Example
	  
            ```js
	  
            function foundBooks(books) {
	  
            }
	  
            function failure(reason) {
	  
            }
	  
            findAuthor(function(author, err){
              if (err) {
                failure(err);
                // failure
              } else {
                try {
                  findBoooksByAuthor(author, function(books, err) {
                    if (err) {
                      failure(err);
                    } else {
                      try {
                        foundBooks(books);
                      } catch(reason) {
                        failure(reason);
                      }
                    }
                  });
                } catch(error) {
                  failure(err);
                }
                // success
              }
            });
            ```
	  
            Promise Example;
	  
            ```javascript
            findAuthor().
              then(findBooksByAuthor).
              then(function(books){
                // found books
            }).catch(function(reason){
              // something went wrong
            });
            ```
	  
            @method then
            @param {Function} onFulfilled
            @param {Function} onRejected
            Useful for tooling.
            @return {Promise}
          */
          then: then,

          /**
            `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
            as the catch block of a try/catch statement.
	  
            ```js
            function findAuthor(){
              throw new Error('couldn't find that author');
            }
	  
            // synchronous
            try {
              findAuthor();
            } catch(reason) {
              // something went wrong
            }
	  
            // async with promises
            findAuthor().catch(function(reason){
              // something went wrong
            });
            ```
	  
            @method catch
            @param {Function} onRejection
            Useful for tooling.
            @return {Promise}
          */
          'catch': function _catch(onRejection) {
            return this.then(null, onRejection);
          }
        };

        function polyfill() {
          var local = undefined;

          if (typeof global !== 'undefined') {
            local = global;
          } else if (typeof self !== 'undefined') {
            local = self;
          } else {
            try {
              local = Function('return this')();
            } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
            }
          }

          var P = local.Promise;

          if (P) {
            var promiseToString = null;
            try {
              promiseToString = Object.prototype.toString.call(P.resolve());
            } catch (e) {
              // silently ignored
            }

            if (promiseToString === '[object Promise]' && !P.cast) {
              return;
            }
          }

          local.Promise = Promise;
        }

        // Strange compat..
        Promise.polyfill = polyfill;
        Promise.Promise = Promise;

        return Promise;

      })));
      //# sourceMappingURL=es6-promise.map

      /* WEBPACK VAR INJECTION */
    }.call(exports, __webpack_require__(68), (function() {
      return this;
    }())))

    /***/
  },

  /***/
  68:
  /***/
    function(module, exports) {

    // shim for using process in browser
    var process = module.exports = {};

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
    }

    function defaultClearTimeout() {
      throw new Error('clearTimeout has not been defined');
    }
    (function() {
      try {
        if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    }())

    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0);
        }
      }


    }

    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
          // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker);
        }
      }



    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
      if (!draining || !currentQueue) {
        return;
      }
      draining = false;
      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }
      if (queue.length) {
        drainQueue();
      }
    }

    function drainQueue() {
      if (draining) {
        return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run();
          }
        }
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }

    process.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
      }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;

    process.binding = function(name) {
      throw new Error('process.binding is not supported');
    };

    process.cwd = function() {
      return '/'
    };
    process.chdir = function(dir) {
      throw new Error('process.chdir is not supported');
    };
    process.umask = function() {
      return 0;
    };


    /***/
  },

  /***/
  69:
  /***/
    function(module, exports) {

    /* (ignored) */

    /***/
  },

  /***/
  70:
  /***/
    function(module, exports, __webpack_require__) {

    /* WEBPACK VAR INJECTION */
    (function(global) {
      /*!
       * Vue.js v2.1.8
       * (c) 2014-2016 Evan You
       * Released under the MIT License.
       */
      (function(global, factory) {
        true ? module.exports = factory() :
          typeof define === 'function' && define.amd ? define(factory) :
          (global.Vue = factory());
      }(this, (function() {
        'use strict';

        /*  */

        /**
         * Convert a value to a string that is actually rendered.
         */
        function _toString(val) {
          return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)
        }

        /**
         * Convert a input value to a number for persistence.
         * If the conversion fails, return original string.
         */
        function toNumber(val) {
          var n = parseFloat(val, 10);
          return (n || n === 0) ? n : val
        }

        /**
         * Make a map and return a function for checking if a key
         * is in that map.
         */
        function makeMap(
          str,
          expectsLowerCase
        ) {
          var map = Object.create(null);
          var list = str.split(',');
          for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
          }
          return expectsLowerCase ? function(val) {
            return map[val.toLowerCase()];
          } : function(val) {
            return map[val];
          }
        }

        /**
         * Check if a tag is a built-in tag.
         */
        var isBuiltInTag = makeMap('slot,component', true);

        /**
         * Remove an item from an array
         */
        function remove$1(arr, item) {
          if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) {
              return arr.splice(index, 1)
            }
          }
        }

        /**
         * Check whether the object has the property.
         */
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        function hasOwn(obj, key) {
          return hasOwnProperty.call(obj, key)
        }

        /**
         * Check if value is primitive
         */
        function isPrimitive(value) {
          return typeof value === 'string' || typeof value === 'number'
        }

        /**
         * Create a cached version of a pure function.
         */
        function cached(fn) {
          var cache = Object.create(null);
          return (function cachedFn(str) {
            var hit = cache[str];
            return hit || (cache[str] = fn(str))
          })
        }

        /**
         * Camelize a hyphen-delmited string.
         */
        var camelizeRE = /-(\w)/g;
        var camelize = cached(function(str) {
          return str.replace(camelizeRE, function(_, c) {
            return c ? c.toUpperCase() : '';
          })
        });

        /**
         * Capitalize a string.
         */
        var capitalize = cached(function(str) {
          return str.charAt(0).toUpperCase() + str.slice(1)
        });

        /**
         * Hyphenate a camelCase string.
         */
        var hyphenateRE = /([^-])([A-Z])/g;
        var hyphenate = cached(function(str) {
          return str
            .replace(hyphenateRE, '$1-$2')
            .replace(hyphenateRE, '$1-$2')
            .toLowerCase()
        });

        /**
         * Simple bind, faster than native
         */
        function bind$1(fn, ctx) {
          function boundFn(a) {
            var l = arguments.length;
            return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx)
          }
          // record original fn length
          boundFn._length = fn.length;
          return boundFn
        }

        /**
         * Convert an Array-like object to a real Array.
         */
        function toArray(list, start) {
          start = start || 0;
          var i = list.length - start;
          var ret = new Array(i);
          while (i--) {
            ret[i] = list[i + start];
          }
          return ret
        }

        /**
         * Mix properties into target object.
         */
        function extend(to, _from) {
          for (var key in _from) {
            to[key] = _from[key];
          }
          return to
        }

        /**
         * Quick object check - this is primarily used to tell
         * Objects from primitive values when we know the value
         * is a JSON-compliant type.
         */
        function isObject(obj) {
          return obj !== null && typeof obj === 'object'
        }

        /**
         * Strict object type check. Only returns true
         * for plain JavaScript objects.
         */
        var toString = Object.prototype.toString;
        var OBJECT_STRING = '[object Object]';

        function isPlainObject(obj) {
          return toString.call(obj) === OBJECT_STRING
        }

        /**
         * Merge an Array of Objects into a single Object.
         */
        function toObject(arr) {
          var res = {};
          for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
              extend(res, arr[i]);
            }
          }
          return res
        }

        /**
         * Perform no operation.
         */
        function noop() {}

        /**
         * Always return false.
         */
        var no = function() {
          return false;
        };

        /**
         * Return same value
         */
        var identity = function(_) {
          return _;
        };

        /**
         * Generate a static keys string from compiler modules.
         */
        function genStaticKeys(modules) {
          return modules.reduce(function(keys, m) {
            return keys.concat(m.staticKeys || [])
          }, []).join(',')
        }

        /**
         * Check if two values are loosely equal - that is,
         * if they are plain objects, do they have the same shape?
         */
        function looseEqual(a, b) {
          var isObjectA = isObject(a);
          var isObjectB = isObject(b);
          if (isObjectA && isObjectB) {
            return JSON.stringify(a) === JSON.stringify(b)
          } else if (!isObjectA && !isObjectB) {
            return String(a) === String(b)
          } else {
            return false
          }
        }

        function looseIndexOf(arr, val) {
          for (var i = 0; i < arr.length; i++) {
            if (looseEqual(arr[i], val)) {
              return i
            }
          }
          return -1
        }

        /*  */

        var config = {
          /**
           * Option merge strategies (used in core/util/options)
           */
          optionMergeStrategies: Object.create(null),

          /**
           * Whether to suppress warnings.
           */
          silent: false,

          /**
           * Whether to enable devtools
           */
          devtools: "development" !== 'production',

          /**
           * Error handler for watcher errors
           */
          errorHandler: null,

          /**
           * Ignore certain custom elements
           */
          ignoredElements: [],

          /**
           * Custom user key aliases for v-on
           */
          keyCodes: Object.create(null),

          /**
           * Check if a tag is reserved so that it cannot be registered as a
           * component. This is platform-dependent and may be overwritten.
           */
          isReservedTag: no,

          /**
           * Check if a tag is an unknown element.
           * Platform-dependent.
           */
          isUnknownElement: no,

          /**
           * Get the namespace of an element
           */
          getTagNamespace: noop,

          /**
           * Parse the real tag name for the specific platform.
           */
          parsePlatformTagName: identity,

          /**
           * Check if an attribute must be bound using property, e.g. value
           * Platform-dependent.
           */
          mustUseProp: no,

          /**
           * List of asset types that a component can own.
           */
          _assetTypes: [
            'component',
            'directive',
            'filter'
          ],

          /**
           * List of lifecycle hooks.
           */
          _lifecycleHooks: [
            'beforeCreate',
            'created',
            'beforeMount',
            'mounted',
            'beforeUpdate',
            'updated',
            'beforeDestroy',
            'destroyed',
            'activated',
            'deactivated'
          ],

          /**
           * Max circular updates allowed in a scheduler flush cycle.
           */
          _maxUpdateCount: 100
        };

        /*  */

        /**
         * Check if a string starts with $ or _
         */
        function isReserved(str) {
          var c = (str + '').charCodeAt(0);
          return c === 0x24 || c === 0x5F
        }

        /**
         * Define a property.
         */
        function def(obj, key, val, enumerable) {
          Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
          });
        }

        /**
         * Parse simple path.
         */
        var bailRE = /[^\w.$]/;

        function parsePath(path) {
          if (bailRE.test(path)) {
            return
          } else {
            var segments = path.split('.');
            return function(obj) {
              for (var i = 0; i < segments.length; i++) {
                if (!obj) {
                  return
                }
                obj = obj[segments[i]];
              }
              return obj
            }
          }
        }

        /*  */
        /* globals MutationObserver */

        // can we use __proto__?
        var hasProto = '__proto__' in {};

        // Browser environment sniffing
        var inBrowser = typeof window !== 'undefined';
        var UA = inBrowser && window.navigator.userAgent.toLowerCase();
        var isIE = UA && /msie|trident/.test(UA);
        var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
        var isEdge = UA && UA.indexOf('edge/') > 0;
        var isAndroid = UA && UA.indexOf('android') > 0;
        var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

        // this needs to be lazy-evaled because vue may be required before
        // vue-server-renderer can set VUE_ENV
        var _isServer;
        var isServerRendering = function() {
          if (_isServer === undefined) {
            /* istanbul ignore if */
            if (!inBrowser && typeof global !== 'undefined') {
              // detect presence of vue-server-renderer and avoid
              // Webpack shimming the process
              _isServer = global['process'].env.VUE_ENV === 'server';
            } else {
              _isServer = false;
            }
          }
          return _isServer
        };

        // detect devtools
        var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

        /* istanbul ignore next */
        function isNative(Ctor) {
          return /native code/.test(Ctor.toString())
        }

        /**
         * Defer a task to execute it asynchronously.
         */
        var nextTick = (function() {
          var callbacks = [];
          var pending = false;
          var timerFunc;

          function nextTickHandler() {
            pending = false;
            var copies = callbacks.slice(0);
            callbacks.length = 0;
            for (var i = 0; i < copies.length; i++) {
              copies[i]();
            }
          }

          // the nextTick behavior leverages the microtask queue, which can be accessed
          // via either native Promise.then or MutationObserver.
          // MutationObserver has wider support, however it is seriously bugged in
          // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
          // completely stops working after triggering a few times... so, if native
          // Promise is available, we will use it:
          /* istanbul ignore if */
          if (typeof Promise !== 'undefined' && isNative(Promise)) {
            var p = Promise.resolve();
            var logError = function(err) {
              console.error(err);
            };
            timerFunc = function() {
              p.then(nextTickHandler).catch(logError);
              // in problematic UIWebViews, Promise.then doesn't completely break, but
              // it can get stuck in a weird state where callbacks are pushed into the
              // microtask queue but the queue isn't being flushed, until the browser
              // needs to do some other work, e.g. handle a timer. Therefore we can
              // "force" the microtask queue to be flushed by adding an empty timer.
              if (isIOS) {
                setTimeout(noop);
              }
            };
          } else if (typeof MutationObserver !== 'undefined' && (
              isNative(MutationObserver) ||
              // PhantomJS and iOS 7.x
              MutationObserver.toString() === '[object MutationObserverConstructor]'
            )) {
            // use MutationObserver where native Promise is not available,
            // e.g. PhantomJS IE11, iOS7, Android 4.4
            var counter = 1;
            var observer = new MutationObserver(nextTickHandler);
            var textNode = document.createTextNode(String(counter));
            observer.observe(textNode, {
              characterData: true
            });
            timerFunc = function() {
              counter = (counter + 1) % 2;
              textNode.data = String(counter);
            };
          } else {
            // fallback to setTimeout
            /* istanbul ignore next */
            timerFunc = function() {
              setTimeout(nextTickHandler, 0);
            };
          }

          return function queueNextTick(cb, ctx) {
            var _resolve;
            callbacks.push(function() {
              if (cb) {
                cb.call(ctx);
              }
              if (_resolve) {
                _resolve(ctx);
              }
            });
            if (!pending) {
              pending = true;
              timerFunc();
            }
            if (!cb && typeof Promise !== 'undefined') {
              return new Promise(function(resolve) {
                _resolve = resolve;
              })
            }
          }
        })();

        var _Set;
        /* istanbul ignore if */
        if (typeof Set !== 'undefined' && isNative(Set)) {
          // use native Set when available.
          _Set = Set;
        } else {
          // a non-standard Set polyfill that only works with primitive keys.
          _Set = (function() {
            function Set() {
              this.set = Object.create(null);
            }
            Set.prototype.has = function has(key) {
              return this.set[key] === true
            };
            Set.prototype.add = function add(key) {
              this.set[key] = true;
            };
            Set.prototype.clear = function clear() {
              this.set = Object.create(null);
            };

            return Set;
          }());
        }

        var warn = noop;
        var formatComponentName;

        {
          var hasConsole = typeof console !== 'undefined';

          warn = function(msg, vm) {
            if (hasConsole && (!config.silent)) {
              console.error("[Vue warn]: " + msg + " " + (
                vm ? formatLocation(formatComponentName(vm)) : ''
              ));
            }
          };

          formatComponentName = function(vm) {
            if (vm.$root === vm) {
              return 'root instance'
            }
            var name = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;
            return (
              (name ? ("component <" + name + ">") : "anonymous component") +
              (vm._isVue && vm.$options.__file ? (" at " + (vm.$options.__file)) : '')
            )
          };

          var formatLocation = function(str) {
            if (str === 'anonymous component') {
              str += " - use the \"name\" option for better debugging messages.";
            }
            return ("\n(found in " + str + ")")
          };
        }

        /*  */


        var uid$1 = 0;

        /**
         * A dep is an observable that can have multiple
         * directives subscribing to it.
         */
        var Dep = function Dep() {
          this.id = uid$1++;
          this.subs = [];
        };

        Dep.prototype.addSub = function addSub(sub) {
          this.subs.push(sub);
        };

        Dep.prototype.removeSub = function removeSub(sub) {
          remove$1(this.subs, sub);
        };

        Dep.prototype.depend = function depend() {
          if (Dep.target) {
            Dep.target.addDep(this);
          }
        };

        Dep.prototype.notify = function notify() {
          // stablize the subscriber list first
          var subs = this.subs.slice();
          for (var i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
          }
        };

        // the current target watcher being evaluated.
        // this is globally unique because there could be only one
        // watcher being evaluated at any time.
        Dep.target = null;
        var targetStack = [];

        function pushTarget(_target) {
          if (Dep.target) {
            targetStack.push(Dep.target);
          }
          Dep.target = _target;
        }

        function popTarget() {
          Dep.target = targetStack.pop();
        }

        /*
         * not type checking this file because flow doesn't play well with
         * dynamically accessing methods on Array prototype
         */

        var arrayProto = Array.prototype;
        var arrayMethods = Object.create(arrayProto);
        [
          'push',
          'pop',
          'shift',
          'unshift',
          'splice',
          'sort',
          'reverse'
        ]
        .forEach(function(method) {
          // cache original method
          var original = arrayProto[method];
          def(arrayMethods, method, function mutator() {
            var arguments$1 = arguments;

            // avoid leaking arguments:
            // http://jsperf.com/closure-with-arguments
            var i = arguments.length;
            var args = new Array(i);
            while (i--) {
              args[i] = arguments$1[i];
            }
            var result = original.apply(this, args);
            var ob = this.__ob__;
            var inserted;
            switch (method) {
              case 'push':
                inserted = args;
                break
              case 'unshift':
                inserted = args;
                break
              case 'splice':
                inserted = args.slice(2);
                break
            }
            if (inserted) {
              ob.observeArray(inserted);
            }
            // notify change
            ob.dep.notify();
            return result
          });
        });

        /*  */

        var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

        /**
         * By default, when a reactive property is set, the new value is
         * also converted to become reactive. However when passing down props,
         * we don't want to force conversion because the value may be a nested value
         * under a frozen data structure. Converting it would defeat the optimization.
         */
        var observerState = {
          shouldConvert: true,
          isSettingProps: false
        };

        /**
         * Observer class that are attached to each observed
         * object. Once attached, the observer converts target
         * object's property keys into getter/setters that
         * collect dependencies and dispatches updates.
         */
        var Observer = function Observer(value) {
          this.value = value;
          this.dep = new Dep();
          this.vmCount = 0;
          def(value, '__ob__', this);
          if (Array.isArray(value)) {
            var augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
            this.observeArray(value);
          } else {
            this.walk(value);
          }
        };

        /**
         * Walk through each property and convert them into
         * getter/setters. This method should only be called when
         * value type is Object.
         */
        Observer.prototype.walk = function walk(obj) {
          var keys = Object.keys(obj);
          for (var i = 0; i < keys.length; i++) {
            defineReactive$$1(obj, keys[i], obj[keys[i]]);
          }
        };

        /**
         * Observe a list of Array items.
         */
        Observer.prototype.observeArray = function observeArray(items) {
          for (var i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
          }
        };

        // helpers

        /**
         * Augment an target Object or Array by intercepting
         * the prototype chain using __proto__
         */
        function protoAugment(target, src) {
          /* eslint-disable no-proto */
          target.__proto__ = src;
          /* eslint-enable no-proto */
        }

        /**
         * Augment an target Object or Array by defining
         * hidden properties.
         */
        /* istanbul ignore next */
        function copyAugment(target, src, keys) {
          for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            def(target, key, src[key]);
          }
        }

        /**
         * Attempt to create an observer instance for a value,
         * returns the new observer if successfully observed,
         * or the existing observer if the value already has one.
         */
        function observe(value, asRootData) {
          if (!isObject(value)) {
            return
          }
          var ob;
          if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
            ob = value.__ob__;
          } else if (
            observerState.shouldConvert &&
            !isServerRendering() &&
            (Array.isArray(value) || isPlainObject(value)) &&
            Object.isExtensible(value) &&
            !value._isVue
          ) {
            ob = new Observer(value);
          }
          if (asRootData && ob) {
            ob.vmCount++;
          }
          return ob
        }

        /**
         * Define a reactive property on an Object.
         */
        function defineReactive$$1(
          obj,
          key,
          val,
          customSetter
        ) {
          var dep = new Dep();

          var property = Object.getOwnPropertyDescriptor(obj, key);
          if (property && property.configurable === false) {
            return
          }

          // cater for pre-defined getter/setters
          var getter = property && property.get;
          var setter = property && property.set;

          var childOb = observe(val);
          Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
              var value = getter ? getter.call(obj) : val;
              if (Dep.target) {
                dep.depend();
                if (childOb) {
                  childOb.dep.depend();
                }
                if (Array.isArray(value)) {
                  dependArray(value);
                }
              }
              return value
            },
            set: function reactiveSetter(newVal) {
              var value = getter ? getter.call(obj) : val;
              /* eslint-disable no-self-compare */
              if (newVal === value || (newVal !== newVal && value !== value)) {
                return
              }
              /* eslint-enable no-self-compare */
              if ("development" !== 'production' && customSetter) {
                customSetter();
              }
              if (setter) {
                setter.call(obj, newVal);
              } else {
                val = newVal;
              }
              childOb = observe(newVal);
              dep.notify();
            }
          });
        }

        /**
         * Set a property on an object. Adds the new property and
         * triggers change notification if the property doesn't
         * already exist.
         */
        function set$1(obj, key, val) {
          if (Array.isArray(obj)) {
            obj.length = Math.max(obj.length, key);
            obj.splice(key, 1, val);
            return val
          }
          if (hasOwn(obj, key)) {
            obj[key] = val;
            return
          }
          var ob = obj.__ob__;
          if (obj._isVue || (ob && ob.vmCount)) {
            "development" !== 'production' && warn(
              'Avoid adding reactive properties to a Vue instance or its root $data ' +
              'at runtime - declare it upfront in the data option.'
            );
            return
          }
          if (!ob) {
            obj[key] = val;
            return
          }
          defineReactive$$1(ob.value, key, val);
          ob.dep.notify();
          return val
        }

        /**
         * Delete a property and trigger change if necessary.
         */
        function del(obj, key) {
          var ob = obj.__ob__;
          if (obj._isVue || (ob && ob.vmCount)) {
            "development" !== 'production' && warn(
              'Avoid deleting properties on a Vue instance or its root $data ' +
              '- just set it to null.'
            );
            return
          }
          if (!hasOwn(obj, key)) {
            return
          }
          delete obj[key];
          if (!ob) {
            return
          }
          ob.dep.notify();
        }

        /**
         * Collect dependencies on array elements when the array is touched, since
         * we cannot intercept array element access like property getters.
         */
        function dependArray(value) {
          for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
            e = value[i];
            e && e.__ob__ && e.__ob__.dep.depend();
            if (Array.isArray(e)) {
              dependArray(e);
            }
          }
        }

        /*  */

        /**
         * Option overwriting strategies are functions that handle
         * how to merge a parent option value and a child option
         * value into the final value.
         */
        var strats = config.optionMergeStrategies;

        /**
         * Options with restrictions
         */
        {
          strats.el = strats.propsData = function(parent, child, vm, key) {
            if (!vm) {
              warn(
                "option \"" + key + "\" can only be used during instance " +
                'creation with the `new` keyword.'
              );
            }
            return defaultStrat(parent, child)
          };
        }

        /**
         * Helper that recursively merges two data objects together.
         */
        function mergeData(to, from) {
          if (!from) {
            return to
          }
          var key, toVal, fromVal;
          var keys = Object.keys(from);
          for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            toVal = to[key];
            fromVal = from[key];
            if (!hasOwn(to, key)) {
              set$1(to, key, fromVal);
            } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
              mergeData(toVal, fromVal);
            }
          }
          return to
        }

        /**
         * Data
         */
        strats.data = function(
          parentVal,
          childVal,
          vm
        ) {
          if (!vm) {
            // in a Vue.extend merge, both should be functions
            if (!childVal) {
              return parentVal
            }
            if (typeof childVal !== 'function') {
              "development" !== 'production' && warn(
                'The "data" option should be a function ' +
                'that returns a per-instance value in component ' +
                'definitions.',
                vm
              );
              return parentVal
            }
            if (!parentVal) {
              return childVal
            }
            // when parentVal & childVal are both present,
            // we need to return a function that returns the
            // merged result of both functions... no need to
            // check if parentVal is a function here because
            // it has to be a function to pass previous merges.
            return function mergedDataFn() {
              return mergeData(
                childVal.call(this),
                parentVal.call(this)
              )
            }
          } else if (parentVal || childVal) {
            return function mergedInstanceDataFn() {
              // instance merge
              var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
              var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
              if (instanceData) {
                return mergeData(instanceData, defaultData)
              } else {
                return defaultData
              }
            }
          }
        };

        /**
         * Hooks and param attributes are merged as arrays.
         */
        function mergeHook(
          parentVal,
          childVal
        ) {
          return childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal
        }

        config._lifecycleHooks.forEach(function(hook) {
          strats[hook] = mergeHook;
        });

        /**
         * Assets
         *
         * When a vm is present (instance creation), we need to do
         * a three-way merge between constructor options, instance
         * options and parent options.
         */
        function mergeAssets(parentVal, childVal) {
          var res = Object.create(parentVal || null);
          return childVal ? extend(res, childVal) : res
        }

        config._assetTypes.forEach(function(type) {
          strats[type + 's'] = mergeAssets;
        });

        /**
         * Watchers.
         *
         * Watchers hashes should not overwrite one
         * another, so we merge them as arrays.
         */
        strats.watch = function(parentVal, childVal) {
          /* istanbul ignore if */
          if (!childVal) {
            return parentVal
          }
          if (!parentVal) {
            return childVal
          }
          var ret = {};
          extend(ret, parentVal);
          for (var key in childVal) {
            var parent = ret[key];
            var child = childVal[key];
            if (parent && !Array.isArray(parent)) {
              parent = [parent];
            }
            ret[key] = parent ? parent.concat(child) : [child];
          }
          return ret
        };

        /**
         * Other object hashes.
         */
        strats.props =
          strats.methods =
          strats.computed = function(parentVal, childVal) {
            if (!childVal) {
              return parentVal
            }
            if (!parentVal) {
              return childVal
            }
            var ret = Object.create(null);
            extend(ret, parentVal);
            extend(ret, childVal);
            return ret
          };

        /**
         * Default strategy.
         */
        var defaultStrat = function(parentVal, childVal) {
          return childVal === undefined ? parentVal : childVal
        };

        /**
         * Validate component names
         */
        function checkComponents(options) {
          for (var key in options.components) {
            var lower = key.toLowerCase();
            if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
              warn(
                'Do not use built-in or reserved HTML elements as component ' +
                'id: ' + key
              );
            }
          }
        }

        /**
         * Ensure all props option syntax are normalized into the
         * Object-based format.
         */
        function normalizeProps(options) {
          var props = options.props;
          if (!props) {
            return
          }
          var res = {};
          var i, val, name;
          if (Array.isArray(props)) {
            i = props.length;
            while (i--) {
              val = props[i];
              if (typeof val === 'string') {
                name = camelize(val);
                res[name] = {
                  type: null
                };
              } else {
                warn('props must be strings when using array syntax.');
              }
            }
          } else if (isPlainObject(props)) {
            for (var key in props) {
              val = props[key];
              name = camelize(key);
              res[name] = isPlainObject(val) ? val : {
                type: val
              };
            }
          }
          options.props = res;
        }

        /**
         * Normalize raw function directives into object format.
         */
        function normalizeDirectives(options) {
          var dirs = options.directives;
          if (dirs) {
            for (var key in dirs) {
              var def = dirs[key];
              if (typeof def === 'function') {
                dirs[key] = {
                  bind: def,
                  update: def
                };
              }
            }
          }
        }

        /**
         * Merge two option objects into a new one.
         * Core utility used in both instantiation and inheritance.
         */
        function mergeOptions(
          parent,
          child,
          vm
        ) {
          {
            checkComponents(child);
          }
          normalizeProps(child);
          normalizeDirectives(child);
          var extendsFrom = child.extends;
          if (extendsFrom) {
            parent = typeof extendsFrom === 'function' ? mergeOptions(parent, extendsFrom.options, vm) : mergeOptions(parent, extendsFrom, vm);
          }
          if (child.mixins) {
            for (var i = 0, l = child.mixins.length; i < l; i++) {
              var mixin = child.mixins[i];
              if (mixin.prototype instanceof Vue$3) {
                mixin = mixin.options;
              }
              parent = mergeOptions(parent, mixin, vm);
            }
          }
          var options = {};
          var key;
          for (key in parent) {
            mergeField(key);
          }
          for (key in child) {
            if (!hasOwn(parent, key)) {
              mergeField(key);
            }
          }

          function mergeField(key) {
            var strat = strats[key] || defaultStrat;
            options[key] = strat(parent[key], child[key], vm, key);
          }
          return options
        }

        /**
         * Resolve an asset.
         * This function is used because child instances need access
         * to assets defined in its ancestor chain.
         */
        function resolveAsset(
          options,
          type,
          id,
          warnMissing
        ) {
          /* istanbul ignore if */
          if (typeof id !== 'string') {
            return
          }
          var assets = options[type];
          // check local registration variations first
          if (hasOwn(assets, id)) {
            return assets[id]
          }
          var camelizedId = camelize(id);
          if (hasOwn(assets, camelizedId)) {
            return assets[camelizedId]
          }
          var PascalCaseId = capitalize(camelizedId);
          if (hasOwn(assets, PascalCaseId)) {
            return assets[PascalCaseId]
          }
          // fallback to prototype chain
          var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
          if ("development" !== 'production' && warnMissing && !res) {
            warn(
              'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
              options
            );
          }
          return res
        }

        /*  */

        function validateProp(
          key,
          propOptions,
          propsData,
          vm
        ) {
          var prop = propOptions[key];
          var absent = !hasOwn(propsData, key);
          var value = propsData[key];
          // handle boolean props
          if (isType(Boolean, prop.type)) {
            if (absent && !hasOwn(prop, 'default')) {
              value = false;
            } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
              value = true;
            }
          }
          // check default value
          if (value === undefined) {
            value = getPropDefaultValue(vm, prop, key);
            // since the default value is a fresh copy,
            // make sure to observe it.
            var prevShouldConvert = observerState.shouldConvert;
            observerState.shouldConvert = true;
            observe(value);
            observerState.shouldConvert = prevShouldConvert;
          } {
            assertProp(prop, key, value, vm, absent);
          }
          return value
        }

        /**
         * Get the default value of a prop.
         */
        function getPropDefaultValue(vm, prop, key) {
          // no default, return undefined
          if (!hasOwn(prop, 'default')) {
            return undefined
          }
          var def = prop.default;
          // warn against non-factory defaults for Object & Array
          if (isObject(def)) {
            "development" !== 'production' && warn(
              'Invalid default value for prop "' + key + '": ' +
              'Props with type Object/Array must use a factory function ' +
              'to return the default value.',
              vm
            );
          }
          // the raw prop value was also undefined from previous render,
          // return previous default value to avoid unnecessary watcher trigger
          if (vm && vm.$options.propsData &&
            vm.$options.propsData[key] === undefined &&
            vm[key] !== undefined) {
            return vm[key]
          }
          // call factory function for non-Function types
          return typeof def === 'function' && prop.type !== Function ? def.call(vm) : def
        }

        /**
         * Assert whether a prop is valid.
         */
        function assertProp(
          prop,
          name,
          value,
          vm,
          absent
        ) {
          if (prop.required && absent) {
            warn(
              'Missing required prop: "' + name + '"',
              vm
            );
            return
          }
          if (value == null && !prop.required) {
            return
          }
          var type = prop.type;
          var valid = !type || type === true;
          var expectedTypes = [];
          if (type) {
            if (!Array.isArray(type)) {
              type = [type];
            }
            for (var i = 0; i < type.length && !valid; i++) {
              var assertedType = assertType(value, type[i]);
              expectedTypes.push(assertedType.expectedType || '');
              valid = assertedType.valid;
            }
          }
          if (!valid) {
            warn(
              'Invalid prop: type check failed for prop "' + name + '".' +
              ' Expected ' + expectedTypes.map(capitalize).join(', ') +
              ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
              vm
            );
            return
          }
          var validator = prop.validator;
          if (validator) {
            if (!validator(value)) {
              warn(
                'Invalid prop: custom validator check failed for prop "' + name + '".',
                vm
              );
            }
          }
        }

        /**
         * Assert the type of a value
         */
        function assertType(value, type) {
          var valid;
          var expectedType = getType(type);
          if (expectedType === 'String') {
            valid = typeof value === (expectedType = 'string');
          } else if (expectedType === 'Number') {
            valid = typeof value === (expectedType = 'number');
          } else if (expectedType === 'Boolean') {
            valid = typeof value === (expectedType = 'boolean');
          } else if (expectedType === 'Function') {
            valid = typeof value === (expectedType = 'function');
          } else if (expectedType === 'Object') {
            valid = isPlainObject(value);
          } else if (expectedType === 'Array') {
            valid = Array.isArray(value);
          } else {
            valid = value instanceof type;
          }
          return {
            valid: valid,
            expectedType: expectedType
          }
        }

        /**
         * Use function string name to check built-in types,
         * because a simple equality check will fail when running
         * across different vms / iframes.
         */
        function getType(fn) {
          var match = fn && fn.toString().match(/^\s*function (\w+)/);
          return match && match[1]
        }

        function isType(type, fn) {
          if (!Array.isArray(fn)) {
            return getType(fn) === getType(type)
          }
          for (var i = 0, len = fn.length; i < len; i++) {
            if (getType(fn[i]) === getType(type)) {
              return true
            }
          }
          /* istanbul ignore next */
          return false
        }



        var util = Object.freeze({
          defineReactive: defineReactive$$1,
          _toString: _toString,
          toNumber: toNumber,
          makeMap: makeMap,
          isBuiltInTag: isBuiltInTag,
          remove: remove$1,
          hasOwn: hasOwn,
          isPrimitive: isPrimitive,
          cached: cached,
          camelize: camelize,
          capitalize: capitalize,
          hyphenate: hyphenate,
          bind: bind$1,
          toArray: toArray,
          extend: extend,
          isObject: isObject,
          isPlainObject: isPlainObject,
          toObject: toObject,
          noop: noop,
          no: no,
          identity: identity,
          genStaticKeys: genStaticKeys,
          looseEqual: looseEqual,
          looseIndexOf: looseIndexOf,
          isReserved: isReserved,
          def: def,
          parsePath: parsePath,
          hasProto: hasProto,
          inBrowser: inBrowser,
          UA: UA,
          isIE: isIE,
          isIE9: isIE9,
          isEdge: isEdge,
          isAndroid: isAndroid,
          isIOS: isIOS,
          isServerRendering: isServerRendering,
          devtools: devtools,
          nextTick: nextTick,
          get _Set() {
            return _Set;
          },
          mergeOptions: mergeOptions,
          resolveAsset: resolveAsset,
          get warn() {
            return warn;
          },
          get formatComponentName() {
            return formatComponentName;
          },
          validateProp: validateProp
        });

        /* not type checking this file because flow doesn't play well with Proxy */

        var initProxy;

        {
          var allowedGlobals = makeMap(
            'Infinity,undefined,NaN,isFinite,isNaN,' +
            'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
            'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
            'require' // for Webpack/Browserify
          );

          var warnNonPresent = function(target, key) {
            warn(
              "Property or method \"" + key + "\" is not defined on the instance but " +
              "referenced during render. Make sure to declare reactive data " +
              "properties in the data option.",
              target
            );
          };

          var hasProxy =
            typeof Proxy !== 'undefined' &&
            Proxy.toString().match(/native code/);

          if (hasProxy) {
            var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
            config.keyCodes = new Proxy(config.keyCodes, {
              set: function set(target, key, value) {
                if (isBuiltInModifier(key)) {
                  warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
                  return false
                } else {
                  target[key] = value;
                  return true
                }
              }
            });
          }

          var hasHandler = {
            has: function has(target, key) {
              var has = key in target;
              var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
              if (!has && !isAllowed) {
                warnNonPresent(target, key);
              }
              return has || !isAllowed
            }
          };

          var getHandler = {
            get: function get(target, key) {
              if (typeof key === 'string' && !(key in target)) {
                warnNonPresent(target, key);
              }
              return target[key]
            }
          };

          initProxy = function initProxy(vm) {
            if (hasProxy) {
              // determine which proxy handler to use
              var options = vm.$options;
              var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
              vm._renderProxy = new Proxy(vm, handlers);
            } else {
              vm._renderProxy = vm;
            }
          };
        }

        /*  */


        var queue = [];
        var has$1 = {};
        var circular = {};
        var waiting = false;
        var flushing = false;
        var index = 0;

        /**
         * Reset the scheduler's state.
         */
        function resetSchedulerState() {
          queue.length = 0;
          has$1 = {}; {
            circular = {};
          }
          waiting = flushing = false;
        }

        /**
         * Flush both queues and run the watchers.
         */
        function flushSchedulerQueue() {
          flushing = true;

          // Sort queue before flush.
          // This ensures that:
          // 1. Components are updated from parent to child. (because parent is always
          //    created before the child)
          // 2. A component's user watchers are run before its render watcher (because
          //    user watchers are created before the render watcher)
          // 3. If a component is destroyed during a parent component's watcher run,
          //    its watchers can be skipped.
          queue.sort(function(a, b) {
            return a.id - b.id;
          });

          // do not cache length because more watchers might be pushed
          // as we run existing watchers
          for (index = 0; index < queue.length; index++) {
            var watcher = queue[index];
            var id = watcher.id;
            has$1[id] = null;
            watcher.run();
            // in dev build, check and stop circular updates.
            if ("development" !== 'production' && has$1[id] != null) {
              circular[id] = (circular[id] || 0) + 1;
              if (circular[id] > config._maxUpdateCount) {
                warn(
                  'You may have an infinite update loop ' + (
                    watcher.user ? ("in watcher with expression \"" + (watcher.expression) + "\"") : "in a component render function."
                  ),
                  watcher.vm
                );
                break
              }
            }
          }

          // devtool hook
          /* istanbul ignore if */
          if (devtools && config.devtools) {
            devtools.emit('flush');
          }

          resetSchedulerState();
        }

        /**
         * Push a watcher into the watcher queue.
         * Jobs with duplicate IDs will be skipped unless it's
         * pushed when the queue is being flushed.
         */
        function queueWatcher(watcher) {
          var id = watcher.id;
          if (has$1[id] == null) {
            has$1[id] = true;
            if (!flushing) {
              queue.push(watcher);
            } else {
              // if already flushing, splice the watcher based on its id
              // if already past its id, it will be run next immediately.
              var i = queue.length - 1;
              while (i >= 0 && queue[i].id > watcher.id) {
                i--;
              }
              queue.splice(Math.max(i, index) + 1, 0, watcher);
            }
            // queue the flush
            if (!waiting) {
              waiting = true;
              nextTick(flushSchedulerQueue);
            }
          }
        }

        /*  */

        var uid$2 = 0;

        /**
         * A watcher parses an expression, collects dependencies,
         * and fires callback when the expression value changes.
         * This is used for both the $watch() api and directives.
         */
        var Watcher = function Watcher(
          vm,
          expOrFn,
          cb,
          options
        ) {
          this.vm = vm;
          vm._watchers.push(this);
          // options
          if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
          } else {
            this.deep = this.user = this.lazy = this.sync = false;
          }
          this.cb = cb;
          this.id = ++uid$2; // uid for batching
          this.active = true;
          this.dirty = this.lazy; // for lazy watchers
          this.deps = [];
          this.newDeps = [];
          this.depIds = new _Set();
          this.newDepIds = new _Set();
          this.expression = expOrFn.toString();
          // parse expression for getter
          if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
          } else {
            this.getter = parsePath(expOrFn);
            if (!this.getter) {
              this.getter = function() {};
              "development" !== 'production' && warn(
                "Failed watching path: \"" + expOrFn + "\" " +
                'Watcher only accepts simple dot-delimited paths. ' +
                'For full control, use a function instead.',
                vm
              );
            }
          }
          this.value = this.lazy ? undefined : this.get();
        };

        /**
         * Evaluate the getter, and re-collect dependencies.
         */
        Watcher.prototype.get = function get() {
          pushTarget(this);
          var value = this.getter.call(this.vm, this.vm);
          // "touch" every property so they are all tracked as
          // dependencies for deep watching
          if (this.deep) {
            traverse(value);
          }
          popTarget();
          this.cleanupDeps();
          return value
        };

        /**
         * Add a dependency to this directive.
         */
        Watcher.prototype.addDep = function addDep(dep) {
          var id = dep.id;
          if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
              dep.addSub(this);
            }
          }
        };

        /**
         * Clean up for dependency collection.
         */
        Watcher.prototype.cleanupDeps = function cleanupDeps() {
          var this$1 = this;

          var i = this.deps.length;
          while (i--) {
            var dep = this$1.deps[i];
            if (!this$1.newDepIds.has(dep.id)) {
              dep.removeSub(this$1);
            }
          }
          var tmp = this.depIds;
          this.depIds = this.newDepIds;
          this.newDepIds = tmp;
          this.newDepIds.clear();
          tmp = this.deps;
          this.deps = this.newDeps;
          this.newDeps = tmp;
          this.newDeps.length = 0;
        };

        /**
         * Subscriber interface.
         * Will be called when a dependency changes.
         */
        Watcher.prototype.update = function update() {
          /* istanbul ignore else */
          if (this.lazy) {
            this.dirty = true;
          } else if (this.sync) {
            this.run();
          } else {
            queueWatcher(this);
          }
        };

        /**
         * Scheduler job interface.
         * Will be called by the scheduler.
         */
        Watcher.prototype.run = function run() {
          if (this.active) {
            var value = this.get();
            if (
              value !== this.value ||
              // Deep watchers and watchers on Object/Arrays should fire even
              // when the value is the same, because the value may
              // have mutated.
              isObject(value) ||
              this.deep
            ) {
              // set new value
              var oldValue = this.value;
              this.value = value;
              if (this.user) {
                try {
                  this.cb.call(this.vm, value, oldValue);
                } catch (e) {
                  /* istanbul ignore else */
                  if (config.errorHandler) {
                    config.errorHandler.call(null, e, this.vm);
                  } else {
                    "development" !== 'production' && warn(
                      ("Error in watcher \"" + (this.expression) + "\""),
                      this.vm
                    );
                    throw e
                  }
                }
              } else {
                this.cb.call(this.vm, value, oldValue);
              }
            }
          }
        };

        /**
         * Evaluate the value of the watcher.
         * This only gets called for lazy watchers.
         */
        Watcher.prototype.evaluate = function evaluate() {
          this.value = this.get();
          this.dirty = false;
        };

        /**
         * Depend on all deps collected by this watcher.
         */
        Watcher.prototype.depend = function depend() {
          var this$1 = this;

          var i = this.deps.length;
          while (i--) {
            this$1.deps[i].depend();
          }
        };

        /**
         * Remove self from all dependencies' subscriber list.
         */
        Watcher.prototype.teardown = function teardown() {
          var this$1 = this;

          if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed.
            if (!this.vm._isBeingDestroyed) {
              remove$1(this.vm._watchers, this);
            }
            var i = this.deps.length;
            while (i--) {
              this$1.deps[i].removeSub(this$1);
            }
            this.active = false;
          }
        };

        /**
         * Recursively traverse an object to evoke all converted
         * getters, so that every nested property inside the object
         * is collected as a "deep" dependency.
         */
        var seenObjects = new _Set();

        function traverse(val) {
          seenObjects.clear();
          _traverse(val, seenObjects);
        }

        function _traverse(val, seen) {
          var i, keys;
          var isA = Array.isArray(val);
          if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
            return
          }
          if (val.__ob__) {
            var depId = val.__ob__.dep.id;
            if (seen.has(depId)) {
              return
            }
            seen.add(depId);
          }
          if (isA) {
            i = val.length;
            while (i--) {
              _traverse(val[i], seen);
            }
          } else {
            keys = Object.keys(val);
            i = keys.length;
            while (i--) {
              _traverse(val[keys[i]], seen);
            }
          }
        }

        /*  */

        function initState(vm) {
          vm._watchers = [];
          var opts = vm.$options;
          if (opts.props) {
            initProps(vm, opts.props);
          }
          if (opts.methods) {
            initMethods(vm, opts.methods);
          }
          if (opts.data) {
            initData(vm);
          } else {
            observe(vm._data = {}, true /* asRootData */ );
          }
          if (opts.computed) {
            initComputed(vm, opts.computed);
          }
          if (opts.watch) {
            initWatch(vm, opts.watch);
          }
        }

        var isReservedProp = {
          key: 1,
          ref: 1,
          slot: 1
        };

        function initProps(vm, props) {
          var propsData = vm.$options.propsData || {};
          var keys = vm.$options._propKeys = Object.keys(props);
          var isRoot = !vm.$parent;
          // root instance props should be converted
          observerState.shouldConvert = isRoot;
          var loop = function(i) {
            var key = keys[i];
            /* istanbul ignore else */
            {
              if (isReservedProp[key]) {
                warn(
                  ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
                  vm
                );
              }
              defineReactive$$1(vm, key, validateProp(key, props, propsData, vm), function() {
                if (vm.$parent && !observerState.isSettingProps) {
                  warn(
                    "Avoid mutating a prop directly since the value will be " +
                    "overwritten whenever the parent component re-renders. " +
                    "Instead, use a data or computed property based on the prop's " +
                    "value. Prop being mutated: \"" + key + "\"",
                    vm
                  );
                }
              });
            }
          };

          for (var i = 0; i < keys.length; i++) loop(i);
          observerState.shouldConvert = true;
        }

        function initData(vm) {
          var data = vm.$options.data;
          data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};
          if (!isPlainObject(data)) {
            data = {};
            "development" !== 'production' && warn(
              'data functions should return an object:\n' +
              'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
              vm
            );
          }
          // proxy data on instance
          var keys = Object.keys(data);
          var props = vm.$options.props;
          var i = keys.length;
          while (i--) {
            if (props && hasOwn(props, keys[i])) {
              "development" !== 'production' && warn(
                "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
                "Use prop default value instead.",
                vm
              );
            } else {
              proxy(vm, keys[i]);
            }
          }
          // observe data
          observe(data, true /* asRootData */ );
        }

        var computedSharedDefinition = {
          enumerable: true,
          configurable: true,
          get: noop,
          set: noop
        };

        function initComputed(vm, computed) {
          for (var key in computed) {
            /* istanbul ignore if */
            if ("development" !== 'production' && key in vm) {
              warn(
                "existing instance property \"" + key + "\" will be " +
                "overwritten by a computed property with the same name.",
                vm
              );
            }
            var userDef = computed[key];
            if (typeof userDef === 'function') {
              computedSharedDefinition.get = makeComputedGetter(userDef, vm);
              computedSharedDefinition.set = noop;
            } else {
              computedSharedDefinition.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, vm) : bind$1(userDef.get, vm) : noop;
              computedSharedDefinition.set = userDef.set ? bind$1(userDef.set, vm) : noop;
            }
            Object.defineProperty(vm, key, computedSharedDefinition);
          }
        }

        function makeComputedGetter(getter, owner) {
          var watcher = new Watcher(owner, getter, noop, {
            lazy: true
          });
          return function computedGetter() {
            if (watcher.dirty) {
              watcher.evaluate();
            }
            if (Dep.target) {
              watcher.depend();
            }
            return watcher.value
          }
        }

        function initMethods(vm, methods) {
          for (var key in methods) {
            vm[key] = methods[key] == null ? noop : bind$1(methods[key], vm);
            if ("development" !== 'production' && methods[key] == null) {
              warn(
                "method \"" + key + "\" has an undefined value in the component definition. " +
                "Did you reference the function correctly?",
                vm
              );
            }
          }
        }

        function initWatch(vm, watch) {
          for (var key in watch) {
            var handler = watch[key];
            if (Array.isArray(handler)) {
              for (var i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i]);
              }
            } else {
              createWatcher(vm, key, handler);
            }
          }
        }

        function createWatcher(vm, key, handler) {
          var options;
          if (isPlainObject(handler)) {
            options = handler;
            handler = handler.handler;
          }
          if (typeof handler === 'string') {
            handler = vm[handler];
          }
          vm.$watch(key, handler, options);
        }

        function stateMixin(Vue) {
          // flow somehow has problems with directly declared definition object
          // when using Object.defineProperty, so we have to procedurally build up
          // the object here.
          var dataDef = {};
          dataDef.get = function() {
            return this._data
          }; {
            dataDef.set = function(newData) {
              warn(
                'Avoid replacing instance root $data. ' +
                'Use nested data properties instead.',
                this
              );
            };
          }
          Object.defineProperty(Vue.prototype, '$data', dataDef);

          Vue.prototype.$set = set$1;
          Vue.prototype.$delete = del;

          Vue.prototype.$watch = function(
            expOrFn,
            cb,
            options
          ) {
            var vm = this;
            options = options || {};
            options.user = true;
            var watcher = new Watcher(vm, expOrFn, cb, options);
            if (options.immediate) {
              cb.call(vm, watcher.value);
            }
            return function unwatchFn() {
              watcher.teardown();
            }
          };
        }

        function proxy(vm, key) {
          if (!isReserved(key)) {
            Object.defineProperty(vm, key, {
              configurable: true,
              enumerable: true,
              get: function proxyGetter() {
                return vm._data[key]
              },
              set: function proxySetter(val) {
                vm._data[key] = val;
              }
            });
          }
        }

        /*  */

        var VNode = function VNode(
          tag,
          data,
          children,
          text,
          elm,
          context,
          componentOptions
        ) {
          this.tag = tag;
          this.data = data;
          this.children = children;
          this.text = text;
          this.elm = elm;
          this.ns = undefined;
          this.context = context;
          this.functionalContext = undefined;
          this.key = data && data.key;
          this.componentOptions = componentOptions;
          this.child = undefined;
          this.parent = undefined;
          this.raw = false;
          this.isStatic = false;
          this.isRootInsert = true;
          this.isComment = false;
          this.isCloned = false;
          this.isOnce = false;
        };

        var createEmptyVNode = function() {
          var node = new VNode();
          node.text = '';
          node.isComment = true;
          return node
        };

        function createTextVNode(val) {
          return new VNode(undefined, undefined, undefined, String(val))
        }

        // optimized shallow clone
        // used for static nodes and slot nodes because they may be reused across
        // multiple renders, cloning them avoids errors when DOM manipulations rely
        // on their elm reference.
        function cloneVNode(vnode) {
          var cloned = new VNode(
            vnode.tag,
            vnode.data,
            vnode.children,
            vnode.text,
            vnode.elm,
            vnode.context,
            vnode.componentOptions
          );
          cloned.ns = vnode.ns;
          cloned.isStatic = vnode.isStatic;
          cloned.key = vnode.key;
          cloned.isCloned = true;
          return cloned
        }

        function cloneVNodes(vnodes) {
          var res = new Array(vnodes.length);
          for (var i = 0; i < vnodes.length; i++) {
            res[i] = cloneVNode(vnodes[i]);
          }
          return res
        }

        /*  */

        function mergeVNodeHook(def, hookKey, hook, key) {
          key = key + hookKey;
          var injectedHash = def.__injected || (def.__injected = {});
          if (!injectedHash[key]) {
            injectedHash[key] = true;
            var oldHook = def[hookKey];
            if (oldHook) {
              def[hookKey] = function() {
                oldHook.apply(this, arguments);
                hook.apply(this, arguments);
              };
            } else {
              def[hookKey] = hook;
            }
          }
        }

        /*  */

        function updateListeners(
          on,
          oldOn,
          add,
          remove$$1,
          vm
        ) {
          var name, cur, old, fn, event, capture, once;
          for (name in on) {
            cur = on[name];
            old = oldOn[name];
            if (!cur) {
              "development" !== 'production' && warn(
                "Invalid handler for event \"" + name + "\": got " + String(cur),
                vm
              );
            } else if (!old) {
              once = name.charAt(0) === '~'; // Prefixed last, checked first
              event = once ? name.slice(1) : name;
              capture = event.charAt(0) === '!';
              event = capture ? event.slice(1) : event;
              if (Array.isArray(cur)) {
                add(event, (cur.invoker = arrInvoker(cur)), once, capture);
              } else {
                if (!cur.invoker) {
                  fn = cur;
                  cur = on[name] = {};
                  cur.fn = fn;
                  cur.invoker = fnInvoker(cur);
                }
                add(event, cur.invoker, once, capture);
              }
            } else if (cur !== old) {
              if (Array.isArray(old)) {
                old.length = cur.length;
                for (var i = 0; i < old.length; i++) {
                  old[i] = cur[i];
                }
                on[name] = old;
              } else {
                old.fn = cur;
                on[name] = old;
              }
            }
          }
          for (name in oldOn) {
            if (!on[name]) {
              once = name.charAt(0) === '~'; // Prefixed last, checked first
              event = once ? name.slice(1) : name;
              capture = event.charAt(0) === '!';
              event = capture ? event.slice(1) : event;
              remove$$1(event, oldOn[name].invoker, capture);
            }
          }
        }

        function arrInvoker(arr) {
          return function(ev) {
            var arguments$1 = arguments;

            var single = arguments.length === 1;
            for (var i = 0; i < arr.length; i++) {
              single ? arr[i](ev) : arr[i].apply(null, arguments$1);
            }
          }
        }

        function fnInvoker(o) {
          return function(ev) {
            var single = arguments.length === 1;
            single ? o.fn(ev) : o.fn.apply(null, arguments);
          }
        }

        /*  */

        // The template compiler attempts to minimize the need for normalization by
        // statically analyzing the template at compile time.
        //
        // For plain HTML markup, normalization can be completely skipped because the
        // generated render function is guaranteed to return Array<VNode>. There are
        // two cases where extra normalization is needed:

        // 1. When the children contains components - because a functional component
        // may return an Array instead of a single root. In this case, just a simple
        // nomralization is needed - if any child is an Array, we flatten the whole
        // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
        // because functional components already normalize their own children.
        function simpleNormalizeChildren(children) {
          for (var i = 0; i < children.length; i++) {
            if (Array.isArray(children[i])) {
              return Array.prototype.concat.apply([], children)
            }
          }
          return children
        }

        // 2. When the children contains constrcuts that always generated nested Arrays,
        // e.g. <template>, <slot>, v-for, or when the children is provided by user
        // with hand-written render functions / JSX. In such cases a full normalization
        // is needed to cater to all possible types of children values.
        function normalizeChildren(children) {
          return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined
        }

        function normalizeArrayChildren(children, nestedIndex) {
          var res = [];
          var i, c, last;
          for (i = 0; i < children.length; i++) {
            c = children[i];
            if (c == null || typeof c === 'boolean') {
              continue
            }
            last = res[res.length - 1];
            //  nested
            if (Array.isArray(c)) {
              res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
            } else if (isPrimitive(c)) {
              if (last && last.text) {
                last.text += String(c);
              } else if (c !== '') {
                // convert primitive to vnode
                res.push(createTextVNode(c));
              }
            } else {
              if (c.text && last && last.text) {
                res[res.length - 1] = createTextVNode(last.text + c.text);
              } else {
                // default key for nested array children (likely generated by v-for)
                if (c.tag && c.key == null && nestedIndex != null) {
                  c.key = "__vlist" + nestedIndex + "_" + i + "__";
                }
                res.push(c);
              }
            }
          }
          return res
        }

        /*  */

        function getFirstComponentChild(children) {
          return children && children.filter(function(c) {
            return c && c.componentOptions;
          })[0]
        }

        /*  */

        function initEvents(vm) {
          vm._events = Object.create(null);
          vm._hasHookEvent = false;
          // init parent attached events
          var listeners = vm.$options._parentListeners;
          if (listeners) {
            updateComponentListeners(vm, listeners);
          }
        }

        var target;

        function add$1(event, fn, once) {
          if (once) {
            target.$once(event, fn);
          } else {
            target.$on(event, fn);
          }
        }

        function remove$2(event, fn) {
          target.$off(event, fn);
        }

        function updateComponentListeners(
          vm,
          listeners,
          oldListeners
        ) {
          target = vm;
          updateListeners(listeners, oldListeners || {}, add$1, remove$2, vm);
        }

        function eventsMixin(Vue) {
          var hookRE = /^hook:/;
          Vue.prototype.$on = function(event, fn) {
            var vm = this;
            (vm._events[event] || (vm._events[event] = [])).push(fn);
            // optimize hook:event cost by using a boolean flag marked at registration
            // instead of a hash lookup
            if (hookRE.test(event)) {
              vm._hasHookEvent = true;
            }
            return vm
          };

          Vue.prototype.$once = function(event, fn) {
            var vm = this;

            function on() {
              vm.$off(event, on);
              fn.apply(vm, arguments);
            }
            on.fn = fn;
            vm.$on(event, on);
            return vm
          };

          Vue.prototype.$off = function(event, fn) {
            var vm = this;
            // all
            if (!arguments.length) {
              vm._events = Object.create(null);
              return vm
            }
            // specific event
            var cbs = vm._events[event];
            if (!cbs) {
              return vm
            }
            if (arguments.length === 1) {
              vm._events[event] = null;
              return vm
            }
            // specific handler
            var cb;
            var i = cbs.length;
            while (i--) {
              cb = cbs[i];
              if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1);
                break
              }
            }
            return vm
          };

          Vue.prototype.$emit = function(event) {
            var vm = this;
            var cbs = vm._events[event];
            if (cbs) {
              cbs = cbs.length > 1 ? toArray(cbs) : cbs;
              var args = toArray(arguments, 1);
              for (var i = 0, l = cbs.length; i < l; i++) {
                cbs[i].apply(vm, args);
              }
            }
            return vm
          };
        }

        /*  */

        var activeInstance = null;

        function initLifecycle(vm) {
          var options = vm.$options;

          // locate first non-abstract parent
          var parent = options.parent;
          if (parent && !options.abstract) {
            while (parent.$options.abstract && parent.$parent) {
              parent = parent.$parent;
            }
            parent.$children.push(vm);
          }

          vm.$parent = parent;
          vm.$root = parent ? parent.$root : vm;

          vm.$children = [];
          vm.$refs = {};

          vm._watcher = null;
          vm._inactive = false;
          vm._isMounted = false;
          vm._isDestroyed = false;
          vm._isBeingDestroyed = false;
        }

        function lifecycleMixin(Vue) {
          Vue.prototype._mount = function(
            el,
            hydrating
          ) {
            var vm = this;
            vm.$el = el;
            if (!vm.$options.render) {
              vm.$options.render = createEmptyVNode; {
                /* istanbul ignore if */
                if (vm.$options.template && vm.$options.template.charAt(0) !== '#') {
                  warn(
                    'You are using the runtime-only build of Vue where the template ' +
                    'option is not available. Either pre-compile the templates into ' +
                    'render functions, or use the compiler-included build.',
                    vm
                  );
                } else {
                  warn(
                    'Failed to mount component: template or render function not defined.',
                    vm
                  );
                }
              }
            }
            callHook(vm, 'beforeMount');
            vm._watcher = new Watcher(vm, function() {
              vm._update(vm._render(), hydrating);
            }, noop);
            hydrating = false;
            // manually mounted instance, call mounted on self
            // mounted is called for render-created child components in its inserted hook
            if (vm.$vnode == null) {
              vm._isMounted = true;
              callHook(vm, 'mounted');
            }
            return vm
          };

          Vue.prototype._update = function(vnode, hydrating) {
            var vm = this;
            if (vm._isMounted) {
              callHook(vm, 'beforeUpdate');
            }
            var prevEl = vm.$el;
            var prevVnode = vm._vnode;
            var prevActiveInstance = activeInstance;
            activeInstance = vm;
            vm._vnode = vnode;
            // Vue.prototype.__patch__ is injected in entry points
            // based on the rendering backend used.
            if (!prevVnode) {
              // initial render
              vm.$el = vm.__patch__(
                vm.$el, vnode, hydrating, false /* removeOnly */ ,
                vm.$options._parentElm,
                vm.$options._refElm
              );
            } else {
              // updates
              vm.$el = vm.__patch__(prevVnode, vnode);
            }
            activeInstance = prevActiveInstance;
            // update __vue__ reference
            if (prevEl) {
              prevEl.__vue__ = null;
            }
            if (vm.$el) {
              vm.$el.__vue__ = vm;
            }
            // if parent is an HOC, update its $el as well
            if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
              vm.$parent.$el = vm.$el;
            }
            if (vm._isMounted) {
              callHook(vm, 'updated');
            }
          };

          Vue.prototype._updateFromParent = function(
            propsData,
            listeners,
            parentVnode,
            renderChildren
          ) {
            var vm = this;
            var hasChildren = !!(vm.$options._renderChildren || renderChildren);
            vm.$options._parentVnode = parentVnode;
            vm.$vnode = parentVnode; // update vm's placeholder node without re-render
            if (vm._vnode) { // update child tree's parent
              vm._vnode.parent = parentVnode;
            }
            vm.$options._renderChildren = renderChildren;
            // update props
            if (propsData && vm.$options.props) {
              observerState.shouldConvert = false; {
                observerState.isSettingProps = true;
              }
              var propKeys = vm.$options._propKeys || [];
              for (var i = 0; i < propKeys.length; i++) {
                var key = propKeys[i];
                vm[key] = validateProp(key, vm.$options.props, propsData, vm);
              }
              observerState.shouldConvert = true; {
                observerState.isSettingProps = false;
              }
              vm.$options.propsData = propsData;
            }
            // update listeners
            if (listeners) {
              var oldListeners = vm.$options._parentListeners;
              vm.$options._parentListeners = listeners;
              updateComponentListeners(vm, listeners, oldListeners);
            }
            // resolve slots + force update if has children
            if (hasChildren) {
              vm.$slots = resolveSlots(renderChildren, parentVnode.context);
              vm.$forceUpdate();
            }
          };

          Vue.prototype.$forceUpdate = function() {
            var vm = this;
            if (vm._watcher) {
              vm._watcher.update();
            }
          };

          Vue.prototype.$destroy = function() {
            var vm = this;
            if (vm._isBeingDestroyed) {
              return
            }
            callHook(vm, 'beforeDestroy');
            vm._isBeingDestroyed = true;
            // remove self from parent
            var parent = vm.$parent;
            if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
              remove$1(parent.$children, vm);
            }
            // teardown watchers
            if (vm._watcher) {
              vm._watcher.teardown();
            }
            var i = vm._watchers.length;
            while (i--) {
              vm._watchers[i].teardown();
            }
            // remove reference from data ob
            // frozen object may not have observer.
            if (vm._data.__ob__) {
              vm._data.__ob__.vmCount--;
            }
            // call the last hook...
            vm._isDestroyed = true;
            callHook(vm, 'destroyed');
            // turn off all instance listeners.
            vm.$off();
            // remove __vue__ reference
            if (vm.$el) {
              vm.$el.__vue__ = null;
            }
            // invoke destroy hooks on current rendered tree
            vm.__patch__(vm._vnode, null);
          };
        }

        function callHook(vm, hook) {
          var handlers = vm.$options[hook];
          if (handlers) {
            for (var i = 0, j = handlers.length; i < j; i++) {
              handlers[i].call(vm);
            }
          }
          if (vm._hasHookEvent) {
            vm.$emit('hook:' + hook);
          }
        }

        /*  */

        var hooks = {
          init: init,
          prepatch: prepatch,
          insert: insert,
          destroy: destroy$1
        };
        var hooksToMerge = Object.keys(hooks);

        function createComponent(
          Ctor,
          data,
          context,
          children,
          tag
        ) {
          if (!Ctor) {
            return
          }

          var baseCtor = context.$options._base;
          if (isObject(Ctor)) {
            Ctor = baseCtor.extend(Ctor);
          }

          if (typeof Ctor !== 'function') {
            {
              warn(("Invalid Component definition: " + (String(Ctor))), context);
            }
            return
          }

          // async component
          if (!Ctor.cid) {
            if (Ctor.resolved) {
              Ctor = Ctor.resolved;
            } else {
              Ctor = resolveAsyncComponent(Ctor, baseCtor, function() {
                // it's ok to queue this on every render because
                // $forceUpdate is buffered by the scheduler.
                context.$forceUpdate();
              });
              if (!Ctor) {
                // return nothing if this is indeed an async component
                // wait for the callback to trigger parent update.
                return
              }
            }
          }

          // resolve constructor options in case global mixins are applied after
          // component constructor creation
          resolveConstructorOptions(Ctor);

          data = data || {};

          // extract props
          var propsData = extractProps(data, Ctor);

          // functional component
          if (Ctor.options.functional) {
            return createFunctionalComponent(Ctor, propsData, data, context, children)
          }

          // extract listeners, since these needs to be treated as
          // child component listeners instead of DOM listeners
          var listeners = data.on;
          // replace with listeners with .native modifier
          data.on = data.nativeOn;

          if (Ctor.options.abstract) {
            // abstract components do not keep anything
            // other than props & listeners
            data = {};
          }

          // merge component management hooks onto the placeholder node
          mergeHooks(data);

          // return a placeholder vnode
          var name = Ctor.options.name || tag;
          var vnode = new VNode(
            ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
            data, undefined, undefined, undefined, context, {
              Ctor: Ctor,
              propsData: propsData,
              listeners: listeners,
              tag: tag,
              children: children
            }
          );
          return vnode
        }

        function createFunctionalComponent(
          Ctor,
          propsData,
          data,
          context,
          children
        ) {
          var props = {};
          var propOptions = Ctor.options.props;
          if (propOptions) {
            for (var key in propOptions) {
              props[key] = validateProp(key, propOptions, propsData);
            }
          }
          // ensure the createElement function in functional components
          // gets a unique context - this is necessary for correct named slot check
          var _context = Object.create(context);
          var h = function(a, b, c, d) {
            return createElement(_context, a, b, c, d, true);
          };
          var vnode = Ctor.options.render.call(null, h, {
            props: props,
            data: data,
            parent: context,
            children: children,
            slots: function() {
              return resolveSlots(children, context);
            }
          });
          if (vnode instanceof VNode) {
            vnode.functionalContext = context;
            if (data.slot) {
              (vnode.data || (vnode.data = {})).slot = data.slot;
            }
          }
          return vnode
        }

        function createComponentInstanceForVnode(
          vnode, // we know it's MountedComponentVNode but flow doesn't
          parent, // activeInstance in lifecycle state
          parentElm,
          refElm
        ) {
          var vnodeComponentOptions = vnode.componentOptions;
          var options = {
            _isComponent: true,
            parent: parent,
            propsData: vnodeComponentOptions.propsData,
            _componentTag: vnodeComponentOptions.tag,
            _parentVnode: vnode,
            _parentListeners: vnodeComponentOptions.listeners,
            _renderChildren: vnodeComponentOptions.children,
            _parentElm: parentElm || null,
            _refElm: refElm || null
          };
          // check inline-template render functions
          var inlineTemplate = vnode.data.inlineTemplate;
          if (inlineTemplate) {
            options.render = inlineTemplate.render;
            options.staticRenderFns = inlineTemplate.staticRenderFns;
          }
          return new vnodeComponentOptions.Ctor(options)
        }

        function init(
          vnode,
          hydrating,
          parentElm,
          refElm
        ) {
          if (!vnode.child || vnode.child._isDestroyed) {
            var child = vnode.child = createComponentInstanceForVnode(
              vnode,
              activeInstance,
              parentElm,
              refElm
            );
            child.$mount(hydrating ? vnode.elm : undefined, hydrating);
          } else if (vnode.data.keepAlive) {
            // kept-alive components, treat as a patch
            var mountedNode = vnode; // work around flow
            prepatch(mountedNode, mountedNode);
          }
        }

        function prepatch(
          oldVnode,
          vnode
        ) {
          var options = vnode.componentOptions;
          var child = vnode.child = oldVnode.child;
          child._updateFromParent(
            options.propsData, // updated props
            options.listeners, // updated listeners
            vnode, // new parent vnode
            options.children // new children
          );
        }

        function insert(vnode) {
          if (!vnode.child._isMounted) {
            vnode.child._isMounted = true;
            callHook(vnode.child, 'mounted');
          }
          if (vnode.data.keepAlive) {
            vnode.child._inactive = false;
            callHook(vnode.child, 'activated');
          }
        }

        function destroy$1(vnode) {
          if (!vnode.child._isDestroyed) {
            if (!vnode.data.keepAlive) {
              vnode.child.$destroy();
            } else {
              vnode.child._inactive = true;
              callHook(vnode.child, 'deactivated');
            }
          }
        }

        function resolveAsyncComponent(
          factory,
          baseCtor,
          cb
        ) {
          if (factory.requested) {
            // pool callbacks
            factory.pendingCallbacks.push(cb);
          } else {
            factory.requested = true;
            var cbs = factory.pendingCallbacks = [cb];
            var sync = true;

            var resolve = function(res) {
              if (isObject(res)) {
                res = baseCtor.extend(res);
              }
              // cache resolved
              factory.resolved = res;
              // invoke callbacks only if this is not a synchronous resolve
              // (async resolves are shimmed as synchronous during SSR)
              if (!sync) {
                for (var i = 0, l = cbs.length; i < l; i++) {
                  cbs[i](res);
                }
              }
            };

            var reject = function(reason) {
              "development" !== 'production' && warn(
                "Failed to resolve async component: " + (String(factory)) +
                (reason ? ("\nReason: " + reason) : '')
              );
            };

            var res = factory(resolve, reject);

            // handle promise
            if (res && typeof res.then === 'function' && !factory.resolved) {
              res.then(resolve, reject);
            }

            sync = false;
            // return in case resolved synchronously
            return factory.resolved
          }
        }

        function extractProps(data, Ctor) {
          // we are only extracting raw values here.
          // validation and default values are handled in the child
          // component itself.
          var propOptions = Ctor.options.props;
          if (!propOptions) {
            return
          }
          var res = {};
          var attrs = data.attrs;
          var props = data.props;
          var domProps = data.domProps;
          if (attrs || props || domProps) {
            for (var key in propOptions) {
              var altKey = hyphenate(key);
              checkProp(res, props, key, altKey, true) ||
                checkProp(res, attrs, key, altKey) ||
                checkProp(res, domProps, key, altKey);
            }
          }
          return res
        }

        function checkProp(
          res,
          hash,
          key,
          altKey,
          preserve
        ) {
          if (hash) {
            if (hasOwn(hash, key)) {
              res[key] = hash[key];
              if (!preserve) {
                delete hash[key];
              }
              return true
            } else if (hasOwn(hash, altKey)) {
              res[key] = hash[altKey];
              if (!preserve) {
                delete hash[altKey];
              }
              return true
            }
          }
          return false
        }

        function mergeHooks(data) {
          if (!data.hook) {
            data.hook = {};
          }
          for (var i = 0; i < hooksToMerge.length; i++) {
            var key = hooksToMerge[i];
            var fromParent = data.hook[key];
            var ours = hooks[key];
            data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
          }
        }

        function mergeHook$1(one, two) {
          return function(a, b, c, d) {
            one(a, b, c, d);
            two(a, b, c, d);
          }
        }

        /*  */

        var SIMPLE_NORMALIZE = 1;
        var ALWAYS_NORMALIZE = 2;

        // wrapper function for providing a more flexible interface
        // without getting yelled at by flow
        function createElement(
          context,
          tag,
          data,
          children,
          normalizationType,
          alwaysNormalize
        ) {
          if (Array.isArray(data) || isPrimitive(data)) {
            normalizationType = children;
            children = data;
            data = undefined;
          }
          if (alwaysNormalize) {
            normalizationType = ALWAYS_NORMALIZE;
          }
          return _createElement(context, tag, data, children, normalizationType)
        }

        function _createElement(
          context,
          tag,
          data,
          children,
          normalizationType
        ) {
          if (data && data.__ob__) {
            "development" !== 'production' && warn(
              "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
              'Always create fresh vnode data objects in each render!',
              context
            );
            return createEmptyVNode()
          }
          if (!tag) {
            // in case of component :is set to falsy value
            return createEmptyVNode()
          }
          // support single function children as default scoped slot
          if (Array.isArray(children) &&
            typeof children[0] === 'function') {
            data = data || {};
            data.scopedSlots = {
              default: children[0]
            };
            children.length = 0;
          }
          if (normalizationType === ALWAYS_NORMALIZE) {
            children = normalizeChildren(children);
          } else if (normalizationType === SIMPLE_NORMALIZE) {
            children = simpleNormalizeChildren(children);
          }
          var vnode, ns;
          if (typeof tag === 'string') {
            var Ctor;
            ns = config.getTagNamespace(tag);
            if (config.isReservedTag(tag)) {
              // platform built-in elements
              vnode = new VNode(
                config.parsePlatformTagName(tag), data, children,
                undefined, undefined, context
              );
            } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
              // component
              vnode = createComponent(Ctor, data, context, children, tag);
            } else {
              // unknown or unlisted namespaced elements
              // check at runtime because it may get assigned a namespace when its
              // parent normalizes children
              vnode = new VNode(
                tag, data, children,
                undefined, undefined, context
              );
            }
          } else {
            // direct component options / constructor
            vnode = createComponent(tag, data, context, children);
          }
          if (vnode) {
            if (ns) {
              applyNS(vnode, ns);
            }
            return vnode
          } else {
            return createEmptyVNode()
          }
        }

        function applyNS(vnode, ns) {
          vnode.ns = ns;
          if (vnode.tag === 'foreignObject') {
            // use default namespace inside foreignObject
            return
          }
          if (vnode.children) {
            for (var i = 0, l = vnode.children.length; i < l; i++) {
              var child = vnode.children[i];
              if (child.tag && !child.ns) {
                applyNS(child, ns);
              }
            }
          }
        }

        /*  */

        function initRender(vm) {
          vm.$vnode = null; // the placeholder node in parent tree
          vm._vnode = null; // the root of the child tree
          vm._staticTrees = null;
          var parentVnode = vm.$options._parentVnode;
          var renderContext = parentVnode && parentVnode.context;
          vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
          vm.$scopedSlots = {};
          // bind the createElement fn to this instance
          // so that we get proper render context inside it.
          // args order: tag, data, children, normalizationType, alwaysNormalize
          // internal version is used by render functions compiled from templates
          vm._c = function(a, b, c, d) {
            return createElement(vm, a, b, c, d, false);
          };
          // normalization is always applied for the public version, used in
          // user-written render functions.
          vm.$createElement = function(a, b, c, d) {
            return createElement(vm, a, b, c, d, true);
          };
          if (vm.$options.el) {
            vm.$mount(vm.$options.el);
          }
        }

        function renderMixin(Vue) {
          Vue.prototype.$nextTick = function(fn) {
            return nextTick(fn, this)
          };

          Vue.prototype._render = function() {
            var vm = this;
            var ref = vm.$options;
            var render = ref.render;
            var staticRenderFns = ref.staticRenderFns;
            var _parentVnode = ref._parentVnode;

            if (vm._isMounted) {
              // clone slot nodes on re-renders
              for (var key in vm.$slots) {
                vm.$slots[key] = cloneVNodes(vm.$slots[key]);
              }
            }

            if (_parentVnode && _parentVnode.data.scopedSlots) {
              vm.$scopedSlots = _parentVnode.data.scopedSlots;
            }

            if (staticRenderFns && !vm._staticTrees) {
              vm._staticTrees = [];
            }
            // set parent vnode. this allows render functions to have access
            // to the data on the placeholder node.
            vm.$vnode = _parentVnode;
            // render self
            var vnode;
            try {
              vnode = render.call(vm._renderProxy, vm.$createElement);
            } catch (e) {
              /* istanbul ignore else */
              if (config.errorHandler) {
                config.errorHandler.call(null, e, vm);
              } else {
                {
                  warn(("Error when rendering " + (formatComponentName(vm)) + ":"));
                }
                throw e
              }
              // return previous vnode to prevent render error causing blank component
              vnode = vm._vnode;
            }
            // return empty vnode in case the render function errored out
            if (!(vnode instanceof VNode)) {
              if ("development" !== 'production' && Array.isArray(vnode)) {
                warn(
                  'Multiple root nodes returned from render function. Render function ' +
                  'should return a single root node.',
                  vm
                );
              }
              vnode = createEmptyVNode();
            }
            // set parent
            vnode.parent = _parentVnode;
            return vnode
          };

          // toString for mustaches
          Vue.prototype._s = _toString;
          // convert text to vnode
          Vue.prototype._v = createTextVNode;
          // number conversion
          Vue.prototype._n = toNumber;
          // empty vnode
          Vue.prototype._e = createEmptyVNode;
          // loose equal
          Vue.prototype._q = looseEqual;
          // loose indexOf
          Vue.prototype._i = looseIndexOf;

          // render static tree by index
          Vue.prototype._m = function renderStatic(
            index,
            isInFor
          ) {
            var tree = this._staticTrees[index];
            // if has already-rendered static tree and not inside v-for,
            // we can reuse the same tree by doing a shallow clone.
            if (tree && !isInFor) {
              return Array.isArray(tree) ? cloneVNodes(tree) : cloneVNode(tree)
            }
            // otherwise, render a fresh tree.
            tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
            markStatic(tree, ("__static__" + index), false);
            return tree
          };

          // mark node as static (v-once)
          Vue.prototype._o = function markOnce(
            tree,
            index,
            key
          ) {
            markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
            return tree
          };

          function markStatic(tree, key, isOnce) {
            if (Array.isArray(tree)) {
              for (var i = 0; i < tree.length; i++) {
                if (tree[i] && typeof tree[i] !== 'string') {
                  markStaticNode(tree[i], (key + "_" + i), isOnce);
                }
              }
            } else {
              markStaticNode(tree, key, isOnce);
            }
          }

          function markStaticNode(node, key, isOnce) {
            node.isStatic = true;
            node.key = key;
            node.isOnce = isOnce;
          }

          // filter resolution helper
          Vue.prototype._f = function resolveFilter(id) {
            return resolveAsset(this.$options, 'filters', id, true) || identity
          };

          // render v-for
          Vue.prototype._l = function renderList(
            val,
            render
          ) {
            var ret, i, l, keys, key;
            if (Array.isArray(val) || typeof val === 'string') {
              ret = new Array(val.length);
              for (i = 0, l = val.length; i < l; i++) {
                ret[i] = render(val[i], i);
              }
            } else if (typeof val === 'number') {
              ret = new Array(val);
              for (i = 0; i < val; i++) {
                ret[i] = render(i + 1, i);
              }
            } else if (isObject(val)) {
              keys = Object.keys(val);
              ret = new Array(keys.length);
              for (i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                ret[i] = render(val[key], key, i);
              }
            }
            return ret
          };

          // renderSlot
          Vue.prototype._t = function(
            name,
            fallback,
            props,
            bindObject
          ) {
            var scopedSlotFn = this.$scopedSlots[name];
            if (scopedSlotFn) { // scoped slot
              props = props || {};
              if (bindObject) {
                extend(props, bindObject);
              }
              return scopedSlotFn(props) || fallback
            } else {
              var slotNodes = this.$slots[name];
              // warn duplicate slot usage
              if (slotNodes && "development" !== 'production') {
                slotNodes._rendered && warn(
                  "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
                  "- this will likely cause render errors.",
                  this
                );
                slotNodes._rendered = true;
              }
              return slotNodes || fallback
            }
          };

          // apply v-bind object
          Vue.prototype._b = function bindProps(
            data,
            tag,
            value,
            asProp
          ) {
            if (value) {
              if (!isObject(value)) {
                "development" !== 'production' && warn(
                  'v-bind without argument expects an Object or Array value',
                  this
                );
              } else {
                if (Array.isArray(value)) {
                  value = toObject(value);
                }
                for (var key in value) {
                  if (key === 'class' || key === 'style') {
                    data[key] = value[key];
                  } else {
                    var hash = asProp || config.mustUseProp(tag, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
                    hash[key] = value[key];
                  }
                }
              }
            }
            return data
          };

          // check v-on keyCodes
          Vue.prototype._k = function checkKeyCodes(
            eventKeyCode,
            key,
            builtInAlias
          ) {
            var keyCodes = config.keyCodes[key] || builtInAlias;
            if (Array.isArray(keyCodes)) {
              return keyCodes.indexOf(eventKeyCode) === -1
            } else {
              return keyCodes !== eventKeyCode
            }
          };
        }

        function resolveSlots(
          children,
          context
        ) {
          var slots = {};
          if (!children) {
            return slots
          }
          var defaultSlot = [];
          var name, child;
          for (var i = 0, l = children.length; i < l; i++) {
            child = children[i];
            // named slots should only be respected if the vnode was rendered in the
            // same context.
            if ((child.context === context || child.functionalContext === context) &&
              child.data && (name = child.data.slot)) {
              var slot = (slots[name] || (slots[name] = []));
              if (child.tag === 'template') {
                slot.push.apply(slot, child.children);
              } else {
                slot.push(child);
              }
            } else {
              defaultSlot.push(child);
            }
          }
          // ignore single whitespace
          if (defaultSlot.length && !(
              defaultSlot.length === 1 &&
              (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
            )) {
            slots.default = defaultSlot;
          }
          return slots
        }

        /*  */

        var uid = 0;

        function initMixin(Vue) {
          Vue.prototype._init = function(options) {
            var vm = this;
            // a uid
            vm._uid = uid++;
            // a flag to avoid this being observed
            vm._isVue = true;
            // merge options
            if (options && options._isComponent) {
              // optimize internal component instantiation
              // since dynamic options merging is pretty slow, and none of the
              // internal component options needs special treatment.
              initInternalComponent(vm, options);
            } else {
              vm.$options = mergeOptions(
                resolveConstructorOptions(vm.constructor),
                options || {},
                vm
              );
            }
            /* istanbul ignore else */
            {
              initProxy(vm);
            }
            // expose real self
            vm._self = vm;
            initLifecycle(vm);
            initEvents(vm);
            callHook(vm, 'beforeCreate');
            initState(vm);
            callHook(vm, 'created');
            initRender(vm);
          };
        }

        function initInternalComponent(vm, options) {
          var opts = vm.$options = Object.create(vm.constructor.options);
          // doing this because it's faster than dynamic enumeration.
          opts.parent = options.parent;
          opts.propsData = options.propsData;
          opts._parentVnode = options._parentVnode;
          opts._parentListeners = options._parentListeners;
          opts._renderChildren = options._renderChildren;
          opts._componentTag = options._componentTag;
          opts._parentElm = options._parentElm;
          opts._refElm = options._refElm;
          if (options.render) {
            opts.render = options.render;
            opts.staticRenderFns = options.staticRenderFns;
          }
        }

        function resolveConstructorOptions(Ctor) {
          var options = Ctor.options;
          if (Ctor.super) {
            var superOptions = Ctor.super.options;
            var cachedSuperOptions = Ctor.superOptions;
            var extendOptions = Ctor.extendOptions;
            if (superOptions !== cachedSuperOptions) {
              // super option changed
              Ctor.superOptions = superOptions;
              extendOptions.render = options.render;
              extendOptions.staticRenderFns = options.staticRenderFns;
              extendOptions._scopeId = options._scopeId;
              options = Ctor.options = mergeOptions(superOptions, extendOptions);
              if (options.name) {
                options.components[options.name] = Ctor;
              }
            }
          }
          return options
        }

        function Vue$3(options) {
          if ("development" !== 'production' &&
            !(this instanceof Vue$3)) {
            warn('Vue is a constructor and should be called with the `new` keyword');
          }
          this._init(options);
        }

        initMixin(Vue$3);
        stateMixin(Vue$3);
        eventsMixin(Vue$3);
        lifecycleMixin(Vue$3);
        renderMixin(Vue$3);

        /*  */

        function initUse(Vue) {
          Vue.use = function(plugin) {
            /* istanbul ignore if */
            if (plugin.installed) {
              return
            }
            // additional parameters
            var args = toArray(arguments, 1);
            args.unshift(this);
            if (typeof plugin.install === 'function') {
              plugin.install.apply(plugin, args);
            } else {
              plugin.apply(null, args);
            }
            plugin.installed = true;
            return this
          };
        }

        /*  */

        function initMixin$1(Vue) {
          Vue.mixin = function(mixin) {
            this.options = mergeOptions(this.options, mixin);
          };
        }

        /*  */

        function initExtend(Vue) {
          /**
           * Each instance constructor, including Vue, has a unique
           * cid. This enables us to create wrapped "child
           * constructors" for prototypal inheritance and cache them.
           */
          Vue.cid = 0;
          var cid = 1;

          /**
           * Class inheritance
           */
          Vue.extend = function(extendOptions) {
            extendOptions = extendOptions || {};
            var Super = this;
            var SuperId = Super.cid;
            var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
            if (cachedCtors[SuperId]) {
              return cachedCtors[SuperId]
            }
            var name = extendOptions.name || Super.options.name; {
              if (!/^[a-zA-Z][\w-]*$/.test(name)) {
                warn(
                  'Invalid component name: "' + name + '". Component names ' +
                  'can only contain alphanumeric characters and the hyphen, ' +
                  'and must start with a letter.'
                );
              }
            }
            var Sub = function VueComponent(options) {
              this._init(options);
            };
            Sub.prototype = Object.create(Super.prototype);
            Sub.prototype.constructor = Sub;
            Sub.cid = cid++;
            Sub.options = mergeOptions(
              Super.options,
              extendOptions
            );
            Sub['super'] = Super;
            // allow further extension/mixin/plugin usage
            Sub.extend = Super.extend;
            Sub.mixin = Super.mixin;
            Sub.use = Super.use;
            // create asset registers, so extended classes
            // can have their private assets too.
            config._assetTypes.forEach(function(type) {
              Sub[type] = Super[type];
            });
            // enable recursive self-lookup
            if (name) {
              Sub.options.components[name] = Sub;
            }
            // keep a reference to the super options at extension time.
            // later at instantiation we can check if Super's options have
            // been updated.
            Sub.superOptions = Super.options;
            Sub.extendOptions = extendOptions;
            // cache constructor
            cachedCtors[SuperId] = Sub;
            return Sub
          };
        }

        /*  */

        function initAssetRegisters(Vue) {
          /**
           * Create asset registration methods.
           */
          config._assetTypes.forEach(function(type) {
            Vue[type] = function(
              id,
              definition
            ) {
              if (!definition) {
                return this.options[type + 's'][id]
              } else {
                /* istanbul ignore if */
                {
                  if (type === 'component' && config.isReservedTag(id)) {
                    warn(
                      'Do not use built-in or reserved HTML elements as component ' +
                      'id: ' + id
                    );
                  }
                }
                if (type === 'component' && isPlainObject(definition)) {
                  definition.name = definition.name || id;
                  definition = this.options._base.extend(definition);
                }
                if (type === 'directive' && typeof definition === 'function') {
                  definition = {
                    bind: definition,
                    update: definition
                  };
                }
                this.options[type + 's'][id] = definition;
                return definition
              }
            };
          });
        }

        /*  */

        var patternTypes = [String, RegExp];

        function matches(pattern, name) {
          if (typeof pattern === 'string') {
            return pattern.split(',').indexOf(name) > -1
          } else {
            return pattern.test(name)
          }
        }

        var KeepAlive = {
          name: 'keep-alive',
          abstract: true,
          props: {
            include: patternTypes,
            exclude: patternTypes
          },
          created: function created() {
            this.cache = Object.create(null);
          },
          render: function render() {
            var vnode = getFirstComponentChild(this.$slots.default);
            if (vnode && vnode.componentOptions) {
              var opts = vnode.componentOptions;
              // check pattern
              var name = opts.Ctor.options.name || opts.tag;
              if (name && (
                  (this.include && !matches(this.include, name)) ||
                  (this.exclude && matches(this.exclude, name))
                )) {
                return vnode
              }
              var key = vnode.key == null
                // same constructor may get registered as different local components
                // so cid alone is not enough (#3269)
                ? opts.Ctor.cid + (opts.tag ? ("::" + (opts.tag)) : '') : vnode.key;
              if (this.cache[key]) {
                vnode.child = this.cache[key].child;
              } else {
                this.cache[key] = vnode;
              }
              vnode.data.keepAlive = true;
            }
            return vnode
          },
          destroyed: function destroyed() {
            var this$1 = this;

            for (var key in this.cache) {
              var vnode = this$1.cache[key];
              callHook(vnode.child, 'deactivated');
              vnode.child.$destroy();
            }
          }
        };

        var builtInComponents = {
          KeepAlive: KeepAlive
        };

        /*  */

        function initGlobalAPI(Vue) {
          // config
          var configDef = {};
          configDef.get = function() {
            return config;
          }; {
            configDef.set = function() {
              warn(
                'Do not replace the Vue.config object, set individual fields instead.'
              );
            };
          }
          Object.defineProperty(Vue, 'config', configDef);
          Vue.util = util;
          Vue.set = set$1;
          Vue.delete = del;
          Vue.nextTick = nextTick;

          Vue.options = Object.create(null);
          config._assetTypes.forEach(function(type) {
            Vue.options[type + 's'] = Object.create(null);
          });

          // this is used to identify the "base" constructor to extend all plain-object
          // components with in Weex's multi-instance scenarios.
          Vue.options._base = Vue;

          extend(Vue.options.components, builtInComponents);

          initUse(Vue);
          initMixin$1(Vue);
          initExtend(Vue);
          initAssetRegisters(Vue);
        }

        initGlobalAPI(Vue$3);

        Object.defineProperty(Vue$3.prototype, '$isServer', {
          get: isServerRendering
        });

        Vue$3.version = '2.1.8';

        /*  */

        // attributes that should be using props for binding
        var acceptValue = makeMap('input,textarea,option,select');
        var mustUseProp = function(tag, attr) {
          return (
            (attr === 'value' && acceptValue(tag)) ||
            (attr === 'selected' && tag === 'option') ||
            (attr === 'checked' && tag === 'input') ||
            (attr === 'muted' && tag === 'video')
          )
        };

        var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

        var isBooleanAttr = makeMap(
          'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
          'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
          'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
          'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
          'required,reversed,scoped,seamless,selected,sortable,translate,' +
          'truespeed,typemustmatch,visible'
        );

        var xlinkNS = 'http://www.w3.org/1999/xlink';

        var isXlink = function(name) {
          return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
        };

        var getXlinkProp = function(name) {
          return isXlink(name) ? name.slice(6, name.length) : ''
        };

        var isFalsyAttrValue = function(val) {
          return val == null || val === false
        };

        /*  */

        function genClassForVnode(vnode) {
          var data = vnode.data;
          var parentNode = vnode;
          var childNode = vnode;
          while (childNode.child) {
            childNode = childNode.child._vnode;
            if (childNode.data) {
              data = mergeClassData(childNode.data, data);
            }
          }
          while ((parentNode = parentNode.parent)) {
            if (parentNode.data) {
              data = mergeClassData(data, parentNode.data);
            }
          }
          return genClassFromData(data)
        }

        function mergeClassData(child, parent) {
          return {
            staticClass: concat(child.staticClass, parent.staticClass),
            class: child.class ? [child.class, parent.class] : parent.class
          }
        }

        function genClassFromData(data) {
          var dynamicClass = data.class;
          var staticClass = data.staticClass;
          if (staticClass || dynamicClass) {
            return concat(staticClass, stringifyClass(dynamicClass))
          }
          /* istanbul ignore next */
          return ''
        }

        function concat(a, b) {
          return a ? b ? (a + ' ' + b) : a : (b || '')
        }

        function stringifyClass(value) {
          var res = '';
          if (!value) {
            return res
          }
          if (typeof value === 'string') {
            return value
          }
          if (Array.isArray(value)) {
            var stringified;
            for (var i = 0, l = value.length; i < l; i++) {
              if (value[i]) {
                if ((stringified = stringifyClass(value[i]))) {
                  res += stringified + ' ';
                }
              }
            }
            return res.slice(0, -1)
          }
          if (isObject(value)) {
            for (var key in value) {
              if (value[key]) {
                res += key + ' ';
              }
            }
            return res.slice(0, -1)
          }
          /* istanbul ignore next */
          return res
        }

        /*  */

        var namespaceMap = {
          svg: 'http://www.w3.org/2000/svg',
          math: 'http://www.w3.org/1998/Math/MathML'
        };

        var isHTMLTag = makeMap(
          'html,body,base,head,link,meta,style,title,' +
          'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
          'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
          'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
          's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
          'embed,object,param,source,canvas,script,noscript,del,ins,' +
          'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
          'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
          'output,progress,select,textarea,' +
          'details,dialog,menu,menuitem,summary,' +
          'content,element,shadow,template'
        );

        // this map is intentionally selective, only covering SVG elements that may
        // contain child elements.
        var isSVG = makeMap(
          'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,' +
          'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
          'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
          true
        );

        var isPreTag = function(tag) {
          return tag === 'pre';
        };

        var isReservedTag = function(tag) {
          return isHTMLTag(tag) || isSVG(tag)
        };

        function getTagNamespace(tag) {
          if (isSVG(tag)) {
            return 'svg'
          }
          // basic support for MathML
          // note it doesn't support other MathML elements being component roots
          if (tag === 'math') {
            return 'math'
          }
        }

        var unknownElementCache = Object.create(null);

        function isUnknownElement(tag) {
          /* istanbul ignore if */
          if (!inBrowser) {
            return true
          }
          if (isReservedTag(tag)) {
            return false
          }
          tag = tag.toLowerCase();
          /* istanbul ignore if */
          if (unknownElementCache[tag] != null) {
            return unknownElementCache[tag]
          }
          var el = document.createElement(tag);
          if (tag.indexOf('-') > -1) {
            // http://stackoverflow.com/a/28210364/1070244
            return (unknownElementCache[tag] = (
              el.constructor === window.HTMLUnknownElement ||
              el.constructor === window.HTMLElement
            ))
          } else {
            return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
          }
        }

        /*  */

        /**
         * Query an element selector if it's not an element already.
         */
        function query(el) {
          if (typeof el === 'string') {
            var selector = el;
            el = document.querySelector(el);
            if (!el) {
              "development" !== 'production' && warn(
                'Cannot find element: ' + selector
              );
              return document.createElement('div')
            }
          }
          return el
        }

        /*  */

        function createElement$1(tagName, vnode) {
          var elm = document.createElement(tagName);
          if (tagName !== 'select') {
            return elm
          }
          if (vnode.data && vnode.data.attrs && 'multiple' in vnode.data.attrs) {
            elm.setAttribute('multiple', 'multiple');
          }
          return elm
        }

        function createElementNS(namespace, tagName) {
          return document.createElementNS(namespaceMap[namespace], tagName)
        }

        function createTextNode(text) {
          return document.createTextNode(text)
        }

        function createComment(text) {
          return document.createComment(text)
        }

        function insertBefore(parentNode, newNode, referenceNode) {
          parentNode.insertBefore(newNode, referenceNode);
        }

        function removeChild(node, child) {
          node.removeChild(child);
        }

        function appendChild(node, child) {
          node.appendChild(child);
        }

        function parentNode(node) {
          return node.parentNode
        }

        function nextSibling(node) {
          return node.nextSibling
        }

        function tagName(node) {
          return node.tagName
        }

        function setTextContent(node, text) {
          node.textContent = text;
        }

        function setAttribute(node, key, val) {
          node.setAttribute(key, val);
        }


        var nodeOps = Object.freeze({
          createElement: createElement$1,
          createElementNS: createElementNS,
          createTextNode: createTextNode,
          createComment: createComment,
          insertBefore: insertBefore,
          removeChild: removeChild,
          appendChild: appendChild,
          parentNode: parentNode,
          nextSibling: nextSibling,
          tagName: tagName,
          setTextContent: setTextContent,
          setAttribute: setAttribute
        });

        /*  */

        var ref = {
          create: function create(_, vnode) {
            registerRef(vnode);
          },
          update: function update(oldVnode, vnode) {
            if (oldVnode.data.ref !== vnode.data.ref) {
              registerRef(oldVnode, true);
              registerRef(vnode);
            }
          },
          destroy: function destroy(vnode) {
            registerRef(vnode, true);
          }
        };

        function registerRef(vnode, isRemoval) {
          var key = vnode.data.ref;
          if (!key) {
            return
          }

          var vm = vnode.context;
          var ref = vnode.child || vnode.elm;
          var refs = vm.$refs;
          if (isRemoval) {
            if (Array.isArray(refs[key])) {
              remove$1(refs[key], ref);
            } else if (refs[key] === ref) {
              refs[key] = undefined;
            }
          } else {
            if (vnode.data.refInFor) {
              if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
                refs[key].push(ref);
              } else {
                refs[key] = [ref];
              }
            } else {
              refs[key] = ref;
            }
          }
        }

        /**
         * Virtual DOM patching algorithm based on Snabbdom by
         * Simon Friis Vindum (@paldepind)
         * Licensed under the MIT License
         * https://github.com/paldepind/snabbdom/blob/master/LICENSE
         *
         * modified by Evan You (@yyx990803)
         *
	
        /*
         * Not type-checking this because this file is perf-critical and the cost
         * of making flow understand it is not worth it.
         */

        var emptyNode = new VNode('', {}, []);

        var hooks$1 = ['create', 'activate', 'update', 'remove', 'destroy'];

        function isUndef(s) {
          return s == null
        }

        function isDef(s) {
          return s != null
        }

        function sameVnode(vnode1, vnode2) {
          return (
            vnode1.key === vnode2.key &&
            vnode1.tag === vnode2.tag &&
            vnode1.isComment === vnode2.isComment &&
            !vnode1.data === !vnode2.data
          )
        }

        function createKeyToOldIdx(children, beginIdx, endIdx) {
          var i, key;
          var map = {};
          for (i = beginIdx; i <= endIdx; ++i) {
            key = children[i].key;
            if (isDef(key)) {
              map[key] = i;
            }
          }
          return map
        }

        function createPatchFunction(backend) {
          var i, j;
          var cbs = {};

          var modules = backend.modules;
          var nodeOps = backend.nodeOps;

          for (i = 0; i < hooks$1.length; ++i) {
            cbs[hooks$1[i]] = [];
            for (j = 0; j < modules.length; ++j) {
              if (modules[j][hooks$1[i]] !== undefined) {
                cbs[hooks$1[i]].push(modules[j][hooks$1[i]]);
              }
            }
          }

          function emptyNodeAt(elm) {
            return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
          }

          function createRmCb(childElm, listeners) {
            function remove$$1() {
              if (--remove$$1.listeners === 0) {
                removeNode(childElm);
              }
            }
            remove$$1.listeners = listeners;
            return remove$$1
          }

          function removeNode(el) {
            var parent = nodeOps.parentNode(el);
            // element may have already been removed due to v-html / v-text
            if (parent) {
              nodeOps.removeChild(parent, el);
            }
          }

          var inPre = 0;

          function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
            vnode.isRootInsert = !nested; // for transition enter check
            if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
              return
            }

            var data = vnode.data;
            var children = vnode.children;
            var tag = vnode.tag;
            if (isDef(tag)) {
              {
                if (data && data.pre) {
                  inPre++;
                }
                if (!inPre &&
                  !vnode.ns &&
                  !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
                  config.isUnknownElement(tag)
                ) {
                  warn(
                    'Unknown custom element: <' + tag + '> - did you ' +
                    'register the component correctly? For recursive components, ' +
                    'make sure to provide the "name" option.',
                    vnode.context
                  );
                }
              }
              vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);
              setScope(vnode);

              /* istanbul ignore if */
              {
                createChildren(vnode, children, insertedVnodeQueue);
                if (isDef(data)) {
                  invokeCreateHooks(vnode, insertedVnodeQueue);
                }
                insert(parentElm, vnode.elm, refElm);
              }

              if ("development" !== 'production' && data && data.pre) {
                inPre--;
              }
            } else if (vnode.isComment) {
              vnode.elm = nodeOps.createComment(vnode.text);
              insert(parentElm, vnode.elm, refElm);
            } else {
              vnode.elm = nodeOps.createTextNode(vnode.text);
              insert(parentElm, vnode.elm, refElm);
            }
          }

          function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
            var i = vnode.data;
            if (isDef(i)) {
              var isReactivated = isDef(vnode.child) && i.keepAlive;
              if (isDef(i = i.hook) && isDef(i = i.init)) {
                i(vnode, false /* hydrating */ , parentElm, refElm);
              }
              // after calling the init hook, if the vnode is a child component
              // it should've created a child instance and mounted it. the child
              // component also has set the placeholder vnode's elm.
              // in that case we can just return the element and be done.
              if (isDef(vnode.child)) {
                initComponent(vnode, insertedVnodeQueue);
                if (isReactivated) {
                  reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
                }
                return true
              }
            }
          }

          function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
            var i;
            // hack for #4339: a reactivated component with inner transition
            // does not trigger because the inner node's created hooks are not called
            // again. It's not ideal to involve module-specific logic in here but
            // there doesn't seem to be a better way to do it.
            var innerNode = vnode;
            while (innerNode.child) {
              innerNode = innerNode.child._vnode;
              if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
                for (i = 0; i < cbs.activate.length; ++i) {
                  cbs.activate[i](emptyNode, innerNode);
                }
                insertedVnodeQueue.push(innerNode);
                break
              }
            }
            // unlike a newly created component,
            // a reactivated keep-alive component doesn't insert itself
            insert(parentElm, vnode.elm, refElm);
          }

          function insert(parent, elm, ref) {
            if (parent) {
              if (ref) {
                nodeOps.insertBefore(parent, elm, ref);
              } else {
                nodeOps.appendChild(parent, elm);
              }
            }
          }

          function createChildren(vnode, children, insertedVnodeQueue) {
            if (Array.isArray(children)) {
              for (var i = 0; i < children.length; ++i) {
                createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
              }
            } else if (isPrimitive(vnode.text)) {
              nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
            }
          }

          function isPatchable(vnode) {
            while (vnode.child) {
              vnode = vnode.child._vnode;
            }
            return isDef(vnode.tag)
          }

          function invokeCreateHooks(vnode, insertedVnodeQueue) {
            for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
              cbs.create[i$1](emptyNode, vnode);
            }
            i = vnode.data.hook; // Reuse variable
            if (isDef(i)) {
              if (i.create) {
                i.create(emptyNode, vnode);
              }
              if (i.insert) {
                insertedVnodeQueue.push(vnode);
              }
            }
          }

          function initComponent(vnode, insertedVnodeQueue) {
            if (vnode.data.pendingInsert) {
              insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
            }
            vnode.elm = vnode.child.$el;
            if (isPatchable(vnode)) {
              invokeCreateHooks(vnode, insertedVnodeQueue);
              setScope(vnode);
            } else {
              // empty component root.
              // skip all element-related modules except for ref (#3455)
              registerRef(vnode);
              // make sure to invoke the insert hook
              insertedVnodeQueue.push(vnode);
            }
          }

          // set scope id attribute for scoped CSS.
          // this is implemented as a special case to avoid the overhead
          // of going through the normal attribute patching process.
          function setScope(vnode) {
            var i;
            if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
              nodeOps.setAttribute(vnode.elm, i, '');
            }
            if (isDef(i = activeInstance) &&
              i !== vnode.context &&
              isDef(i = i.$options._scopeId)) {
              nodeOps.setAttribute(vnode.elm, i, '');
            }
          }

          function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for (; startIdx <= endIdx; ++startIdx) {
              createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
            }
          }

          function invokeDestroyHook(vnode) {
            var i, j;
            var data = vnode.data;
            if (isDef(data)) {
              if (isDef(i = data.hook) && isDef(i = i.destroy)) {
                i(vnode);
              }
              for (i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](vnode);
              }
            }
            if (isDef(i = vnode.children)) {
              for (j = 0; j < vnode.children.length; ++j) {
                invokeDestroyHook(vnode.children[j]);
              }
            }
          }

          function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
              var ch = vnodes[startIdx];
              if (isDef(ch)) {
                if (isDef(ch.tag)) {
                  removeAndInvokeRemoveHook(ch);
                  invokeDestroyHook(ch);
                } else { // Text node
                  removeNode(ch.elm);
                }
              }
            }
          }

          function removeAndInvokeRemoveHook(vnode, rm) {
            if (rm || isDef(vnode.data)) {
              var listeners = cbs.remove.length + 1;
              if (!rm) {
                // directly removing
                rm = createRmCb(vnode.elm, listeners);
              } else {
                // we have a recursively passed down rm callback
                // increase the listeners count
                rm.listeners += listeners;
              }
              // recursively invoke hooks on child component root node
              if (isDef(i = vnode.child) && isDef(i = i._vnode) && isDef(i.data)) {
                removeAndInvokeRemoveHook(i, rm);
              }
              for (i = 0; i < cbs.remove.length; ++i) {
                cbs.remove[i](vnode, rm);
              }
              if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
                i(vnode, rm);
              } else {
                rm();
              }
            } else {
              removeNode(vnode.elm);
            }
          }

          function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
            var oldStartIdx = 0;
            var newStartIdx = 0;
            var oldEndIdx = oldCh.length - 1;
            var oldStartVnode = oldCh[0];
            var oldEndVnode = oldCh[oldEndIdx];
            var newEndIdx = newCh.length - 1;
            var newStartVnode = newCh[0];
            var newEndVnode = newCh[newEndIdx];
            var oldKeyToIdx, idxInOld, elmToMove, refElm;

            // removeOnly is a special flag used only by <transition-group>
            // to ensure removed elements stay in correct relative positions
            // during leaving transitions
            var canMove = !removeOnly;

            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
              if (isUndef(oldStartVnode)) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
              } else if (isUndef(oldEndVnode)) {
                oldEndVnode = oldCh[--oldEndIdx];
              } else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
              } else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
              } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
              } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
              } else {
                if (isUndef(oldKeyToIdx)) {
                  oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
                if (isUndef(idxInOld)) { // New element
                  createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
                  newStartVnode = newCh[++newStartIdx];
                } else {
                  elmToMove = oldCh[idxInOld];
                  /* istanbul ignore if */
                  if ("development" !== 'production' && !elmToMove) {
                    warn(
                      'It seems there are duplicate keys that is causing an update error. ' +
                      'Make sure each v-for item has a unique key.'
                    );
                  }
                  if (sameVnode(elmToMove, newStartVnode)) {
                    patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                    oldCh[idxInOld] = undefined;
                    canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                  } else {
                    // same key but different element. treat as new element
                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                  }
                }
              }
            }
            if (oldStartIdx > oldEndIdx) {
              refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
              addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            } else if (newStartIdx > newEndIdx) {
              removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
          }

          function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
            if (oldVnode === vnode) {
              return
            }
            // reuse element for static trees.
            // note we only do this if the vnode is cloned -
            // if the new node is not cloned it means the render functions have been
            // reset by the hot-reload-api and we need to do a proper re-render.
            if (vnode.isStatic &&
              oldVnode.isStatic &&
              vnode.key === oldVnode.key &&
              (vnode.isCloned || vnode.isOnce)) {
              vnode.elm = oldVnode.elm;
              vnode.child = oldVnode.child;
              return
            }
            var i;
            var data = vnode.data;
            var hasData = isDef(data);
            if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
              i(oldVnode, vnode);
            }
            var elm = vnode.elm = oldVnode.elm;
            var oldCh = oldVnode.children;
            var ch = vnode.children;
            if (hasData && isPatchable(vnode)) {
              for (i = 0; i < cbs.update.length; ++i) {
                cbs.update[i](oldVnode, vnode);
              }
              if (isDef(i = data.hook) && isDef(i = i.update)) {
                i(oldVnode, vnode);
              }
            }
            if (isUndef(vnode.text)) {
              if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch) {
                  updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
                }
              } else if (isDef(ch)) {
                if (isDef(oldVnode.text)) {
                  nodeOps.setTextContent(elm, '');
                }
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
              } else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
              } else if (isDef(oldVnode.text)) {
                nodeOps.setTextContent(elm, '');
              }
            } else if (oldVnode.text !== vnode.text) {
              nodeOps.setTextContent(elm, vnode.text);
            }
            if (hasData) {
              if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
                i(oldVnode, vnode);
              }
            }
          }

          function invokeInsertHook(vnode, queue, initial) {
            // delay insert hooks for component root nodes, invoke them after the
            // element is really inserted
            if (initial && vnode.parent) {
              vnode.parent.data.pendingInsert = queue;
            } else {
              for (var i = 0; i < queue.length; ++i) {
                queue[i].data.hook.insert(queue[i]);
              }
            }
          }

          var bailed = false;
          // list of modules that can skip create hook during hydration because they
          // are already rendered on the client or has no need for initialization
          var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

          // Note: this is a browser-only function so we can assume elms are DOM nodes.
          function hydrate(elm, vnode, insertedVnodeQueue) {
            {
              if (!assertNodeMatch(elm, vnode)) {
                return false
              }
            }
            vnode.elm = elm;
            var tag = vnode.tag;
            var data = vnode.data;
            var children = vnode.children;
            if (isDef(data)) {
              if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode, true /* hydrating */ );
              }
              if (isDef(i = vnode.child)) {
                // child component. it should have hydrated its own tree.
                initComponent(vnode, insertedVnodeQueue);
                return true
              }
            }
            if (isDef(tag)) {
              if (isDef(children)) {
                // empty element, allow client to pick up and populate children
                if (!elm.hasChildNodes()) {
                  createChildren(vnode, children, insertedVnodeQueue);
                } else {
                  var childrenMatch = true;
                  var childNode = elm.firstChild;
                  for (var i$1 = 0; i$1 < children.length; i$1++) {
                    if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
                      childrenMatch = false;
                      break
                    }
                    childNode = childNode.nextSibling;
                  }
                  // if childNode is not null, it means the actual childNodes list is
                  // longer than the virtual children list.
                  if (!childrenMatch || childNode) {
                    if ("development" !== 'production' &&
                      typeof console !== 'undefined' &&
                      !bailed) {
                      bailed = true;
                      console.warn('Parent: ', elm);
                      console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                    }
                    return false
                  }
                }
              }
              if (isDef(data)) {
                for (var key in data) {
                  if (!isRenderedModule(key)) {
                    invokeCreateHooks(vnode, insertedVnodeQueue);
                    break
                  }
                }
              }
            } else if (elm.data !== vnode.text) {
              elm.data = vnode.text;
            }
            return true
          }

          function assertNodeMatch(node, vnode) {
            if (vnode.tag) {
              return (
                vnode.tag.indexOf('vue-component') === 0 ||
                vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
              )
            } else {
              return node.nodeType === (vnode.isComment ? 8 : 3)
            }
          }

          return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
            if (!vnode) {
              if (oldVnode) {
                invokeDestroyHook(oldVnode);
              }
              return
            }

            var elm, parent;
            var isInitialPatch = false;
            var insertedVnodeQueue = [];

            if (!oldVnode) {
              // empty mount (likely as component), create new root element
              isInitialPatch = true;
              createElm(vnode, insertedVnodeQueue, parentElm, refElm);
            } else {
              var isRealElement = isDef(oldVnode.nodeType);
              if (!isRealElement && sameVnode(oldVnode, vnode)) {
                // patch existing root node
                patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
              } else {
                if (isRealElement) {
                  // mounting to a real element
                  // check if this is server-rendered content and if we can perform
                  // a successful hydration.
                  if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
                    oldVnode.removeAttribute('server-rendered');
                    hydrating = true;
                  }
                  if (hydrating) {
                    if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                      invokeInsertHook(vnode, insertedVnodeQueue, true);
                      return oldVnode
                    } else {
                      warn(
                        'The client-side rendered virtual DOM tree is not matching ' +
                        'server-rendered content. This is likely caused by incorrect ' +
                        'HTML markup, for example nesting block-level elements inside ' +
                        '<p>, or missing <tbody>. Bailing hydration and performing ' +
                        'full client-side render.'
                      );
                    }
                  }
                  // either not server-rendered, or hydration failed.
                  // create an empty node and replace it
                  oldVnode = emptyNodeAt(oldVnode);
                }
                // replacing existing element
                elm = oldVnode.elm;
                parent = nodeOps.parentNode(elm);
                createElm(vnode, insertedVnodeQueue, parent, nodeOps.nextSibling(elm));

                if (vnode.parent) {
                  // component root element replaced.
                  // update parent placeholder node element, recursively
                  var ancestor = vnode.parent;
                  while (ancestor) {
                    ancestor.elm = vnode.elm;
                    ancestor = ancestor.parent;
                  }
                  if (isPatchable(vnode)) {
                    for (var i = 0; i < cbs.create.length; ++i) {
                      cbs.create[i](emptyNode, vnode.parent);
                    }
                  }
                }

                if (parent !== null) {
                  removeVnodes(parent, [oldVnode], 0, 0);
                } else if (isDef(oldVnode.tag)) {
                  invokeDestroyHook(oldVnode);
                }
              }
            }

            invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
            return vnode.elm
          }
        }

        /*  */

        var directives = {
          create: updateDirectives,
          update: updateDirectives,
          destroy: function unbindDirectives(vnode) {
            updateDirectives(vnode, emptyNode);
          }
        };

        function updateDirectives(oldVnode, vnode) {
          if (oldVnode.data.directives || vnode.data.directives) {
            _update(oldVnode, vnode);
          }
        }

        function _update(oldVnode, vnode) {
          var isCreate = oldVnode === emptyNode;
          var isDestroy = vnode === emptyNode;
          var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
          var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

          var dirsWithInsert = [];
          var dirsWithPostpatch = [];

          var key, oldDir, dir;
          for (key in newDirs) {
            oldDir = oldDirs[key];
            dir = newDirs[key];
            if (!oldDir) {
              // new directive, bind
              callHook$1(dir, 'bind', vnode, oldVnode);
              if (dir.def && dir.def.inserted) {
                dirsWithInsert.push(dir);
              }
            } else {
              // existing directive, update
              dir.oldValue = oldDir.value;
              callHook$1(dir, 'update', vnode, oldVnode);
              if (dir.def && dir.def.componentUpdated) {
                dirsWithPostpatch.push(dir);
              }
            }
          }

          if (dirsWithInsert.length) {
            var callInsert = function() {
              for (var i = 0; i < dirsWithInsert.length; i++) {
                callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
              }
            };
            if (isCreate) {
              mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert, 'dir-insert');
            } else {
              callInsert();
            }
          }

          if (dirsWithPostpatch.length) {
            mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function() {
              for (var i = 0; i < dirsWithPostpatch.length; i++) {
                callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
              }
            }, 'dir-postpatch');
          }

          if (!isCreate) {
            for (key in oldDirs) {
              if (!newDirs[key]) {
                // no longer present, unbind
                callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
              }
            }
          }
        }

        var emptyModifiers = Object.create(null);

        function normalizeDirectives$1(
          dirs,
          vm
        ) {
          var res = Object.create(null);
          if (!dirs) {
            return res
          }
          var i, dir;
          for (i = 0; i < dirs.length; i++) {
            dir = dirs[i];
            if (!dir.modifiers) {
              dir.modifiers = emptyModifiers;
            }
            res[getRawDirName(dir)] = dir;
            dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
          }
          return res
        }

        function getRawDirName(dir) {
          return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
        }

        function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
          var fn = dir.def && dir.def[hook];
          if (fn) {
            fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
          }
        }

        var baseModules = [
          ref,
          directives
        ];

        /*  */

        function updateAttrs(oldVnode, vnode) {
          if (!oldVnode.data.attrs && !vnode.data.attrs) {
            return
          }
          var key, cur, old;
          var elm = vnode.elm;
          var oldAttrs = oldVnode.data.attrs || {};
          var attrs = vnode.data.attrs || {};
          // clone observed objects, as the user probably wants to mutate it
          if (attrs.__ob__) {
            attrs = vnode.data.attrs = extend({}, attrs);
          }

          for (key in attrs) {
            cur = attrs[key];
            old = oldAttrs[key];
            if (old !== cur) {
              setAttr(elm, key, cur);
            }
          }
          // #4391: in IE9, setting type can reset value for input[type=radio]
          /* istanbul ignore if */
          if (isIE9 && attrs.value !== oldAttrs.value) {
            setAttr(elm, 'value', attrs.value);
          }
          for (key in oldAttrs) {
            if (attrs[key] == null) {
              if (isXlink(key)) {
                elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
              } else if (!isEnumeratedAttr(key)) {
                elm.removeAttribute(key);
              }
            }
          }
        }

        function setAttr(el, key, value) {
          if (isBooleanAttr(key)) {
            // set attribute for blank value
            // e.g. <option disabled>Select one</option>
            if (isFalsyAttrValue(value)) {
              el.removeAttribute(key);
            } else {
              el.setAttribute(key, key);
            }
          } else if (isEnumeratedAttr(key)) {
            el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
          } else if (isXlink(key)) {
            if (isFalsyAttrValue(value)) {
              el.removeAttributeNS(xlinkNS, getXlinkProp(key));
            } else {
              el.setAttributeNS(xlinkNS, key, value);
            }
          } else {
            if (isFalsyAttrValue(value)) {
              el.removeAttribute(key);
            } else {
              el.setAttribute(key, value);
            }
          }
        }

        var attrs = {
          create: updateAttrs,
          update: updateAttrs
        };

        /*  */

        function updateClass(oldVnode, vnode) {
          var el = vnode.elm;
          var data = vnode.data;
          var oldData = oldVnode.data;
          if (!data.staticClass && !data.class &&
            (!oldData || (!oldData.staticClass && !oldData.class))) {
            return
          }

          var cls = genClassForVnode(vnode);

          // handle transition classes
          var transitionClass = el._transitionClasses;
          if (transitionClass) {
            cls = concat(cls, stringifyClass(transitionClass));
          }

          // set the class
          if (cls !== el._prevClass) {
            el.setAttribute('class', cls);
            el._prevClass = cls;
          }
        }

        var klass = {
          create: updateClass,
          update: updateClass
        };

        /*  */

        var target$1;

        function add$2(event, handler, once, capture) {
          if (once) {
            var oldHandler = handler;
            handler = function(ev) {
              remove$3(event, handler, capture);
              arguments.length === 1 ? oldHandler(ev) : oldHandler.apply(null, arguments);
            };
          }
          target$1.addEventListener(event, handler, capture);
        }

        function remove$3(event, handler, capture) {
          target$1.removeEventListener(event, handler, capture);
        }

        function updateDOMListeners(oldVnode, vnode) {
          if (!oldVnode.data.on && !vnode.data.on) {
            return
          }
          var on = vnode.data.on || {};
          var oldOn = oldVnode.data.on || {};
          target$1 = vnode.elm;
          updateListeners(on, oldOn, add$2, remove$3, vnode.context);
        }

        var events = {
          create: updateDOMListeners,
          update: updateDOMListeners
        };

        /*  */

        function updateDOMProps(oldVnode, vnode) {
          if (!oldVnode.data.domProps && !vnode.data.domProps) {
            return
          }
          var key, cur;
          var elm = vnode.elm;
          var oldProps = oldVnode.data.domProps || {};
          var props = vnode.data.domProps || {};
          // clone observed objects, as the user probably wants to mutate it
          if (props.__ob__) {
            props = vnode.data.domProps = extend({}, props);
          }

          for (key in oldProps) {
            if (props[key] == null) {
              elm[key] = '';
            }
          }
          for (key in props) {
            cur = props[key];
            // ignore children if the node has textContent or innerHTML,
            // as these will throw away existing DOM nodes and cause removal errors
            // on subsequent patches (#3360)
            if (key === 'textContent' || key === 'innerHTML') {
              if (vnode.children) {
                vnode.children.length = 0;
              }
              if (cur === oldProps[key]) {
                continue
              }
            }
            // #4521: if a click event triggers update before the change event is
            // dispatched on a checkbox/radio input, the input's checked state will
            // be reset and fail to trigger another update.
            /* istanbul ignore next */
            if (key === 'checked' && !isDirty(elm, cur)) {
              continue
            }
            if (key === 'value') {
              // store value as _value as well since
              // non-string values will be stringified
              elm._value = cur;
              // avoid resetting cursor position when value is the same
              var strCur = cur == null ? '' : String(cur);
              if (shouldUpdateValue(elm, vnode, strCur)) {
                elm.value = strCur;
              }
            } else {
              elm[key] = cur;
            }
          }
        }

        // check platforms/web/util/attrs.js acceptValue


        function shouldUpdateValue(
          elm,
          vnode,
          checkVal
        ) {
          if (!elm.composing && (
              vnode.tag === 'option' ||
              isDirty(elm, checkVal) ||
              isInputChanged(vnode, checkVal)
            )) {
            return true
          }
          return false
        }

        function isDirty(elm, checkVal) {
          return document.activeElement !== elm && elm.value !== checkVal
        }

        function isInputChanged(vnode, newVal) {
          var value = vnode.elm.value;
          var modifiers = vnode.elm._vModifiers; // injected by v-model runtime
          if ((modifiers && modifiers.number) || vnode.elm.type === 'number') {
            return toNumber(value) !== toNumber(newVal)
          }
          if (modifiers && modifiers.trim) {
            return value.trim() !== newVal.trim()
          }
          return value !== newVal
        }

        var domProps = {
          create: updateDOMProps,
          update: updateDOMProps
        };

        /*  */

        var parseStyleText = cached(function(cssText) {
          var res = {};
          var listDelimiter = /;(?![^(]*\))/g;
          var propertyDelimiter = /:(.+)/;
          cssText.split(listDelimiter).forEach(function(item) {
            if (item) {
              var tmp = item.split(propertyDelimiter);
              tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
            }
          });
          return res
        });

        // merge static and dynamic style data on the same vnode
        function normalizeStyleData(data) {
          var style = normalizeStyleBinding(data.style);
          // static style is pre-processed into an object during compilation
          // and is always a fresh object, so it's safe to merge into it
          return data.staticStyle ? extend(data.staticStyle, style) : style
        }

        // normalize possible array / string values into Object
        function normalizeStyleBinding(bindingStyle) {
          if (Array.isArray(bindingStyle)) {
            return toObject(bindingStyle)
          }
          if (typeof bindingStyle === 'string') {
            return parseStyleText(bindingStyle)
          }
          return bindingStyle
        }

        /**
         * parent component style should be after child's
         * so that parent component's style could override it
         */
        function getStyle(vnode, checkChild) {
          var res = {};
          var styleData;

          if (checkChild) {
            var childNode = vnode;
            while (childNode.child) {
              childNode = childNode.child._vnode;
              if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
                extend(res, styleData);
              }
            }
          }

          if ((styleData = normalizeStyleData(vnode.data))) {
            extend(res, styleData);
          }

          var parentNode = vnode;
          while ((parentNode = parentNode.parent)) {
            if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
              extend(res, styleData);
            }
          }
          return res
        }

        /*  */

        var cssVarRE = /^--/;
        var importantRE = /\s*!important$/;
        var setProp = function(el, name, val) {
          /* istanbul ignore if */
          if (cssVarRE.test(name)) {
            el.style.setProperty(name, val);
          } else if (importantRE.test(val)) {
            el.style.setProperty(name, val.replace(importantRE, ''), 'important');
          } else {
            el.style[normalize(name)] = val;
          }
        };

        var prefixes = ['Webkit', 'Moz', 'ms'];

        var testEl;
        var normalize = cached(function(prop) {
          testEl = testEl || document.createElement('div');
          prop = camelize(prop);
          if (prop !== 'filter' && (prop in testEl.style)) {
            return prop
          }
          var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
          for (var i = 0; i < prefixes.length; i++) {
            var prefixed = prefixes[i] + upper;
            if (prefixed in testEl.style) {
              return prefixed
            }
          }
        });

        function updateStyle(oldVnode, vnode) {
          var data = vnode.data;
          var oldData = oldVnode.data;

          if (!data.staticStyle && !data.style &&
            !oldData.staticStyle && !oldData.style) {
            return
          }

          var cur, name;
          var el = vnode.elm;
          var oldStaticStyle = oldVnode.data.staticStyle;
          var oldStyleBinding = oldVnode.data.style || {};

          // if static style exists, stylebinding already merged into it when doing normalizeStyleData
          var oldStyle = oldStaticStyle || oldStyleBinding;

          var style = normalizeStyleBinding(vnode.data.style) || {};

          vnode.data.style = style.__ob__ ? extend({}, style) : style;

          var newStyle = getStyle(vnode, true);

          for (name in oldStyle) {
            if (newStyle[name] == null) {
              setProp(el, name, '');
            }
          }
          for (name in newStyle) {
            cur = newStyle[name];
            if (cur !== oldStyle[name]) {
              // ie9 setting to null has no effect, must use empty string
              setProp(el, name, cur == null ? '' : cur);
            }
          }
        }

        var style = {
          create: updateStyle,
          update: updateStyle
        };

        /*  */

        /**
         * Add class with compatibility for SVG since classList is not supported on
         * SVG elements in IE
         */
        function addClass(el, cls) {
          /* istanbul ignore if */
          if (!cls || !cls.trim()) {
            return
          }

          /* istanbul ignore else */
          if (el.classList) {
            if (cls.indexOf(' ') > -1) {
              cls.split(/\s+/).forEach(function(c) {
                return el.classList.add(c);
              });
            } else {
              el.classList.add(cls);
            }
          } else {
            var cur = ' ' + el.getAttribute('class') + ' ';
            if (cur.indexOf(' ' + cls + ' ') < 0) {
              el.setAttribute('class', (cur + cls).trim());
            }
          }
        }

        /**
         * Remove class with compatibility for SVG since classList is not supported on
         * SVG elements in IE
         */
        function removeClass(el, cls) {
          /* istanbul ignore if */
          if (!cls || !cls.trim()) {
            return
          }

          /* istanbul ignore else */
          if (el.classList) {
            if (cls.indexOf(' ') > -1) {
              cls.split(/\s+/).forEach(function(c) {
                return el.classList.remove(c);
              });
            } else {
              el.classList.remove(cls);
            }
          } else {
            var cur = ' ' + el.getAttribute('class') + ' ';
            var tar = ' ' + cls + ' ';
            while (cur.indexOf(tar) >= 0) {
              cur = cur.replace(tar, ' ');
            }
            el.setAttribute('class', cur.trim());
          }
        }

        /*  */

        var hasTransition = inBrowser && !isIE9;
        var TRANSITION = 'transition';
        var ANIMATION = 'animation';

        // Transition property/event sniffing
        var transitionProp = 'transition';
        var transitionEndEvent = 'transitionend';
        var animationProp = 'animation';
        var animationEndEvent = 'animationend';
        if (hasTransition) {
          /* istanbul ignore if */
          if (window.ontransitionend === undefined &&
            window.onwebkittransitionend !== undefined) {
            transitionProp = 'WebkitTransition';
            transitionEndEvent = 'webkitTransitionEnd';
          }
          if (window.onanimationend === undefined &&
            window.onwebkitanimationend !== undefined) {
            animationProp = 'WebkitAnimation';
            animationEndEvent = 'webkitAnimationEnd';
          }
        }

        var raf = (inBrowser && window.requestAnimationFrame) || setTimeout;

        function nextFrame(fn) {
          raf(function() {
            raf(fn);
          });
        }

        function addTransitionClass(el, cls) {
          (el._transitionClasses || (el._transitionClasses = [])).push(cls);
          addClass(el, cls);
        }

        function removeTransitionClass(el, cls) {
          if (el._transitionClasses) {
            remove$1(el._transitionClasses, cls);
          }
          removeClass(el, cls);
        }

        function whenTransitionEnds(
          el,
          expectedType,
          cb
        ) {
          var ref = getTransitionInfo(el, expectedType);
          var type = ref.type;
          var timeout = ref.timeout;
          var propCount = ref.propCount;
          if (!type) {
            return cb()
          }
          var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
          var ended = 0;
          var end = function() {
            el.removeEventListener(event, onEnd);
            cb();
          };
          var onEnd = function(e) {
            if (e.target === el) {
              if (++ended >= propCount) {
                end();
              }
            }
          };
          setTimeout(function() {
            if (ended < propCount) {
              end();
            }
          }, timeout + 1);
          el.addEventListener(event, onEnd);
        }

        var transformRE = /\b(transform|all)(,|$)/;

        function getTransitionInfo(el, expectedType) {
          var styles = window.getComputedStyle(el);
          var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
          var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
          var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
          var animationDelays = styles[animationProp + 'Delay'].split(', ');
          var animationDurations = styles[animationProp + 'Duration'].split(', ');
          var animationTimeout = getTimeout(animationDelays, animationDurations);

          var type;
          var timeout = 0;
          var propCount = 0;
          /* istanbul ignore if */
          if (expectedType === TRANSITION) {
            if (transitionTimeout > 0) {
              type = TRANSITION;
              timeout = transitionTimeout;
              propCount = transitionDurations.length;
            }
          } else if (expectedType === ANIMATION) {
            if (animationTimeout > 0) {
              type = ANIMATION;
              timeout = animationTimeout;
              propCount = animationDurations.length;
            }
          } else {
            timeout = Math.max(transitionTimeout, animationTimeout);
            type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
            propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
          }
          var hasTransform =
            type === TRANSITION &&
            transformRE.test(styles[transitionProp + 'Property']);
          return {
            type: type,
            timeout: timeout,
            propCount: propCount,
            hasTransform: hasTransform
          }
        }

        function getTimeout(delays, durations) {
          /* istanbul ignore next */
          while (delays.length < durations.length) {
            delays = delays.concat(delays);
          }

          return Math.max.apply(null, durations.map(function(d, i) {
            return toMs(d) + toMs(delays[i])
          }))
        }

        function toMs(s) {
          return Number(s.slice(0, -1)) * 1000
        }

        /*  */

        function enter(vnode, toggleDisplay) {
          var el = vnode.elm;

          // call leave callback now
          if (el._leaveCb) {
            el._leaveCb.cancelled = true;
            el._leaveCb();
          }

          var data = resolveTransition(vnode.data.transition);
          if (!data) {
            return
          }

          /* istanbul ignore if */
          if (el._enterCb || el.nodeType !== 1) {
            return
          }

          var css = data.css;
          var type = data.type;
          var enterClass = data.enterClass;
          var enterToClass = data.enterToClass;
          var enterActiveClass = data.enterActiveClass;
          var appearClass = data.appearClass;
          var appearToClass = data.appearToClass;
          var appearActiveClass = data.appearActiveClass;
          var beforeEnter = data.beforeEnter;
          var enter = data.enter;
          var afterEnter = data.afterEnter;
          var enterCancelled = data.enterCancelled;
          var beforeAppear = data.beforeAppear;
          var appear = data.appear;
          var afterAppear = data.afterAppear;
          var appearCancelled = data.appearCancelled;

          // activeInstance will always be the <transition> component managing this
          // transition. One edge case to check is when the <transition> is placed
          // as the root node of a child component. In that case we need to check
          // <transition>'s parent for appear check.
          var context = activeInstance;
          var transitionNode = activeInstance.$vnode;
          while (transitionNode && transitionNode.parent) {
            transitionNode = transitionNode.parent;
            context = transitionNode.context;
          }

          var isAppear = !context._isMounted || !vnode.isRootInsert;

          if (isAppear && !appear && appear !== '') {
            return
          }

          var startClass = isAppear ? appearClass : enterClass;
          var activeClass = isAppear ? appearActiveClass : enterActiveClass;
          var toClass = isAppear ? appearToClass : enterToClass;
          var beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter;
          var enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter;
          var afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter;
          var enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled;

          var expectsCSS = css !== false && !isIE9;
          var userWantsControl =
            enterHook &&
            // enterHook may be a bound method which exposes
            // the length of original fn as _length
            (enterHook._length || enterHook.length) > 1;

          var cb = el._enterCb = once(function() {
            if (expectsCSS) {
              removeTransitionClass(el, toClass);
              removeTransitionClass(el, activeClass);
            }
            if (cb.cancelled) {
              if (expectsCSS) {
                removeTransitionClass(el, startClass);
              }
              enterCancelledHook && enterCancelledHook(el);
            } else {
              afterEnterHook && afterEnterHook(el);
            }
            el._enterCb = null;
          });

          if (!vnode.data.show) {
            // remove pending leave element on enter by injecting an insert hook
            mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function() {
              var parent = el.parentNode;
              var pendingNode = parent && parent._pending && parent._pending[vnode.key];
              if (pendingNode &&
                pendingNode.context === vnode.context &&
                pendingNode.tag === vnode.tag &&
                pendingNode.elm._leaveCb) {
                pendingNode.elm._leaveCb();
              }
              enterHook && enterHook(el, cb);
            }, 'transition-insert');
          }

          // start enter transition
          beforeEnterHook && beforeEnterHook(el);
          if (expectsCSS) {
            addTransitionClass(el, startClass);
            addTransitionClass(el, activeClass);
            nextFrame(function() {
              addTransitionClass(el, toClass);
              removeTransitionClass(el, startClass);
              if (!cb.cancelled && !userWantsControl) {
                whenTransitionEnds(el, type, cb);
              }
            });
          }

          if (vnode.data.show) {
            toggleDisplay && toggleDisplay();
            enterHook && enterHook(el, cb);
          }

          if (!expectsCSS && !userWantsControl) {
            cb();
          }
        }

        function leave(vnode, rm) {
          var el = vnode.elm;

          // call enter callback now
          if (el._enterCb) {
            el._enterCb.cancelled = true;
            el._enterCb();
          }

          var data = resolveTransition(vnode.data.transition);
          if (!data) {
            return rm()
          }

          /* istanbul ignore if */
          if (el._leaveCb || el.nodeType !== 1) {
            return
          }

          var css = data.css;
          var type = data.type;
          var leaveClass = data.leaveClass;
          var leaveToClass = data.leaveToClass;
          var leaveActiveClass = data.leaveActiveClass;
          var beforeLeave = data.beforeLeave;
          var leave = data.leave;
          var afterLeave = data.afterLeave;
          var leaveCancelled = data.leaveCancelled;
          var delayLeave = data.delayLeave;

          var expectsCSS = css !== false && !isIE9;
          var userWantsControl =
            leave &&
            // leave hook may be a bound method which exposes
            // the length of original fn as _length
            (leave._length || leave.length) > 1;

          var cb = el._leaveCb = once(function() {
            if (el.parentNode && el.parentNode._pending) {
              el.parentNode._pending[vnode.key] = null;
            }
            if (expectsCSS) {
              removeTransitionClass(el, leaveToClass);
              removeTransitionClass(el, leaveActiveClass);
            }
            if (cb.cancelled) {
              if (expectsCSS) {
                removeTransitionClass(el, leaveClass);
              }
              leaveCancelled && leaveCancelled(el);
            } else {
              rm();
              afterLeave && afterLeave(el);
            }
            el._leaveCb = null;
          });

          if (delayLeave) {
            delayLeave(performLeave);
          } else {
            performLeave();
          }

          function performLeave() {
            // the delayed leave may have already been cancelled
            if (cb.cancelled) {
              return
            }
            // record leaving element
            if (!vnode.data.show) {
              (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
            }
            beforeLeave && beforeLeave(el);
            if (expectsCSS) {
              addTransitionClass(el, leaveClass);
              addTransitionClass(el, leaveActiveClass);
              nextFrame(function() {
                addTransitionClass(el, leaveToClass);
                removeTransitionClass(el, leaveClass);
                if (!cb.cancelled && !userWantsControl) {
                  whenTransitionEnds(el, type, cb);
                }
              });
            }
            leave && leave(el, cb);
            if (!expectsCSS && !userWantsControl) {
              cb();
            }
          }
        }

        function resolveTransition(def$$1) {
          if (!def$$1) {
            return
          }
          /* istanbul ignore else */
          if (typeof def$$1 === 'object') {
            var res = {};
            if (def$$1.css !== false) {
              extend(res, autoCssTransition(def$$1.name || 'v'));
            }
            extend(res, def$$1);
            return res
          } else if (typeof def$$1 === 'string') {
            return autoCssTransition(def$$1)
          }
        }

        var autoCssTransition = cached(function(name) {
          return {
            enterClass: (name + "-enter"),
            leaveClass: (name + "-leave"),
            appearClass: (name + "-enter"),
            enterToClass: (name + "-enter-to"),
            leaveToClass: (name + "-leave-to"),
            appearToClass: (name + "-enter-to"),
            enterActiveClass: (name + "-enter-active"),
            leaveActiveClass: (name + "-leave-active"),
            appearActiveClass: (name + "-enter-active")
          }
        });

        function once(fn) {
          var called = false;
          return function() {
            if (!called) {
              called = true;
              fn();
            }
          }
        }

        function _enter(_, vnode) {
          if (!vnode.data.show) {
            enter(vnode);
          }
        }

        var transition = inBrowser ? {
          create: _enter,
          activate: _enter,
          remove: function remove(vnode, rm) {
            /* istanbul ignore else */
            if (!vnode.data.show) {
              leave(vnode, rm);
            } else {
              rm();
            }
          }
        } : {};

        var platformModules = [
          attrs,
          klass,
          events,
          domProps,
          style,
          transition
        ];

        /*  */

        // the directive module should be applied last, after all
        // built-in modules have been applied.
        var modules = platformModules.concat(baseModules);

        var patch$1 = createPatchFunction({
          nodeOps: nodeOps,
          modules: modules
        });

        /**
         * Not type checking this file because flow doesn't like attaching
         * properties to Elements.
         */

        var modelableTagRE = /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_-]*)?$/;

        /* istanbul ignore if */
        if (isIE9) {
          // http://www.matts411.com/post/internet-explorer-9-oninput/
          document.addEventListener('selectionchange', function() {
            var el = document.activeElement;
            if (el && el.vmodel) {
              trigger(el, 'input');
            }
          });
        }

        var model = {
          inserted: function inserted(el, binding, vnode) {
            {
              if (!modelableTagRE.test(vnode.tag)) {
                warn(
                  "v-model is not supported on element type: <" + (vnode.tag) + ">. " +
                  'If you are working with contenteditable, it\'s recommended to ' +
                  'wrap a library dedicated for that purpose inside a custom component.',
                  vnode.context
                );
              }
            }
            if (vnode.tag === 'select') {
              var cb = function() {
                setSelected(el, binding, vnode.context);
              };
              cb();
              /* istanbul ignore if */
              if (isIE || isEdge) {
                setTimeout(cb, 0);
              }
            } else if (vnode.tag === 'textarea' || el.type === 'text') {
              el._vModifiers = binding.modifiers;
              if (!binding.modifiers.lazy) {
                if (!isAndroid) {
                  el.addEventListener('compositionstart', onCompositionStart);
                  el.addEventListener('compositionend', onCompositionEnd);
                }
                /* istanbul ignore if */
                if (isIE9) {
                  el.vmodel = true;
                }
              }
            }
          },
          componentUpdated: function componentUpdated(el, binding, vnode) {
            if (vnode.tag === 'select') {
              setSelected(el, binding, vnode.context);
              // in case the options rendered by v-for have changed,
              // it's possible that the value is out-of-sync with the rendered options.
              // detect such cases and filter out values that no longer has a matching
              // option in the DOM.
              var needReset = el.multiple ? binding.value.some(function(v) {
                return hasNoMatchingOption(v, el.options);
              }) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
              if (needReset) {
                trigger(el, 'change');
              }
            }
          }
        };

        function setSelected(el, binding, vm) {
          var value = binding.value;
          var isMultiple = el.multiple;
          if (isMultiple && !Array.isArray(value)) {
            "development" !== 'production' && warn(
              "<select multiple v-model=\"" + (binding.expression) + "\"> " +
              "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
              vm
            );
            return
          }
          var selected, option;
          for (var i = 0, l = el.options.length; i < l; i++) {
            option = el.options[i];
            if (isMultiple) {
              selected = looseIndexOf(value, getValue(option)) > -1;
              if (option.selected !== selected) {
                option.selected = selected;
              }
            } else {
              if (looseEqual(getValue(option), value)) {
                if (el.selectedIndex !== i) {
                  el.selectedIndex = i;
                }
                return
              }
            }
          }
          if (!isMultiple) {
            el.selectedIndex = -1;
          }
        }

        function hasNoMatchingOption(value, options) {
          for (var i = 0, l = options.length; i < l; i++) {
            if (looseEqual(getValue(options[i]), value)) {
              return false
            }
          }
          return true
        }

        function getValue(option) {
          return '_value' in option ? option._value : option.value
        }

        function onCompositionStart(e) {
          e.target.composing = true;
        }

        function onCompositionEnd(e) {
          e.target.composing = false;
          trigger(e.target, 'input');
        }

        function trigger(el, type) {
          var e = document.createEvent('HTMLEvents');
          e.initEvent(type, true, true);
          el.dispatchEvent(e);
        }

        /*  */

        // recursively search for possible transition defined inside the component root
        function locateNode(vnode) {
          return vnode.child && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.child._vnode) : vnode
        }

        var show = {
          bind: function bind(el, ref, vnode) {
            var value = ref.value;

            vnode = locateNode(vnode);
            var transition = vnode.data && vnode.data.transition;
            var originalDisplay = el.__vOriginalDisplay =
              el.style.display === 'none' ? '' : el.style.display;
            if (value && transition && !isIE9) {
              vnode.data.show = true;
              enter(vnode, function() {
                el.style.display = originalDisplay;
              });
            } else {
              el.style.display = value ? originalDisplay : 'none';
            }
          },

          update: function update(el, ref, vnode) {
            var value = ref.value;
            var oldValue = ref.oldValue;

            /* istanbul ignore if */
            if (value === oldValue) {
              return
            }
            vnode = locateNode(vnode);
            var transition = vnode.data && vnode.data.transition;
            if (transition && !isIE9) {
              vnode.data.show = true;
              if (value) {
                enter(vnode, function() {
                  el.style.display = el.__vOriginalDisplay;
                });
              } else {
                leave(vnode, function() {
                  el.style.display = 'none';
                });
              }
            } else {
              el.style.display = value ? el.__vOriginalDisplay : 'none';
            }
          },

          unbind: function unbind(
            el,
            binding,
            vnode,
            oldVnode,
            isDestroy
          ) {
            if (!isDestroy) {
              el.style.display = el.__vOriginalDisplay;
            }
          }
        };

        var platformDirectives = {
          model: model,
          show: show
        };

        /*  */

        // Provides transition support for a single element/component.
        // supports transition mode (out-in / in-out)

        var transitionProps = {
          name: String,
          appear: Boolean,
          css: Boolean,
          mode: String,
          type: String,
          enterClass: String,
          leaveClass: String,
          enterToClass: String,
          leaveToClass: String,
          enterActiveClass: String,
          leaveActiveClass: String,
          appearClass: String,
          appearActiveClass: String,
          appearToClass: String
        };

        // in case the child is also an abstract component, e.g. <keep-alive>
        // we want to recursively retrieve the real component to be rendered
        function getRealChild(vnode) {
          var compOptions = vnode && vnode.componentOptions;
          if (compOptions && compOptions.Ctor.options.abstract) {
            return getRealChild(getFirstComponentChild(compOptions.children))
          } else {
            return vnode
          }
        }

        function extractTransitionData(comp) {
          var data = {};
          var options = comp.$options;
          // props
          for (var key in options.propsData) {
            data[key] = comp[key];
          }
          // events.
          // extract listeners and pass them directly to the transition methods
          var listeners = options._parentListeners;
          for (var key$1 in listeners) {
            data[camelize(key$1)] = listeners[key$1].fn;
          }
          return data
        }

        function placeholder(h, rawChild) {
          return /\d-keep-alive$/.test(rawChild.tag) ? h('keep-alive') : null
        }

        function hasParentTransition(vnode) {
          while ((vnode = vnode.parent)) {
            if (vnode.data.transition) {
              return true
            }
          }
        }

        function isSameChild(child, oldChild) {
          return oldChild.key === child.key && oldChild.tag === child.tag
        }

        var Transition = {
          name: 'transition',
          props: transitionProps,
          abstract: true,
          render: function render(h) {
            var this$1 = this;

            var children = this.$slots.default;
            if (!children) {
              return
            }

            // filter out text nodes (possible whitespaces)
            children = children.filter(function(c) {
              return c.tag;
            });
            /* istanbul ignore if */
            if (!children.length) {
              return
            }

            // warn multiple elements
            if ("development" !== 'production' && children.length > 1) {
              warn(
                '<transition> can only be used on a single element. Use ' +
                '<transition-group> for lists.',
                this.$parent
              );
            }

            var mode = this.mode;

            // warn invalid mode
            if ("development" !== 'production' &&
              mode && mode !== 'in-out' && mode !== 'out-in') {
              warn(
                'invalid <transition> mode: ' + mode,
                this.$parent
              );
            }

            var rawChild = children[0];

            // if this is a component root node and the component's
            // parent container node also has transition, skip.
            if (hasParentTransition(this.$vnode)) {
              return rawChild
            }

            // apply transition data to child
            // use getRealChild() to ignore abstract components e.g. keep-alive
            var child = getRealChild(rawChild);
            /* istanbul ignore if */
            if (!child) {
              return rawChild
            }

            if (this._leaving) {
              return placeholder(h, rawChild)
            }

            var key = child.key = child.key == null || child.isStatic ? ("__v" + (child.tag + this._uid) + "__") : child.key;
            var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
            var oldRawChild = this._vnode;
            var oldChild = getRealChild(oldRawChild);

            // mark v-show
            // so that the transition module can hand over the control to the directive
            if (child.data.directives && child.data.directives.some(function(d) {
                return d.name === 'show';
              })) {
              child.data.show = true;
            }

            if (oldChild && oldChild.data && !isSameChild(child, oldChild)) {
              // replace old child transition data with fresh one
              // important for dynamic transitions!
              var oldData = oldChild && (oldChild.data.transition = extend({}, data));
              // handle transition mode
              if (mode === 'out-in') {
                // return placeholder node and queue update when leave finishes
                this._leaving = true;
                mergeVNodeHook(oldData, 'afterLeave', function() {
                  this$1._leaving = false;
                  this$1.$forceUpdate();
                }, key);
                return placeholder(h, rawChild)
              } else if (mode === 'in-out') {
                var delayedLeave;
                var performLeave = function() {
                  delayedLeave();
                };
                mergeVNodeHook(data, 'afterEnter', performLeave, key);
                mergeVNodeHook(data, 'enterCancelled', performLeave, key);
                mergeVNodeHook(oldData, 'delayLeave', function(leave) {
                  delayedLeave = leave;
                }, key);
              }
            }

            return rawChild
          }
        };

        /*  */

        // Provides transition support for list items.
        // supports move transitions using the FLIP technique.

        // Because the vdom's children update algorithm is "unstable" - i.e.
        // it doesn't guarantee the relative positioning of removed elements,
        // we force transition-group to update its children into two passes:
        // in the first pass, we remove all nodes that need to be removed,
        // triggering their leaving transition; in the second pass, we insert/move
        // into the final disired state. This way in the second pass removed
        // nodes will remain where they should be.

        var props = extend({
          tag: String,
          moveClass: String
        }, transitionProps);

        delete props.mode;

        var TransitionGroup = {
          props: props,

          render: function render(h) {
            var tag = this.tag || this.$vnode.data.tag || 'span';
            var map = Object.create(null);
            var prevChildren = this.prevChildren = this.children;
            var rawChildren = this.$slots.default || [];
            var children = this.children = [];
            var transitionData = extractTransitionData(this);

            for (var i = 0; i < rawChildren.length; i++) {
              var c = rawChildren[i];
              if (c.tag) {
                if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
                  children.push(c);
                  map[c.key] = c;
                  (c.data || (c.data = {})).transition = transitionData;
                } else {
                  var opts = c.componentOptions;
                  var name = opts ? (opts.Ctor.options.name || opts.tag) : c.tag;
                  warn(("<transition-group> children must be keyed: <" + name + ">"));
                }
              }
            }

            if (prevChildren) {
              var kept = [];
              var removed = [];
              for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
                var c$1 = prevChildren[i$1];
                c$1.data.transition = transitionData;
                c$1.data.pos = c$1.elm.getBoundingClientRect();
                if (map[c$1.key]) {
                  kept.push(c$1);
                } else {
                  removed.push(c$1);
                }
              }
              this.kept = h(tag, null, kept);
              this.removed = removed;
            }

            return h(tag, null, children)
          },

          beforeUpdate: function beforeUpdate() {
            // force removing pass
            this.__patch__(
              this._vnode,
              this.kept,
              false, // hydrating
              true // removeOnly (!important, avoids unnecessary moves)
            );
            this._vnode = this.kept;
          },

          updated: function updated() {
            var children = this.prevChildren;
            var moveClass = this.moveClass || ((this.name || 'v') + '-move');
            if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
              return
            }

            // we divide the work into three loops to avoid mixing DOM reads and writes
            // in each iteration - which helps prevent layout thrashing.
            children.forEach(callPendingCbs);
            children.forEach(recordPosition);
            children.forEach(applyTranslation);

            // force reflow to put everything in position
            var f = document.body.offsetHeight; // eslint-disable-line

            children.forEach(function(c) {
              if (c.data.moved) {
                var el = c.elm;
                var s = el.style;
                addTransitionClass(el, moveClass);
                s.transform = s.WebkitTransform = s.transitionDuration = '';
                el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
                  if (!e || /transform$/.test(e.propertyName)) {
                    el.removeEventListener(transitionEndEvent, cb);
                    el._moveCb = null;
                    removeTransitionClass(el, moveClass);
                  }
                });
              }
            });
          },

          methods: {
            hasMove: function hasMove(el, moveClass) {
              /* istanbul ignore if */
              if (!hasTransition) {
                return false
              }
              if (this._hasMove != null) {
                return this._hasMove
              }
              addTransitionClass(el, moveClass);
              var info = getTransitionInfo(el);
              removeTransitionClass(el, moveClass);
              return (this._hasMove = info.hasTransform)
            }
          }
        };

        function callPendingCbs(c) {
          /* istanbul ignore if */
          if (c.elm._moveCb) {
            c.elm._moveCb();
          }
          /* istanbul ignore if */
          if (c.elm._enterCb) {
            c.elm._enterCb();
          }
        }

        function recordPosition(c) {
          c.data.newPos = c.elm.getBoundingClientRect();
        }

        function applyTranslation(c) {
          var oldPos = c.data.pos;
          var newPos = c.data.newPos;
          var dx = oldPos.left - newPos.left;
          var dy = oldPos.top - newPos.top;
          if (dx || dy) {
            c.data.moved = true;
            var s = c.elm.style;
            s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
            s.transitionDuration = '0s';
          }
        }

        var platformComponents = {
          Transition: Transition,
          TransitionGroup: TransitionGroup
        };

        /*  */

        // install platform specific utils
        Vue$3.config.isUnknownElement = isUnknownElement;
        Vue$3.config.isReservedTag = isReservedTag;
        Vue$3.config.getTagNamespace = getTagNamespace;
        Vue$3.config.mustUseProp = mustUseProp;

        // install platform runtime directives & components
        extend(Vue$3.options.directives, platformDirectives);
        extend(Vue$3.options.components, platformComponents);

        // install platform patch function
        Vue$3.prototype.__patch__ = inBrowser ? patch$1 : noop;

        // wrap mount
        Vue$3.prototype.$mount = function(
          el,
          hydrating
        ) {
          el = el && inBrowser ? query(el) : undefined;
          return this._mount(el, hydrating)
        };

        if ("development" !== 'production' &&
          inBrowser && typeof console !== 'undefined') {
          console[console.info ? 'info' : 'log'](
            "You are running Vue in development mode.\n" +
            "Make sure to turn on production mode when deploying for production.\n" +
            "See more tips at https://vuejs.org/guide/deployment.html"
          );
        }

        // devtools global hook
        /* istanbul ignore next */
        setTimeout(function() {
          if (config.devtools) {
            if (devtools) {
              devtools.emit('init', Vue$3);
            } else if (
              "development" !== 'production' &&
              inBrowser && !isEdge && /Chrome\/\d+/.test(window.navigator.userAgent)
            ) {
              console[console.info ? 'info' : 'log'](
                'Download the Vue Devtools extension for a better development experience:\n' +
                'https://github.com/vuejs/vue-devtools'
              );
            }
          }
        }, 0);

        /*  */

        // check whether current browser encodes a char inside attribute values
        function shouldDecode(content, encoded) {
          var div = document.createElement('div');
          div.innerHTML = "<div a=\"" + content + "\">";
          return div.innerHTML.indexOf(encoded) > 0
        }

        // #3663
        // IE encodes newlines inside attribute values while other browsers don't
        var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

        /*  */

        var decoder;

        function decode(html) {
          decoder = decoder || document.createElement('div');
          decoder.innerHTML = html;
          return decoder.textContent
        }

        /*  */

        var isUnaryTag = makeMap(
          'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
          'link,meta,param,source,track,wbr',
          true
        );

        // Elements that you can, intentionally, leave open
        // (and which close themselves)
        var canBeLeftOpenTag = makeMap(
          'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',
          true
        );

        // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
        // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
        var isNonPhrasingTag = makeMap(
          'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
          'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
          'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
          'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
          'title,tr,track',
          true
        );

        /**
         * Not type-checking this file because it's mostly vendor code.
         */

        /*!
         * HTML Parser By John Resig (ejohn.org)
         * Modified by Juriy "kangax" Zaytsev
         * Original code by Erik Arvidsson, Mozilla Public License
         * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
         */

        // Regular Expressions for parsing tags and attributes
        var singleAttrIdentifier = /([^\s"'<>/=]+)/;
        var singleAttrAssign = /(?:=)/;
        var singleAttrValues = [
          // attr value double quotes
          /"([^"]*)"+/.source,
          // attr value, single quotes
          /'([^']*)'+/.source,
          // attr value, no quotes
          /([^\s"'=<>`]+)/.source
        ];
        var attribute = new RegExp(
          '^\\s*' + singleAttrIdentifier.source +
          '(?:\\s*(' + singleAttrAssign.source + ')' +
          '\\s*(?:' + singleAttrValues.join('|') + '))?'
        );

        // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
        // but for Vue templates we can enforce a simple charset
        var ncname = '[a-zA-Z_][\\w\\-\\.]*';
        var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
        var startTagOpen = new RegExp('^<' + qnameCapture);
        var startTagClose = /^\s*(\/?)>/;
        var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
        var doctype = /^<!DOCTYPE [^>]+>/i;
        var comment = /^<!--/;
        var conditionalComment = /^<!\[/;

        var IS_REGEX_CAPTURING_BROKEN = false;
        'x'.replace(/x(.)?/g, function(m, g) {
          IS_REGEX_CAPTURING_BROKEN = g === '';
        });

        // Special Elements (can contain anything)
        var isScriptOrStyle = makeMap('script,style', true);
        var hasLang = function(attr) {
          return attr.name === 'lang' && attr.value !== 'html';
        };
        var isSpecialTag = function(tag, isSFC, stack) {
          if (isScriptOrStyle(tag)) {
            return true
          }
          if (isSFC && stack.length === 1) {
            // top-level template that has no pre-processor
            if (tag === 'template' && !stack[0].attrs.some(hasLang)) {
              return false
            } else {
              return true
            }
          }
          return false
        };

        var reCache = {};

        var ltRE = /&lt;/g;
        var gtRE = /&gt;/g;
        var nlRE = /&#10;/g;
        var ampRE = /&amp;/g;
        var quoteRE = /&quot;/g;

        function decodeAttr(value, shouldDecodeNewlines) {
          if (shouldDecodeNewlines) {
            value = value.replace(nlRE, '\n');
          }
          return value
            .replace(ltRE, '<')
            .replace(gtRE, '>')
            .replace(ampRE, '&')
            .replace(quoteRE, '"')
        }

        function parseHTML(html, options) {
          var stack = [];
          var expectHTML = options.expectHTML;
          var isUnaryTag$$1 = options.isUnaryTag || no;
          var index = 0;
          var last, lastTag;
          while (html) {
            last = html;
            // Make sure we're not in a script or style element
            if (!lastTag || !isSpecialTag(lastTag, options.sfc, stack)) {
              var textEnd = html.indexOf('<');
              if (textEnd === 0) {
                // Comment:
                if (comment.test(html)) {
                  var commentEnd = html.indexOf('-->');

                  if (commentEnd >= 0) {
                    advance(commentEnd + 3);
                    continue
                  }
                }

                // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
                if (conditionalComment.test(html)) {
                  var conditionalEnd = html.indexOf(']>');

                  if (conditionalEnd >= 0) {
                    advance(conditionalEnd + 2);
                    continue
                  }
                }

                // Doctype:
                var doctypeMatch = html.match(doctype);
                if (doctypeMatch) {
                  advance(doctypeMatch[0].length);
                  continue
                }

                // End tag:
                var endTagMatch = html.match(endTag);
                if (endTagMatch) {
                  var curIndex = index;
                  advance(endTagMatch[0].length);
                  parseEndTag(endTagMatch[0], endTagMatch[1], curIndex, index);
                  continue
                }

                // Start tag:
                var startTagMatch = parseStartTag();
                if (startTagMatch) {
                  handleStartTag(startTagMatch);
                  continue
                }
              }

              var text = (void 0),
                rest$1 = (void 0),
                next = (void 0);
              if (textEnd > 0) {
                rest$1 = html.slice(textEnd);
                while (!endTag.test(rest$1) &&
                  !startTagOpen.test(rest$1) &&
                  !comment.test(rest$1) &&
                  !conditionalComment.test(rest$1)
                ) {
                  // < in plain text, be forgiving and treat it as text
                  next = rest$1.indexOf('<', 1);
                  if (next < 0) {
                    break
                  }
                  textEnd += next;
                  rest$1 = html.slice(textEnd);
                }
                text = html.substring(0, textEnd);
                advance(textEnd);
              }

              if (textEnd < 0) {
                text = html;
                html = '';
              }

              if (options.chars && text) {
                options.chars(text);
              }
            } else {
              var stackedTag = lastTag.toLowerCase();
              var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
              var endTagLength = 0;
              var rest = html.replace(reStackedTag, function(all, text, endTag) {
                endTagLength = endTag.length;
                if (stackedTag !== 'script' && stackedTag !== 'style' && stackedTag !== 'noscript') {
                  text = text
                    .replace(/<!--([\s\S]*?)-->/g, '$1')
                    .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
                }
                if (options.chars) {
                  options.chars(text);
                }
                return ''
              });
              index += html.length - rest.length;
              html = rest;
              parseEndTag('</' + stackedTag + '>', stackedTag, index - endTagLength, index);
            }

            if (html === last && options.chars) {
              options.chars(html);
              break
            }
          }

          // Clean up any remaining tags
          parseEndTag();

          function advance(n) {
            index += n;
            html = html.substring(n);
          }

          function parseStartTag() {
            var start = html.match(startTagOpen);
            if (start) {
              var match = {
                tagName: start[1],
                attrs: [],
                start: index
              };
              advance(start[0].length);
              var end, attr;
              while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push(attr);
              }
              if (end) {
                match.unarySlash = end[1];
                advance(end[0].length);
                match.end = index;
                return match
              }
            }
          }

          function handleStartTag(match) {
            var tagName = match.tagName;
            var unarySlash = match.unarySlash;

            if (expectHTML) {
              if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
                parseEndTag('', lastTag);
              }
              if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
                parseEndTag('', tagName);
              }
            }

            var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

            var l = match.attrs.length;
            var attrs = new Array(l);
            for (var i = 0; i < l; i++) {
              var args = match.attrs[i];
              // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
              if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
                if (args[3] === '') {
                  delete args[3];
                }
                if (args[4] === '') {
                  delete args[4];
                }
                if (args[5] === '') {
                  delete args[5];
                }
              }
              var value = args[3] || args[4] || args[5] || '';
              attrs[i] = {
                name: args[1],
                value: decodeAttr(
                  value,
                  options.shouldDecodeNewlines
                )
              };
            }

            if (!unary) {
              stack.push({
                tag: tagName,
                attrs: attrs
              });
              lastTag = tagName;
              unarySlash = '';
            }

            if (options.start) {
              options.start(tagName, attrs, unary, match.start, match.end);
            }
          }

          function parseEndTag(tag, tagName, start, end) {
            var pos;
            if (start == null) {
              start = index;
            }
            if (end == null) {
              end = index;
            }

            // Find the closest opened tag of the same type
            if (tagName) {
              var needle = tagName.toLowerCase();
              for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].tag.toLowerCase() === needle) {
                  break
                }
              }
            } else {
              // If no tag name is provided, clean shop
              pos = 0;
            }

            if (pos >= 0) {
              // Close all the open elements, up the stack
              for (var i = stack.length - 1; i >= pos; i--) {
                if (options.end) {
                  options.end(stack[i].tag, start, end);
                }
              }

              // Remove the open elements from the stack
              stack.length = pos;
              lastTag = pos && stack[pos - 1].tag;
            } else if (tagName.toLowerCase() === 'br') {
              if (options.start) {
                options.start(tagName, [], true, start, end);
              }
            } else if (tagName.toLowerCase() === 'p') {
              if (options.start) {
                options.start(tagName, [], false, start, end);
              }
              if (options.end) {
                options.end(tagName, start, end);
              }
            }
          }
        }

        /*  */

        function parseFilters(exp) {
          var inSingle = false;
          var inDouble = false;
          var inTemplateString = false;
          var inRegex = false;
          var curly = 0;
          var square = 0;
          var paren = 0;
          var lastFilterIndex = 0;
          var c, prev, i, expression, filters;

          for (i = 0; i < exp.length; i++) {
            prev = c;
            c = exp.charCodeAt(i);
            if (inSingle) {
              if (c === 0x27 && prev !== 0x5C) {
                inSingle = false;
              }
            } else if (inDouble) {
              if (c === 0x22 && prev !== 0x5C) {
                inDouble = false;
              }
            } else if (inTemplateString) {
              if (c === 0x60 && prev !== 0x5C) {
                inTemplateString = false;
              }
            } else if (inRegex) {
              if (c === 0x2f && prev !== 0x5C) {
                inRegex = false;
              }
            } else if (
              c === 0x7C && // pipe
              exp.charCodeAt(i + 1) !== 0x7C &&
              exp.charCodeAt(i - 1) !== 0x7C &&
              !curly && !square && !paren
            ) {
              if (expression === undefined) {
                // first filter, end of expression
                lastFilterIndex = i + 1;
                expression = exp.slice(0, i).trim();
              } else {
                pushFilter();
              }
            } else {
              switch (c) {
                case 0x22:
                  inDouble = true;
                  break // "
                case 0x27:
                  inSingle = true;
                  break // '
                case 0x60:
                  inTemplateString = true;
                  break // `
                case 0x28:
                  paren++;
                  break // (
                case 0x29:
                  paren--;
                  break // )
                case 0x5B:
                  square++;
                  break // [
                case 0x5D:
                  square--;
                  break // ]
                case 0x7B:
                  curly++;
                  break // {
                case 0x7D:
                  curly--;
                  break // }
              }
              if (c === 0x2f) { // /
                var j = i - 1;
                var p = (void 0);
                // find first non-whitespace prev char
                for (; j >= 0; j--) {
                  p = exp.charAt(j);
                  if (p !== ' ') {
                    break
                  }
                }
                if (!p || !/[\w$]/.test(p)) {
                  inRegex = true;
                }
              }
            }
          }

          if (expression === undefined) {
            expression = exp.slice(0, i).trim();
          } else if (lastFilterIndex !== 0) {
            pushFilter();
          }

          function pushFilter() {
            (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
            lastFilterIndex = i + 1;
          }

          if (filters) {
            for (i = 0; i < filters.length; i++) {
              expression = wrapFilter(expression, filters[i]);
            }
          }

          return expression
        }

        function wrapFilter(exp, filter) {
          var i = filter.indexOf('(');
          if (i < 0) {
            // _f: resolveFilter
            return ("_f(\"" + filter + "\")(" + exp + ")")
          } else {
            var name = filter.slice(0, i);
            var args = filter.slice(i + 1);
            return ("_f(\"" + name + "\")(" + exp + "," + args)
          }
        }

        /*  */

        var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
        var regexEscapeRE = /[-.*+?^${}()|[\]/\\]/g;

        var buildRegex = cached(function(delimiters) {
          var open = delimiters[0].replace(regexEscapeRE, '\\$&');
          var close = delimiters[1].replace(regexEscapeRE, '\\$&');
          return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
        });

        function parseText(
          text,
          delimiters
        ) {
          var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
          if (!tagRE.test(text)) {
            return
          }
          var tokens = [];
          var lastIndex = tagRE.lastIndex = 0;
          var match, index;
          while ((match = tagRE.exec(text))) {
            index = match.index;
            // push text token
            if (index > lastIndex) {
              tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
            // tag token
            var exp = parseFilters(match[1].trim());
            tokens.push(("_s(" + exp + ")"));
            lastIndex = index + match[0].length;
          }
          if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
          }
          return tokens.join('+')
        }

        /*  */

        function baseWarn(msg) {
          console.error(("[Vue parser]: " + msg));
        }

        function pluckModuleFunction(
          modules,
          key
        ) {
          return modules ? modules.map(function(m) {
            return m[key];
          }).filter(function(_) {
            return _;
          }) : []
        }

        function addProp(el, name, value) {
          (el.props || (el.props = [])).push({
            name: name,
            value: value
          });
        }

        function addAttr(el, name, value) {
          (el.attrs || (el.attrs = [])).push({
            name: name,
            value: value
          });
        }

        function addDirective(
          el,
          name,
          rawName,
          value,
          arg,
          modifiers
        ) {
          (el.directives || (el.directives = [])).push({
            name: name,
            rawName: rawName,
            value: value,
            arg: arg,
            modifiers: modifiers
          });
        }

        function addHandler(
          el,
          name,
          value,
          modifiers,
          important
        ) {
          // check capture modifier
          if (modifiers && modifiers.capture) {
            delete modifiers.capture;
            name = '!' + name; // mark the event as captured
          }
          if (modifiers && modifiers.once) {
            delete modifiers.once;
            name = '~' + name; // mark the event as once
          }
          var events;
          if (modifiers && modifiers.native) {
            delete modifiers.native;
            events = el.nativeEvents || (el.nativeEvents = {});
          } else {
            events = el.events || (el.events = {});
          }
          var newHandler = {
            value: value,
            modifiers: modifiers
          };
          var handlers = events[name];
          /* istanbul ignore if */
          if (Array.isArray(handlers)) {
            important ? handlers.unshift(newHandler) : handlers.push(newHandler);
          } else if (handlers) {
            events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
          } else {
            events[name] = newHandler;
          }
        }

        function getBindingAttr(
          el,
          name,
          getStatic
        ) {
          var dynamicValue =
            getAndRemoveAttr(el, ':' + name) ||
            getAndRemoveAttr(el, 'v-bind:' + name);
          if (dynamicValue != null) {
            return parseFilters(dynamicValue)
          } else if (getStatic !== false) {
            var staticValue = getAndRemoveAttr(el, name);
            if (staticValue != null) {
              return JSON.stringify(staticValue)
            }
          }
        }

        function getAndRemoveAttr(el, name) {
          var val;
          if ((val = el.attrsMap[name]) != null) {
            var list = el.attrsList;
            for (var i = 0, l = list.length; i < l; i++) {
              if (list[i].name === name) {
                list.splice(i, 1);
                break
              }
            }
          }
          return val
        }

        var len;
        var str;
        var chr;
        var index$1;
        var expressionPos;
        var expressionEndPos;

        /**
         * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
         *
         * for loop possible cases:
         *
         * - test
         * - test[idx]
         * - test[test1[idx]]
         * - test["a"][idx]
         * - xxx.test[a[a].test1[idx]]
         * - test.xxx.a["asa"][test1[idx]]
         *
         */

        function parseModel(val) {
          str = val;
          len = str.length;
          index$1 = expressionPos = expressionEndPos = 0;

          if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
            return {
              exp: val,
              idx: null
            }
          }

          while (!eof()) {
            chr = next();
            /* istanbul ignore if */
            if (isStringStart(chr)) {
              parseString(chr);
            } else if (chr === 0x5B) {
              parseBracket(chr);
            }
          }

          return {
            exp: val.substring(0, expressionPos),
            idx: val.substring(expressionPos + 1, expressionEndPos)
          }
        }

        function next() {
          return str.charCodeAt(++index$1)
        }

        function eof() {
          return index$1 >= len
        }

        function isStringStart(chr) {
          return chr === 0x22 || chr === 0x27
        }

        function parseBracket(chr) {
          var inBracket = 1;
          expressionPos = index$1;
          while (!eof()) {
            chr = next();
            if (isStringStart(chr)) {
              parseString(chr);
              continue
            }
            if (chr === 0x5B) {
              inBracket++;
            }
            if (chr === 0x5D) {
              inBracket--;
            }
            if (inBracket === 0) {
              expressionEndPos = index$1;
              break
            }
          }
        }

        function parseString(chr) {
          var stringQuote = chr;
          while (!eof()) {
            chr = next();
            if (chr === stringQuote) {
              break
            }
          }
        }

        /*  */

        var dirRE = /^v-|^@|^:/;
        var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
        var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;
        var bindRE = /^:|^v-bind:/;
        var onRE = /^@|^v-on:/;
        var argRE = /:(.*)$/;
        var modifierRE = /\.[^.]+/g;

        var decodeHTMLCached = cached(decode);

        // configurable state
        var warn$1;
        var platformGetTagNamespace;
        var platformMustUseProp;
        var platformIsPreTag;
        var preTransforms;
        var transforms;
        var postTransforms;
        var delimiters;

        /**
         * Convert HTML string to AST.
         */
        function parse(
          template,
          options
        ) {
          warn$1 = options.warn || baseWarn;
          platformGetTagNamespace = options.getTagNamespace || no;
          platformMustUseProp = options.mustUseProp || no;
          platformIsPreTag = options.isPreTag || no;
          preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
          transforms = pluckModuleFunction(options.modules, 'transformNode');
          postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
          delimiters = options.delimiters;
          var stack = [];
          var preserveWhitespace = options.preserveWhitespace !== false;
          var root;
          var currentParent;
          var inVPre = false;
          var inPre = false;
          var warned = false;
          parseHTML(template, {
            expectHTML: options.expectHTML,
            isUnaryTag: options.isUnaryTag,
            shouldDecodeNewlines: options.shouldDecodeNewlines,
            start: function start(tag, attrs, unary) {
              // check namespace.
              // inherit parent ns if there is one
              var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

              // handle IE svg bug
              /* istanbul ignore if */
              if (isIE && ns === 'svg') {
                attrs = guardIESVGBug(attrs);
              }

              var element = {
                type: 1,
                tag: tag,
                attrsList: attrs,
                attrsMap: makeAttrsMap(attrs),
                parent: currentParent,
                children: []
              };
              if (ns) {
                element.ns = ns;
              }

              if (isForbiddenTag(element) && !isServerRendering()) {
                element.forbidden = true;
                "development" !== 'production' && warn$1(
                  'Templates should only be responsible for mapping the state to the ' +
                  'UI. Avoid placing tags with side-effects in your templates, such as ' +
                  "<" + tag + ">" + ', as they will not be parsed.'
                );
              }

              // apply pre-transforms
              for (var i = 0; i < preTransforms.length; i++) {
                preTransforms[i](element, options);
              }

              if (!inVPre) {
                processPre(element);
                if (element.pre) {
                  inVPre = true;
                }
              }
              if (platformIsPreTag(element.tag)) {
                inPre = true;
              }
              if (inVPre) {
                processRawAttrs(element);
              } else {
                processFor(element);
                processIf(element);
                processOnce(element);
                processKey(element);

                // determine whether this is a plain element after
                // removing structural attributes
                element.plain = !element.key && !attrs.length;

                processRef(element);
                processSlot(element);
                processComponent(element);
                for (var i$1 = 0; i$1 < transforms.length; i$1++) {
                  transforms[i$1](element, options);
                }
                processAttrs(element);
              }

              function checkRootConstraints(el) {
                if ("development" !== 'production' && !warned) {
                  if (el.tag === 'slot' || el.tag === 'template') {
                    warned = true;
                    warn$1(
                      "Cannot use <" + (el.tag) + "> as component root element because it may " +
                      'contain multiple nodes:\n' + template
                    );
                  }
                  if (el.attrsMap.hasOwnProperty('v-for')) {
                    warned = true;
                    warn$1(
                      'Cannot use v-for on stateful component root element because ' +
                      'it renders multiple elements:\n' + template
                    );
                  }
                }
              }

              // tree management
              if (!root) {
                root = element;
                checkRootConstraints(root);
              } else if (!stack.length) {
                // allow root elements with v-if, v-else-if and v-else
                if (root.if && (element.elseif || element.else)) {
                  checkRootConstraints(element);
                  addIfCondition(root, {
                    exp: element.elseif,
                    block: element
                  });
                } else if ("development" !== 'production' && !warned) {
                  warned = true;
                  warn$1(
                    "Component template should contain exactly one root element:" +
                    "\n\n" + template + "\n\n" +
                    "If you are using v-if on multiple elements, " +
                    "use v-else-if to chain them instead."
                  );
                }
              }
              if (currentParent && !element.forbidden) {
                if (element.elseif || element.else) {
                  processIfConditions(element, currentParent);
                } else if (element.slotScope) { // scoped slot
                  currentParent.plain = false;
                  var name = element.slotTarget || 'default';
                  (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                } else {
                  currentParent.children.push(element);
                  element.parent = currentParent;
                }
              }
              if (!unary) {
                currentParent = element;
                stack.push(element);
              }
              // apply post-transforms
              for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
                postTransforms[i$2](element, options);
              }
            },

            end: function end() {
              // remove trailing whitespace
              var element = stack[stack.length - 1];
              var lastNode = element.children[element.children.length - 1];
              if (lastNode && lastNode.type === 3 && lastNode.text === ' ') {
                element.children.pop();
              }
              // pop stack
              stack.length -= 1;
              currentParent = stack[stack.length - 1];
              // check pre state
              if (element.pre) {
                inVPre = false;
              }
              if (platformIsPreTag(element.tag)) {
                inPre = false;
              }
            },

            chars: function chars(text) {
              if (!currentParent) {
                if ("development" !== 'production' && !warned && text === template) {
                  warned = true;
                  warn$1(
                    'Component template requires a root element, rather than just text:\n\n' + template
                  );
                }
                return
              }
              // IE textarea placeholder bug
              /* istanbul ignore if */
              if (isIE &&
                currentParent.tag === 'textarea' &&
                currentParent.attrsMap.placeholder === text) {
                return
              }
              var children = currentParent.children;
              text = inPre || text.trim() ? decodeHTMLCached(text)
                // only preserve whitespace if its not right after a starting tag
                : preserveWhitespace && children.length ? ' ' : '';
              if (text) {
                var expression;
                if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
                  children.push({
                    type: 2,
                    expression: expression,
                    text: text
                  });
                } else if (text !== ' ' || children[children.length - 1].text !== ' ') {
                  currentParent.children.push({
                    type: 3,
                    text: text
                  });
                }
              }
            }
          });
          return root
        }

        function processPre(el) {
          if (getAndRemoveAttr(el, 'v-pre') != null) {
            el.pre = true;
          }
        }

        function processRawAttrs(el) {
          var l = el.attrsList.length;
          if (l) {
            var attrs = el.attrs = new Array(l);
            for (var i = 0; i < l; i++) {
              attrs[i] = {
                name: el.attrsList[i].name,
                value: JSON.stringify(el.attrsList[i].value)
              };
            }
          } else if (!el.pre) {
            // non root node in pre blocks with no attributes
            el.plain = true;
          }
        }

        function processKey(el) {
          var exp = getBindingAttr(el, 'key');
          if (exp) {
            if ("development" !== 'production' && el.tag === 'template') {
              warn$1("<template> cannot be keyed. Place the key on real elements instead.");
            }
            el.key = exp;
          }
        }

        function processRef(el) {
          var ref = getBindingAttr(el, 'ref');
          if (ref) {
            el.ref = ref;
            el.refInFor = checkInFor(el);
          }
        }

        function processFor(el) {
          var exp;
          if ((exp = getAndRemoveAttr(el, 'v-for'))) {
            var inMatch = exp.match(forAliasRE);
            if (!inMatch) {
              "development" !== 'production' && warn$1(
                ("Invalid v-for expression: " + exp)
              );
              return
            }
            el.for = inMatch[2].trim();
            var alias = inMatch[1].trim();
            var iteratorMatch = alias.match(forIteratorRE);
            if (iteratorMatch) {
              el.alias = iteratorMatch[1].trim();
              el.iterator1 = iteratorMatch[2].trim();
              if (iteratorMatch[3]) {
                el.iterator2 = iteratorMatch[3].trim();
              }
            } else {
              el.alias = alias;
            }
          }
        }

        function processIf(el) {
          var exp = getAndRemoveAttr(el, 'v-if');
          if (exp) {
            el.if = exp;
            addIfCondition(el, {
              exp: exp,
              block: el
            });
          } else {
            if (getAndRemoveAttr(el, 'v-else') != null) {
              el.else = true;
            }
            var elseif = getAndRemoveAttr(el, 'v-else-if');
            if (elseif) {
              el.elseif = elseif;
            }
          }
        }

        function processIfConditions(el, parent) {
          var prev = findPrevElement(parent.children);
          if (prev && prev.if) {
            addIfCondition(prev, {
              exp: el.elseif,
              block: el
            });
          } else {
            warn$1(
              "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
              "used on element <" + (el.tag) + "> without corresponding v-if."
            );
          }
        }

        function findPrevElement(children) {
          var i = children.length;
          while (i--) {
            if (children[i].type === 1) {
              return children[i]
            } else {
              if ("development" !== 'production' && children[i].text !== ' ') {
                warn$1(
                  "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
                  "will be ignored."
                );
              }
              children.pop();
            }
          }
        }

        function addIfCondition(el, condition) {
          if (!el.ifConditions) {
            el.ifConditions = [];
          }
          el.ifConditions.push(condition);
        }

        function processOnce(el) {
          var once = getAndRemoveAttr(el, 'v-once');
          if (once != null) {
            el.once = true;
          }
        }

        function processSlot(el) {
          if (el.tag === 'slot') {
            el.slotName = getBindingAttr(el, 'name');
            if ("development" !== 'production' && el.key) {
              warn$1(
                "`key` does not work on <slot> because slots are abstract outlets " +
                "and can possibly expand into multiple elements. " +
                "Use the key on a wrapping element instead."
              );
            }
          } else {
            var slotTarget = getBindingAttr(el, 'slot');
            if (slotTarget) {
              el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
            }
            if (el.tag === 'template') {
              el.slotScope = getAndRemoveAttr(el, 'scope');
            }
          }
        }

        function processComponent(el) {
          var binding;
          if ((binding = getBindingAttr(el, 'is'))) {
            el.component = binding;
          }
          if (getAndRemoveAttr(el, 'inline-template') != null) {
            el.inlineTemplate = true;
          }
        }

        function processAttrs(el) {
          var list = el.attrsList;
          var i, l, name, rawName, value, arg, modifiers, isProp;
          for (i = 0, l = list.length; i < l; i++) {
            name = rawName = list[i].name;
            value = list[i].value;
            if (dirRE.test(name)) {
              // mark element as dynamic
              el.hasBindings = true;
              // modifiers
              modifiers = parseModifiers(name);
              if (modifiers) {
                name = name.replace(modifierRE, '');
              }
              if (bindRE.test(name)) { // v-bind
                name = name.replace(bindRE, '');
                value = parseFilters(value);
                isProp = false;
                if (modifiers) {
                  if (modifiers.prop) {
                    isProp = true;
                    name = camelize(name);
                    if (name === 'innerHtml') {
                      name = 'innerHTML';
                    }
                  }
                  if (modifiers.camel) {
                    name = camelize(name);
                  }
                }
                if (isProp || platformMustUseProp(el.tag, name)) {
                  addProp(el, name, value);
                } else {
                  addAttr(el, name, value);
                }
              } else if (onRE.test(name)) { // v-on
                name = name.replace(onRE, '');
                addHandler(el, name, value, modifiers);
              } else { // normal directives
                name = name.replace(dirRE, '');
                // parse arg
                var argMatch = name.match(argRE);
                if (argMatch && (arg = argMatch[1])) {
                  name = name.slice(0, -(arg.length + 1));
                }
                addDirective(el, name, rawName, value, arg, modifiers);
                if ("development" !== 'production' && name === 'model') {
                  checkForAliasModel(el, value);
                }
              }
            } else {
              // literal attribute
              {
                var expression = parseText(value, delimiters);
                if (expression) {
                  warn$1(
                    name + "=\"" + value + "\": " +
                    'Interpolation inside attributes has been removed. ' +
                    'Use v-bind or the colon shorthand instead. For example, ' +
                    'instead of <div id="{{ val }}">, use <div :id="val">.'
                  );
                }
              }
              addAttr(el, name, JSON.stringify(value));
              // #4530 also bind special attributes as props even if they are static
              // so that patches between dynamic/static are consistent
              if (platformMustUseProp(el.tag, name)) {
                if (name === 'value') {
                  addProp(el, name, JSON.stringify(value));
                } else {
                  addProp(el, name, 'true');
                }
              }
            }
          }
        }

        function checkInFor(el) {
          var parent = el;
          while (parent) {
            if (parent.for !== undefined) {
              return true
            }
            parent = parent.parent;
          }
          return false
        }

        function parseModifiers(name) {
          var match = name.match(modifierRE);
          if (match) {
            var ret = {};
            match.forEach(function(m) {
              ret[m.slice(1)] = true;
            });
            return ret
          }
        }

        function makeAttrsMap(attrs) {
          var map = {};
          for (var i = 0, l = attrs.length; i < l; i++) {
            if ("development" !== 'production' && map[attrs[i].name] && !isIE) {
              warn$1('duplicate attribute: ' + attrs[i].name);
            }
            map[attrs[i].name] = attrs[i].value;
          }
          return map
        }

        function isForbiddenTag(el) {
          return (
            el.tag === 'style' ||
            (el.tag === 'script' && (!el.attrsMap.type ||
              el.attrsMap.type === 'text/javascript'
            ))
          )
        }

        var ieNSBug = /^xmlns:NS\d+/;
        var ieNSPrefix = /^NS\d+:/;

        /* istanbul ignore next */
        function guardIESVGBug(attrs) {
          var res = [];
          for (var i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (!ieNSBug.test(attr.name)) {
              attr.name = attr.name.replace(ieNSPrefix, '');
              res.push(attr);
            }
          }
          return res
        }

        function checkForAliasModel(el, value) {
          var _el = el;
          while (_el) {
            if (_el.for && _el.alias === value) {
              warn$1(
                "<" + (el.tag) + " v-model=\"" + value + "\">: " +
                "You are binding v-model directly to a v-for iteration alias. " +
                "This will not be able to modify the v-for source array because " +
                "writing to the alias is like modifying a function local variable. " +
                "Consider using an array of objects and use v-model on an object property instead."
              );
            }
            _el = _el.parent;
          }
        }

        /*  */

        var isStaticKey;
        var isPlatformReservedTag;

        var genStaticKeysCached = cached(genStaticKeys$1);

        /**
         * Goal of the optimizer: walk the generated template AST tree
         * and detect sub-trees that are purely static, i.e. parts of
         * the DOM that never needs to change.
         *
         * Once we detect these sub-trees, we can:
         *
         * 1. Hoist them into constants, so that we no longer need to
         *    create fresh nodes for them on each re-render;
         * 2. Completely skip them in the patching process.
         */
        function optimize(root, options) {
          if (!root) {
            return
          }
          isStaticKey = genStaticKeysCached(options.staticKeys || '');
          isPlatformReservedTag = options.isReservedTag || no;
          // first pass: mark all non-static nodes.
          markStatic(root);
          // second pass: mark static roots.
          markStaticRoots(root, false);
        }

        function genStaticKeys$1(keys) {
          return makeMap(
            'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
            (keys ? ',' + keys : '')
          )
        }

        function markStatic(node) {
          node.static = isStatic(node);
          if (node.type === 1) {
            // do not make component slot content static. this avoids
            // 1. components not able to mutate slot nodes
            // 2. static slot content fails for hot-reloading
            if (!isPlatformReservedTag(node.tag) &&
              node.tag !== 'slot' &&
              node.attrsMap['inline-template'] == null
            ) {
              return
            }
            for (var i = 0, l = node.children.length; i < l; i++) {
              var child = node.children[i];
              markStatic(child);
              if (!child.static) {
                node.static = false;
              }
            }
          }
        }

        function markStaticRoots(node, isInFor) {
          if (node.type === 1) {
            if (node.static || node.once) {
              node.staticInFor = isInFor;
            }
            // For a node to qualify as a static root, it should have children that
            // are not just static text. Otherwise the cost of hoisting out will
            // outweigh the benefits and it's better off to just always render it fresh.
            if (node.static && node.children.length && !(
                node.children.length === 1 &&
                node.children[0].type === 3
              )) {
              node.staticRoot = true;
              return
            } else {
              node.staticRoot = false;
            }
            if (node.children) {
              for (var i = 0, l = node.children.length; i < l; i++) {
                markStaticRoots(node.children[i], isInFor || !!node.for);
              }
            }
            if (node.ifConditions) {
              walkThroughConditionsBlocks(node.ifConditions, isInFor);
            }
          }
        }

        function walkThroughConditionsBlocks(conditionBlocks, isInFor) {
          for (var i = 1, len = conditionBlocks.length; i < len; i++) {
            markStaticRoots(conditionBlocks[i].block, isInFor);
          }
        }

        function isStatic(node) {
          if (node.type === 2) { // expression
            return false
          }
          if (node.type === 3) { // text
            return true
          }
          return !!(node.pre || (!node.hasBindings && // no dynamic bindings
            !node.if && !node.for && // not v-if or v-for or v-else
            !isBuiltInTag(node.tag) && // not a built-in
            isPlatformReservedTag(node.tag) && // not a component
            !isDirectChildOfTemplateFor(node) &&
            Object.keys(node).every(isStaticKey)
          ))
        }

        function isDirectChildOfTemplateFor(node) {
          while (node.parent) {
            node = node.parent;
            if (node.tag !== 'template') {
              return false
            }
            if (node.for) {
              return true
            }
          }
          return false
        }

        /*  */

        var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
        var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

        // keyCode aliases
        var keyCodes = {
          esc: 27,
          tab: 9,
          enter: 13,
          space: 32,
          up: 38,
          left: 37,
          right: 39,
          down: 40,
          'delete': [8, 46]
        };

        var modifierCode = {
          stop: '$event.stopPropagation();',
          prevent: '$event.preventDefault();',
          self: 'if($event.target !== $event.currentTarget)return;',
          ctrl: 'if(!$event.ctrlKey)return;',
          shift: 'if(!$event.shiftKey)return;',
          alt: 'if(!$event.altKey)return;',
          meta: 'if(!$event.metaKey)return;'
        };

        function genHandlers(events, native) {
          var res = native ? 'nativeOn:{' : 'on:{';
          for (var name in events) {
            res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
          }
          return res.slice(0, -1) + '}'
        }

        function genHandler(
          name,
          handler
        ) {
          if (!handler) {
            return 'function(){}'
          } else if (Array.isArray(handler)) {
            return ("[" + (handler.map(function(handler) {
              return genHandler(name, handler);
            }).join(',')) + "]")
          } else if (!handler.modifiers) {
            return fnExpRE.test(handler.value) || simplePathRE.test(handler.value) ? handler.value : ("function($event){" + (handler.value) + "}")
          } else {
            var code = '';
            var keys = [];
            for (var key in handler.modifiers) {
              if (modifierCode[key]) {
                code += modifierCode[key];
              } else {
                keys.push(key);
              }
            }
            if (keys.length) {
              code = genKeyFilter(keys) + code;
            }
            var handlerCode = simplePathRE.test(handler.value) ? handler.value + '($event)' : handler.value;
            return 'function($event){' + code + handlerCode + '}'
          }
        }

        function genKeyFilter(keys) {
          return ("if(" + (keys.map(genFilterCode).join('&&')) + ")return;")
        }

        function genFilterCode(key) {
          var keyVal = parseInt(key, 10);
          if (keyVal) {
            return ("$event.keyCode!==" + keyVal)
          }
          var alias = keyCodes[key];
          return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
        }

        /*  */

        function bind$2(el, dir) {
          el.wrapData = function(code) {
            return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")")
          };
        }

        /*  */

        var baseDirectives = {
          bind: bind$2,
          cloak: noop
        };

        /*  */

        // configurable state
        var warn$2;
        var transforms$1;
        var dataGenFns;
        var platformDirectives$1;
        var isPlatformReservedTag$1;
        var staticRenderFns;
        var onceCount;
        var currentOptions;

        function generate(
          ast,
          options
        ) {
          // save previous staticRenderFns so generate calls can be nested
          var prevStaticRenderFns = staticRenderFns;
          var currentStaticRenderFns = staticRenderFns = [];
          var prevOnceCount = onceCount;
          onceCount = 0;
          currentOptions = options;
          warn$2 = options.warn || baseWarn;
          transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
          dataGenFns = pluckModuleFunction(options.modules, 'genData');
          platformDirectives$1 = options.directives || {};
          isPlatformReservedTag$1 = options.isReservedTag || no;
          var code = ast ? genElement(ast) : '_c("div")';
          staticRenderFns = prevStaticRenderFns;
          onceCount = prevOnceCount;
          return {
            render: ("with(this){return " + code + "}"),
            staticRenderFns: currentStaticRenderFns
          }
        }

        function genElement(el) {
          if (el.staticRoot && !el.staticProcessed) {
            return genStatic(el)
          } else if (el.once && !el.onceProcessed) {
            return genOnce(el)
          } else if (el.for && !el.forProcessed) {
            return genFor(el)
          } else if (el.if && !el.ifProcessed) {
            return genIf(el)
          } else if (el.tag === 'template' && !el.slotTarget) {
            return genChildren(el) || 'void 0'
          } else if (el.tag === 'slot') {
            return genSlot(el)
          } else {
            // component or element
            var code;
            if (el.component) {
              code = genComponent(el.component, el);
            } else {
              var data = el.plain ? undefined : genData(el);

              var children = el.inlineTemplate ? null : genChildren(el, true);
              code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
            }
            // module transforms
            for (var i = 0; i < transforms$1.length; i++) {
              code = transforms$1[i](el, code);
            }
            return code
          }
        }

        // hoist static sub-trees out
        function genStatic(el) {
          el.staticProcessed = true;
          staticRenderFns.push(("with(this){return " + (genElement(el)) + "}"));
          return ("_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
        }

        // v-once
        function genOnce(el) {
          el.onceProcessed = true;
          if (el.if && !el.ifProcessed) {
            return genIf(el)
          } else if (el.staticInFor) {
            var key = '';
            var parent = el.parent;
            while (parent) {
              if (parent.for) {
                key = parent.key;
                break
              }
              parent = parent.parent;
            }
            if (!key) {
              "development" !== 'production' && warn$2(
                "v-once can only be used inside v-for that is keyed. "
              );
              return genElement(el)
            }
            return ("_o(" + (genElement(el)) + "," + (onceCount++) + (key ? ("," + key) : "") + ")")
          } else {
            return genStatic(el)
          }
        }

        function genIf(el) {
          el.ifProcessed = true; // avoid recursion
          return genIfConditions(el.ifConditions.slice())
        }

        function genIfConditions(conditions) {
          if (!conditions.length) {
            return '_e()'
          }

          var condition = conditions.shift();
          if (condition.exp) {
            return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions)))
          } else {
            return ("" + (genTernaryExp(condition.block)))
          }

          // v-if with v-once should generate code like (a)?_m(0):_m(1)
          function genTernaryExp(el) {
            return el.once ? genOnce(el) : genElement(el)
          }
        }

        function genFor(el) {
          var exp = el.for;
          var alias = el.alias;
          var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
          var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
          el.forProcessed = true; // avoid recursion
          return "_l((" + exp + ")," +
            "function(" + alias + iterator1 + iterator2 + "){" +
            "return " + (genElement(el)) +
            '})'
        }

        function genData(el) {
          var data = '{';

          // directives first.
          // directives may mutate the el's other properties before they are generated.
          var dirs = genDirectives(el);
          if (dirs) {
            data += dirs + ',';
          }

          // key
          if (el.key) {
            data += "key:" + (el.key) + ",";
          }
          // ref
          if (el.ref) {
            data += "ref:" + (el.ref) + ",";
          }
          if (el.refInFor) {
            data += "refInFor:true,";
          }
          // pre
          if (el.pre) {
            data += "pre:true,";
          }
          // record original tag name for components using "is" attribute
          if (el.component) {
            data += "tag:\"" + (el.tag) + "\",";
          }
          // module data generation functions
          for (var i = 0; i < dataGenFns.length; i++) {
            data += dataGenFns[i](el);
          }
          // attributes
          if (el.attrs) {
            data += "attrs:{" + (genProps(el.attrs)) + "},";
          }
          // DOM props
          if (el.props) {
            data += "domProps:{" + (genProps(el.props)) + "},";
          }
          // event handlers
          if (el.events) {
            data += (genHandlers(el.events)) + ",";
          }
          if (el.nativeEvents) {
            data += (genHandlers(el.nativeEvents, true)) + ",";
          }
          // slot target
          if (el.slotTarget) {
            data += "slot:" + (el.slotTarget) + ",";
          }
          // scoped slots
          if (el.scopedSlots) {
            data += (genScopedSlots(el.scopedSlots)) + ",";
          }
          // inline-template
          if (el.inlineTemplate) {
            var inlineTemplate = genInlineTemplate(el);
            if (inlineTemplate) {
              data += inlineTemplate + ",";
            }
          }
          data = data.replace(/,$/, '') + '}';
          // v-bind data wrap
          if (el.wrapData) {
            data = el.wrapData(data);
          }
          return data
        }

        function genDirectives(el) {
          var dirs = el.directives;
          if (!dirs) {
            return
          }
          var res = 'directives:[';
          var hasRuntime = false;
          var i, l, dir, needRuntime;
          for (i = 0, l = dirs.length; i < l; i++) {
            dir = dirs[i];
            needRuntime = true;
            var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
            if (gen) {
              // compile-time directive that manipulates AST.
              // returns true if it also needs a runtime counterpart.
              needRuntime = !!gen(el, dir, warn$2);
            }
            if (needRuntime) {
              hasRuntime = true;
              res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
            }
          }
          if (hasRuntime) {
            return res.slice(0, -1) + ']'
          }
        }

        function genInlineTemplate(el) {
          var ast = el.children[0];
          if ("development" !== 'production' && (
              el.children.length > 1 || ast.type !== 1
            )) {
            warn$2('Inline-template components must have exactly one child element.');
          }
          if (ast.type === 1) {
            var inlineRenderFns = generate(ast, currentOptions);
            return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function(code) {
              return ("function(){" + code + "}");
            }).join(',')) + "]}")
          }
        }

        function genScopedSlots(slots) {
          return ("scopedSlots:{" + (Object.keys(slots).map(function(key) {
            return genScopedSlot(key, slots[key]);
          }).join(',')) + "}")
        }

        function genScopedSlot(key, el) {
          return key + ":function(" + (String(el.attrsMap.scope)) + "){" +
            "return " + (el.tag === 'template' ? genChildren(el) || 'void 0' : genElement(el)) + "}"
        }

        function genChildren(el, checkSkip) {
          var children = el.children;
          if (children.length) {
            var el$1 = children[0];
            // optimize single v-for
            if (children.length === 1 &&
              el$1.for &&
              el$1.tag !== 'template' &&
              el$1.tag !== 'slot') {
              return genElement(el$1)
            }
            var normalizationType = getNormalizationType(children);
            return ("[" + (children.map(genNode).join(',')) + "]" + (checkSkip ? normalizationType ? ("," + normalizationType) : '' : ''))
          }
        }

        // determine the normalization needed for the children array.
        // 0: no normalization needed
        // 1: simple normalization needed (possible 1-level deep nested array)
        // 2: full normalization needed
        function getNormalizationType(children) {
          var res = 0;
          for (var i = 0; i < children.length; i++) {
            var el = children[i];
            if (needsNormalization(el) ||
              (el.if && el.ifConditions.some(function(c) {
                return needsNormalization(c.block);
              }))) {
              res = 2;
              break
            }
            if (maybeComponent(el) ||
              (el.if && el.ifConditions.some(function(c) {
                return maybeComponent(c.block);
              }))) {
              res = 1;
            }
          }
          return res
        }

        function needsNormalization(el) {
          return el.for || el.tag === 'template' || el.tag === 'slot'
        }

        function maybeComponent(el) {
          return el.type === 1 && !isPlatformReservedTag$1(el.tag)
        }

        function genNode(node) {
          if (node.type === 1) {
            return genElement(node)
          } else {
            return genText(node)
          }
        }

        function genText(text) {
          return ("_v(" + (text.type === 2 ? text.expression // no need for () because already wrapped in _s()
            : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
        }

        function genSlot(el) {
          var slotName = el.slotName || '"default"';
          var children = genChildren(el);
          var res = "_t(" + slotName + (children ? ("," + children) : '');
          var attrs = el.attrs && ("{" + (el.attrs.map(function(a) {
            return ((camelize(a.name)) + ":" + (a.value));
          }).join(',')) + "}");
          var bind$$1 = el.attrsMap['v-bind'];
          if ((attrs || bind$$1) && !children) {
            res += ",null";
          }
          if (attrs) {
            res += "," + attrs;
          }
          if (bind$$1) {
            res += (attrs ? '' : ',null') + "," + bind$$1;
          }
          return res + ')'
        }

        // componentName is el.component, take it as argument to shun flow's pessimistic refinement
        function genComponent(componentName, el) {
          var children = el.inlineTemplate ? null : genChildren(el, true);
          return ("_c(" + componentName + "," + (genData(el)) + (children ? ("," + children) : '') + ")")
        }

        function genProps(props) {
          var res = '';
          for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
          }
          return res.slice(0, -1)
        }

        // #3895, #4268
        function transformSpecialNewlines(text) {
          return text
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029')
        }

        /*  */

        /**
         * Compile a template.
         */
        function compile$1(
          template,
          options
        ) {
          var ast = parse(template.trim(), options);
          optimize(ast, options);
          var code = generate(ast, options);
          return {
            ast: ast,
            render: code.render,
            staticRenderFns: code.staticRenderFns
          }
        }

        /*  */

        // operators like typeof, instanceof and in are allowed
        var prohibitedKeywordRE = new RegExp('\\b' + (
          'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
          'super,throw,while,yield,delete,export,import,return,switch,default,' +
          'extends,finally,continue,debugger,function,arguments'
        ).split(',').join('\\b|\\b') + '\\b');
        // check valid identifier for v-for
        var identRE = /[A-Za-z_$][\w$]*/;
        // strip strings in expressions
        var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

        // detect problematic expressions in a template
        function detectErrors(ast) {
          var errors = [];
          if (ast) {
            checkNode(ast, errors);
          }
          return errors
        }

        function checkNode(node, errors) {
          if (node.type === 1) {
            for (var name in node.attrsMap) {
              if (dirRE.test(name)) {
                var value = node.attrsMap[name];
                if (value) {
                  if (name === 'v-for') {
                    checkFor(node, ("v-for=\"" + value + "\""), errors);
                  } else {
                    checkExpression(value, (name + "=\"" + value + "\""), errors);
                  }
                }
              }
            }
            if (node.children) {
              for (var i = 0; i < node.children.length; i++) {
                checkNode(node.children[i], errors);
              }
            }
          } else if (node.type === 2) {
            checkExpression(node.expression, node.text, errors);
          }
        }

        function checkFor(node, text, errors) {
          checkExpression(node.for || '', text, errors);
          checkIdentifier(node.alias, 'v-for alias', text, errors);
          checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
          checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
        }

        function checkIdentifier(ident, type, text, errors) {
          if (typeof ident === 'string' && !identRE.test(ident)) {
            errors.push(("- invalid " + type + " \"" + ident + "\" in expression: " + text));
          }
        }

        function checkExpression(exp, text, errors) {
          try {
            new Function(("return " + exp));
          } catch (e) {
            var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
            if (keywordMatch) {
              errors.push(
                "- avoid using JavaScript keyword as property name: " +
                "\"" + (keywordMatch[0]) + "\" in expression " + text
              );
            } else {
              errors.push(("- invalid expression: " + text));
            }
          }
        }

        /*  */

        function transformNode(el, options) {
          var warn = options.warn || baseWarn;
          var staticClass = getAndRemoveAttr(el, 'class');
          if ("development" !== 'production' && staticClass) {
            var expression = parseText(staticClass, options.delimiters);
            if (expression) {
              warn(
                "class=\"" + staticClass + "\": " +
                'Interpolation inside attributes has been removed. ' +
                'Use v-bind or the colon shorthand instead. For example, ' +
                'instead of <div class="{{ val }}">, use <div :class="val">.'
              );
            }
          }
          if (staticClass) {
            el.staticClass = JSON.stringify(staticClass);
          }
          var classBinding = getBindingAttr(el, 'class', false /* getStatic */ );
          if (classBinding) {
            el.classBinding = classBinding;
          }
        }

        function genData$1(el) {
          var data = '';
          if (el.staticClass) {
            data += "staticClass:" + (el.staticClass) + ",";
          }
          if (el.classBinding) {
            data += "class:" + (el.classBinding) + ",";
          }
          return data
        }

        var klass$1 = {
          staticKeys: ['staticClass'],
          transformNode: transformNode,
          genData: genData$1
        };

        /*  */

        function transformNode$1(el, options) {
          var warn = options.warn || baseWarn;
          var staticStyle = getAndRemoveAttr(el, 'style');
          if (staticStyle) {
            /* istanbul ignore if */
            {
              var expression = parseText(staticStyle, options.delimiters);
              if (expression) {
                warn(
                  "style=\"" + staticStyle + "\": " +
                  'Interpolation inside attributes has been removed. ' +
                  'Use v-bind or the colon shorthand instead. For example, ' +
                  'instead of <div style="{{ val }}">, use <div :style="val">.'
                );
              }
            }
            el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
          }

          var styleBinding = getBindingAttr(el, 'style', false /* getStatic */ );
          if (styleBinding) {
            el.styleBinding = styleBinding;
          }
        }

        function genData$2(el) {
          var data = '';
          if (el.staticStyle) {
            data += "staticStyle:" + (el.staticStyle) + ",";
          }
          if (el.styleBinding) {
            data += "style:(" + (el.styleBinding) + "),";
          }
          return data
        }

        var style$1 = {
          staticKeys: ['staticStyle'],
          transformNode: transformNode$1,
          genData: genData$2
        };

        var modules$1 = [
          klass$1,
          style$1
        ];

        /*  */

        var warn$3;

        function model$1(
          el,
          dir,
          _warn
        ) {
          warn$3 = _warn;
          var value = dir.value;
          var modifiers = dir.modifiers;
          var tag = el.tag;
          var type = el.attrsMap.type; {
            var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
            if (tag === 'input' && dynamicType) {
              warn$3(
                "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
                "v-model does not support dynamic input types. Use v-if branches instead."
              );
            }
          }
          if (tag === 'select') {
            genSelect(el, value, modifiers);
          } else if (tag === 'input' && type === 'checkbox') {
            genCheckboxModel(el, value, modifiers);
          } else if (tag === 'input' && type === 'radio') {
            genRadioModel(el, value, modifiers);
          } else {
            genDefaultModel(el, value, modifiers);
          }
          // ensure runtime directive metadata
          return true
        }

        function genCheckboxModel(
          el,
          value,
          modifiers
        ) {
          if ("development" !== 'production' &&
            el.attrsMap.checked != null) {
            warn$3(
              "<" + (el.tag) + " v-model=\"" + value + "\" checked>:\n" +
              "inline checked attributes will be ignored when using v-model. " +
              'Declare initial values in the component\'s data option instead.'
            );
          }
          var number = modifiers && modifiers.number;
          var valueBinding = getBindingAttr(el, 'value') || 'null';
          var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
          var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
          addProp(el, 'checked',
            "Array.isArray(" + value + ")" +
            "?_i(" + value + "," + valueBinding + ")>-1" + (
              trueValueBinding === 'true' ? (":(" + value + ")") : (":_q(" + value + "," + trueValueBinding + ")")
            )
          );
          addHandler(el, 'change',
            "var $$a=" + value + "," +
            '$$el=$event.target,' +
            "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
            'if(Array.isArray($$a)){' +
            "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
            '$$i=_i($$a,$$v);' +
            "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
            "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
            "}else{" + value + "=$$c}",
            null, true
          );
        }

        function genRadioModel(
          el,
          value,
          modifiers
        ) {
          if ("development" !== 'production' &&
            el.attrsMap.checked != null) {
            warn$3(
              "<" + (el.tag) + " v-model=\"" + value + "\" checked>:\n" +
              "inline checked attributes will be ignored when using v-model. " +
              'Declare initial values in the component\'s data option instead.'
            );
          }
          var number = modifiers && modifiers.number;
          var valueBinding = getBindingAttr(el, 'value') || 'null';
          valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
          addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
          addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
        }

        function genDefaultModel(
          el,
          value,
          modifiers
        ) {
          {
            if (el.tag === 'input' && el.attrsMap.value) {
              warn$3(
                "<" + (el.tag) + " v-model=\"" + value + "\" value=\"" + (el.attrsMap.value) + "\">:\n" +
                'inline value attributes will be ignored when using v-model. ' +
                'Declare initial values in the component\'s data option instead.'
              );
            }
            if (el.tag === 'textarea' && el.children.length) {
              warn$3(
                "<textarea v-model=\"" + value + "\">:\n" +
                'inline content inside <textarea> will be ignored when using v-model. ' +
                'Declare initial values in the component\'s data option instead.'
              );
            }
          }

          var type = el.attrsMap.type;
          var ref = modifiers || {};
          var lazy = ref.lazy;
          var number = ref.number;
          var trim = ref.trim;
          var event = lazy || (isIE && type === 'range') ? 'change' : 'input';
          var needCompositionGuard = !lazy && type !== 'range';
          var isNative = el.tag === 'input' || el.tag === 'textarea';

          var valueExpression = isNative ? ("$event.target.value" + (trim ? '.trim()' : '')) : trim ? "(typeof $event === 'string' ? $event.trim() : $event)" : "$event";
          valueExpression = number || type === 'number' ? ("_n(" + valueExpression + ")") : valueExpression;

          var code = genAssignmentCode(value, valueExpression);
          if (isNative && needCompositionGuard) {
            code = "if($event.target.composing)return;" + code;
          }

          // inputs with type="file" are read only and setting the input's
          // value will throw an error.
          if ("development" !== 'production' &&
            type === 'file') {
            warn$3(
              "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
              "File inputs are read only. Use a v-on:change listener instead."
            );
          }

          addProp(el, 'value', isNative ? ("_s(" + value + ")") : ("(" + value + ")"));
          addHandler(el, event, code, null, true);
          if (trim || number || type === 'number') {
            addHandler(el, 'blur', '$forceUpdate()');
          }
        }

        function genSelect(
          el,
          value,
          modifiers
        ) {
          {
            el.children.some(checkOptionWarning);
          }

          var number = modifiers && modifiers.number;
          var assignment = "Array.prototype.filter" +
            ".call($event.target.options,function(o){return o.selected})" +
            ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
            "return " + (number ? '_n(val)' : 'val') + "})" +
            (el.attrsMap.multiple == null ? '[0]' : '');

          var code = genAssignmentCode(value, assignment);
          addHandler(el, 'change', code, null, true);
        }

        function checkOptionWarning(option) {
          if (option.type === 1 &&
            option.tag === 'option' &&
            option.attrsMap.selected != null) {
            warn$3(
              "<select v-model=\"" + (option.parent.attrsMap['v-model']) + "\">:\n" +
              'inline selected attributes on <option> will be ignored when using v-model. ' +
              'Declare initial values in the component\'s data option instead.'
            );
            return true
          }
          return false
        }

        function genAssignmentCode(value, assignment) {
          var modelRs = parseModel(value);
          if (modelRs.idx === null) {
            return (value + "=" + assignment)
          } else {
            return "var $$exp = " + (modelRs.exp) + ", $$idx = " + (modelRs.idx) + ";" +
              "if (!Array.isArray($$exp)){" +
              value + "=" + assignment + "}" +
              "else{$$exp.splice($$idx, 1, " + assignment + ")}"
          }
        }

        /*  */

        function text(el, dir) {
          if (dir.value) {
            addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
          }
        }

        /*  */

        function html(el, dir) {
          if (dir.value) {
            addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
          }
        }

        var directives$1 = {
          model: model$1,
          text: text,
          html: html
        };

        /*  */

        var cache = Object.create(null);

        var baseOptions = {
          expectHTML: true,
          modules: modules$1,
          staticKeys: genStaticKeys(modules$1),
          directives: directives$1,
          isReservedTag: isReservedTag,
          isUnaryTag: isUnaryTag,
          mustUseProp: mustUseProp,
          getTagNamespace: getTagNamespace,
          isPreTag: isPreTag
        };

        function compile$$1(
          template,
          options
        ) {
          options = options ? extend(extend({}, baseOptions), options) : baseOptions;
          return compile$1(template, options)
        }

        function compileToFunctions(
          template,
          options,
          vm
        ) {
          var _warn = (options && options.warn) || warn;
          // detect possible CSP restriction
          /* istanbul ignore if */
          {
            try {
              new Function('return 1');
            } catch (e) {
              if (e.toString().match(/unsafe-eval|CSP/)) {
                _warn(
                  'It seems you are using the standalone build of Vue.js in an ' +
                  'environment with Content Security Policy that prohibits unsafe-eval. ' +
                  'The template compiler cannot work in this environment. Consider ' +
                  'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                  'templates into render functions.'
                );
              }
            }
          }
          var key = options && options.delimiters ? String(options.delimiters) + template : template;
          if (cache[key]) {
            return cache[key]
          }
          var res = {};
          var compiled = compile$$1(template, options);
          res.render = makeFunction(compiled.render);
          var l = compiled.staticRenderFns.length;
          res.staticRenderFns = new Array(l);
          for (var i = 0; i < l; i++) {
            res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i]);
          } {
            if (res.render === noop || res.staticRenderFns.some(function(fn) {
                return fn === noop;
              })) {
              _warn(
                "failed to compile template:\n\n" + template + "\n\n" +
                detectErrors(compiled.ast).join('\n') +
                '\n\n',
                vm
              );
            }
          }
          return (cache[key] = res)
        }

        function makeFunction(code) {
          try {
            return new Function(code)
          } catch (e) {
            return noop
          }
        }

        /*  */

        var idToTemplate = cached(function(id) {
          var el = query(id);
          return el && el.innerHTML
        });

        var mount = Vue$3.prototype.$mount;
        Vue$3.prototype.$mount = function(
          el,
          hydrating
        ) {
          el = el && query(el);

          /* istanbul ignore if */
          if (el === document.body || el === document.documentElement) {
            "development" !== 'production' && warn(
              "Do not mount Vue to <html> or <body> - mount to normal elements instead."
            );
            return this
          }

          var options = this.$options;
          // resolve template/el and convert to render function
          if (!options.render) {
            var template = options.template;
            if (template) {
              if (typeof template === 'string') {
                if (template.charAt(0) === '#') {
                  template = idToTemplate(template);
                  /* istanbul ignore if */
                  if ("development" !== 'production' && !template) {
                    warn(
                      ("Template element not found or is empty: " + (options.template)),
                      this
                    );
                  }
                }
              } else if (template.nodeType) {
                template = template.innerHTML;
              } else {
                {
                  warn('invalid template option:' + template, this);
                }
                return this
              }
            } else if (el) {
              template = getOuterHTML(el);
            }
            if (template) {
              var ref = compileToFunctions(template, {
                warn: warn,
                shouldDecodeNewlines: shouldDecodeNewlines,
                delimiters: options.delimiters
              }, this);
              var render = ref.render;
              var staticRenderFns = ref.staticRenderFns;
              options.render = render;
              options.staticRenderFns = staticRenderFns;
            }
          }
          return mount.call(this, el, hydrating)
        };

        /**
         * Get outerHTML of elements, taking care
         * of SVG elements in IE as well.
         */
        function getOuterHTML(el) {
          if (el.outerHTML) {
            return el.outerHTML
          } else {
            var container = document.createElement('div');
            container.appendChild(el.cloneNode(true));
            return container.innerHTML
          }
        }

        Vue$3.compile = compileToFunctions;

        return Vue$3;

      })));

      /* WEBPACK VAR INJECTION */
    }.call(exports, (function() {
      return this;
    }())))

    /***/
  },

  /***/
  72:
  /***/
    function(module, exports, __webpack_require__) {

    module.exports = __webpack_require__(73);

    /***/
  },

  /***/
  73:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var utils = __webpack_require__(74);
    var bind = __webpack_require__(79);
    var Axios = __webpack_require__(80);
    var defaults = __webpack_require__(81);

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios(defaultConfig);
      var instance = bind(Axios.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      return instance;
    }

    // Create the default instance to be exported
    var axios = createInstance(defaults);

    // Expose Axios class to allow class inheritance
    axios.Axios = Axios;

    // Factory for creating new instances
    axios.create = function create(instanceConfig) {
      return createInstance(utils.merge(defaults, instanceConfig));
    };

    // Expose Cancel & CancelToken
    axios.Cancel = __webpack_require__(98);
    axios.CancelToken = __webpack_require__(99);
    axios.isCancel = __webpack_require__(95);

    // Expose all/spread
    axios.all = function all(promises) {
      return Promise.all(promises);
    };
    axios.spread = __webpack_require__(100);

    module.exports = axios;

    // Allow use of default import syntax in TypeScript
    module.exports.default = axios;


    /***/
  },

  /***/
  74:
  /***/
    function(module, exports, __webpack_require__) {

    /* WEBPACK VAR INJECTION */
    (function(Buffer) {
      'use strict';

      var bind = __webpack_require__(79);

      /*global toString:true*/

      // utils is a library of generic helper functions non-specific to axios

      var toString = Object.prototype.toString;

      /**
       * Determine if a value is an Array
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an Array, otherwise false
       */
      function isArray(val) {
        return toString.call(val) === '[object Array]';
      }

      /**
       * Determine if a value is a Node Buffer
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Node Buffer, otherwise false
       */
      function isBuffer(val) {
        return ((typeof Buffer !== 'undefined') && (Buffer.isBuffer) && (Buffer.isBuffer(val)));
      }

      /**
       * Determine if a value is an ArrayBuffer
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an ArrayBuffer, otherwise false
       */
      function isArrayBuffer(val) {
        return toString.call(val) === '[object ArrayBuffer]';
      }

      /**
       * Determine if a value is a FormData
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an FormData, otherwise false
       */
      function isFormData(val) {
        return (typeof FormData !== 'undefined') && (val instanceof FormData);
      }

      /**
       * Determine if a value is a view on an ArrayBuffer
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
       */
      function isArrayBufferView(val) {
        var result;
        if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
          result = ArrayBuffer.isView(val);
        } else {
          result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
        }
        return result;
      }

      /**
       * Determine if a value is a String
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a String, otherwise false
       */
      function isString(val) {
        return typeof val === 'string';
      }

      /**
       * Determine if a value is a Number
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Number, otherwise false
       */
      function isNumber(val) {
        return typeof val === 'number';
      }

      /**
       * Determine if a value is undefined
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if the value is undefined, otherwise false
       */
      function isUndefined(val) {
        return typeof val === 'undefined';
      }

      /**
       * Determine if a value is an Object
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an Object, otherwise false
       */
      function isObject(val) {
        return val !== null && typeof val === 'object';
      }

      /**
       * Determine if a value is a Date
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Date, otherwise false
       */
      function isDate(val) {
        return toString.call(val) === '[object Date]';
      }

      /**
       * Determine if a value is a File
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a File, otherwise false
       */
      function isFile(val) {
        return toString.call(val) === '[object File]';
      }

      /**
       * Determine if a value is a Blob
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Blob, otherwise false
       */
      function isBlob(val) {
        return toString.call(val) === '[object Blob]';
      }

      /**
       * Determine if a value is a Function
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Function, otherwise false
       */
      function isFunction(val) {
        return toString.call(val) === '[object Function]';
      }

      /**
       * Determine if a value is a Stream
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Stream, otherwise false
       */
      function isStream(val) {
        return isObject(val) && isFunction(val.pipe);
      }

      /**
       * Determine if a value is a URLSearchParams object
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a URLSearchParams object, otherwise false
       */
      function isURLSearchParams(val) {
        return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
      }

      /**
       * Trim excess whitespace off the beginning and end of a string
       *
       * @param {String} str The String to trim
       * @returns {String} The String freed of excess whitespace
       */
      function trim(str) {
        return str.replace(/^\s*/, '').replace(/\s*$/, '');
      }

      /**
       * Determine if we're running in a standard browser environment
       *
       * This allows axios to run in a web worker, and react-native.
       * Both environments support XMLHttpRequest, but not fully standard globals.
       *
       * web workers:
       *  typeof window -> undefined
       *  typeof document -> undefined
       *
       * react-native:
       *  navigator.product -> 'ReactNative'
       */
      function isStandardBrowserEnv() {
        if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
          return false;
        }
        return (
          typeof window !== 'undefined' &&
          typeof document !== 'undefined'
        );
      }

      /**
       * Iterate over an Array or an Object invoking a function for each item.
       *
       * If `obj` is an Array callback will be called passing
       * the value, index, and complete array for each item.
       *
       * If 'obj' is an Object callback will be called passing
       * the value, key, and complete object for each property.
       *
       * @param {Object|Array} obj The object to iterate
       * @param {Function} fn The callback to invoke for each item
       */
      function forEach(obj, fn) {
        // Don't bother if no value provided
        if (obj === null || typeof obj === 'undefined') {
          return;
        }

        // Force an array if not already something iterable
        if (typeof obj !== 'object' && !isArray(obj)) {
          /*eslint no-param-reassign:0*/
          obj = [obj];
        }

        if (isArray(obj)) {
          // Iterate over array values
          for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
          }
        } else {
          // Iterate over object keys
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              fn.call(null, obj[key], key, obj);
            }
          }
        }
      }

      /**
       * Accepts varargs expecting each argument to be an object, then
       * immutably merges the properties of each object and returns result.
       *
       * When multiple objects contain the same key the later object in
       * the arguments list will take precedence.
       *
       * Example:
       *
       * ```js
       * var result = merge({foo: 123}, {foo: 456});
       * console.log(result.foo); // outputs 456
       * ```
       *
       * @param {Object} obj1 Object to merge
       * @returns {Object} Result of all merge properties
       */
      function merge( /* obj1, obj2, obj3, ... */ ) {
        var result = {};

        function assignValue(val, key) {
          if (typeof result[key] === 'object' && typeof val === 'object') {
            result[key] = merge(result[key], val);
          } else {
            result[key] = val;
          }
        }

        for (var i = 0, l = arguments.length; i < l; i++) {
          forEach(arguments[i], assignValue);
        }
        return result;
      }

      /**
       * Extends object a by mutably adding to it the properties of object b.
       *
       * @param {Object} a The object to be extended
       * @param {Object} b The object to copy properties from
       * @param {Object} thisArg The object to bind function to
       * @return {Object} The resulting value of object a
       */
      function extend(a, b, thisArg) {
        forEach(b, function assignValue(val, key) {
          if (thisArg && typeof val === 'function') {
            a[key] = bind(val, thisArg);
          } else {
            a[key] = val;
          }
        });
        return a;
      }

      module.exports = {
        isArray: isArray,
        isArrayBuffer: isArrayBuffer,
        isBuffer: isBuffer,
        isFormData: isFormData,
        isArrayBufferView: isArrayBufferView,
        isString: isString,
        isNumber: isNumber,
        isObject: isObject,
        isUndefined: isUndefined,
        isDate: isDate,
        isFile: isFile,
        isBlob: isBlob,
        isFunction: isFunction,
        isStream: isStream,
        isURLSearchParams: isURLSearchParams,
        isStandardBrowserEnv: isStandardBrowserEnv,
        forEach: forEach,
        merge: merge,
        extend: extend,
        trim: trim
      };

      /* WEBPACK VAR INJECTION */
    }.call(exports, __webpack_require__(75).Buffer))

    /***/
  },

  /***/
  75:
  /***/
    function(module, exports, __webpack_require__) {

    /* WEBPACK VAR INJECTION */
    (function(global) {
      /*!
       * The buffer module from node.js, for the browser.
       *
       * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
       * @license  MIT
       */
      /* eslint-disable no-proto */

      'use strict'

      var base64 = __webpack_require__(76)
      var ieee754 = __webpack_require__(77)
      var isArray = __webpack_require__(78)

      exports.Buffer = Buffer
      exports.SlowBuffer = SlowBuffer
      exports.INSPECT_MAX_BYTES = 50

      /**
       * If `Buffer.TYPED_ARRAY_SUPPORT`:
       *   === true    Use Uint8Array implementation (fastest)
       *   === false   Use Object implementation (most compatible, even IE6)
       *
       * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
       * Opera 11.6+, iOS 4.2+.
       *
       * Due to various browser bugs, sometimes the Object implementation will be used even
       * when the browser supports typed arrays.
       *
       * Note:
       *
       *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
       *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
       *
       *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
       *
       *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
       *     incorrect length in some situations.
	
       * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
       * get the Object implementation, which is slower but behaves correctly.
       */
      Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport()

      /*
       * Export kMaxLength after typed array support is determined.
       */
      exports.kMaxLength = kMaxLength()

      function typedArraySupport() {
        try {
          var arr = new Uint8Array(1)
          arr.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function() {
              return 42
            }
          }
          return arr.foo() === 42 && // typed array instances can be augmented
            typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
            arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
        } catch (e) {
          return false
        }
      }

      function kMaxLength() {
        return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff
      }

      function createBuffer(that, length) {
        if (kMaxLength() < length) {
          throw new RangeError('Invalid typed array length')
        }
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          // Return an augmented `Uint8Array` instance, for best performance
          that = new Uint8Array(length)
          that.__proto__ = Buffer.prototype
        } else {
          // Fallback: Return an object instance of the Buffer class
          if (that === null) {
            that = new Buffer(length)
          }
          that.length = length
        }

        return that
      }

      /**
       * The Buffer constructor returns instances of `Uint8Array` that have their
       * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
       * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
       * and the `Uint8Array` methods. Square bracket notation works as expected -- it
       * returns a single octet.
       *
       * The `Uint8Array` prototype remains unmodified.
       */

      function Buffer(arg, encodingOrOffset, length) {
        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
          return new Buffer(arg, encodingOrOffset, length)
        }

        // Common case.
        if (typeof arg === 'number') {
          if (typeof encodingOrOffset === 'string') {
            throw new Error(
              'If encoding is specified then the first argument must be a string'
            )
          }
          return allocUnsafe(this, arg)
        }
        return from(this, arg, encodingOrOffset, length)
      }

      Buffer.poolSize = 8192 // not used by this implementation

      // TODO: Legacy, not needed anymore. Remove in next major version.
      Buffer._augment = function(arr) {
        arr.__proto__ = Buffer.prototype
        return arr
      }

      function from(that, value, encodingOrOffset, length) {
        if (typeof value === 'number') {
          throw new TypeError('"value" argument must not be a number')
        }

        if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
          return fromArrayBuffer(that, value, encodingOrOffset, length)
        }

        if (typeof value === 'string') {
          return fromString(that, value, encodingOrOffset)
        }

        return fromObject(that, value)
      }

      /**
       * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
       * if value is a number.
       * Buffer.from(str[, encoding])
       * Buffer.from(array)
       * Buffer.from(buffer)
       * Buffer.from(arrayBuffer[, byteOffset[, length]])
       **/
      Buffer.from = function(value, encodingOrOffset, length) {
        return from(null, value, encodingOrOffset, length)
      }

      if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype
        Buffer.__proto__ = Uint8Array
        if (typeof Symbol !== 'undefined' && Symbol.species &&
          Buffer[Symbol.species] === Buffer) {
          // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
          Object.defineProperty(Buffer, Symbol.species, {
            value: null,
            configurable: true
          })
        }
      }

      function assertSize(size) {
        if (typeof size !== 'number') {
          throw new TypeError('"size" argument must be a number')
        } else if (size < 0) {
          throw new RangeError('"size" argument must not be negative')
        }
      }

      function alloc(that, size, fill, encoding) {
        assertSize(size)
        if (size <= 0) {
          return createBuffer(that, size)
        }
        if (fill !== undefined) {
          // Only pay attention to encoding if it's a string. This
          // prevents accidentally sending in a number that would
          // be interpretted as a start offset.
          return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill)
        }
        return createBuffer(that, size)
      }

      /**
       * Creates a new filled Buffer instance.
       * alloc(size[, fill[, encoding]])
       **/
      Buffer.alloc = function(size, fill, encoding) {
        return alloc(null, size, fill, encoding)
      }

      function allocUnsafe(that, size) {
        assertSize(size)
        that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
        if (!Buffer.TYPED_ARRAY_SUPPORT) {
          for (var i = 0; i < size; ++i) {
            that[i] = 0
          }
        }
        return that
      }

      /**
       * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
       * */
      Buffer.allocUnsafe = function(size) {
          return allocUnsafe(null, size)
        }
        /**
         * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
         */
      Buffer.allocUnsafeSlow = function(size) {
        return allocUnsafe(null, size)
      }

      function fromString(that, string, encoding) {
        if (typeof encoding !== 'string' || encoding === '') {
          encoding = 'utf8'
        }

        if (!Buffer.isEncoding(encoding)) {
          throw new TypeError('"encoding" must be a valid string encoding')
        }

        var length = byteLength(string, encoding) | 0
        that = createBuffer(that, length)

        var actual = that.write(string, encoding)

        if (actual !== length) {
          // Writing a hex string, for example, that contains invalid characters will
          // cause everything after the first invalid character to be ignored. (e.g.
          // 'abxxcd' will be treated as 'ab')
          that = that.slice(0, actual)
        }

        return that
      }

      function fromArrayLike(that, array) {
        var length = array.length < 0 ? 0 : checked(array.length) | 0
        that = createBuffer(that, length)
        for (var i = 0; i < length; i += 1) {
          that[i] = array[i] & 255
        }
        return that
      }

      function fromArrayBuffer(that, array, byteOffset, length) {
        array.byteLength // this throws if `array` is not a valid ArrayBuffer

        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('\'offset\' is out of bounds')
        }

        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('\'length\' is out of bounds')
        }

        if (byteOffset === undefined && length === undefined) {
          array = new Uint8Array(array)
        } else if (length === undefined) {
          array = new Uint8Array(array, byteOffset)
        } else {
          array = new Uint8Array(array, byteOffset, length)
        }

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          // Return an augmented `Uint8Array` instance, for best performance
          that = array
          that.__proto__ = Buffer.prototype
        } else {
          // Fallback: Return an object instance of the Buffer class
          that = fromArrayLike(that, array)
        }
        return that
      }

      function fromObject(that, obj) {
        if (Buffer.isBuffer(obj)) {
          var len = checked(obj.length) | 0
          that = createBuffer(that, len)

          if (that.length === 0) {
            return that
          }

          obj.copy(that, 0, 0, len)
          return that
        }

        if (obj) {
          if ((typeof ArrayBuffer !== 'undefined' &&
              obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
            if (typeof obj.length !== 'number' || isnan(obj.length)) {
              return createBuffer(that, 0)
            }
            return fromArrayLike(that, obj)
          }

          if (obj.type === 'Buffer' && isArray(obj.data)) {
            return fromArrayLike(that, obj.data)
          }
        }

        throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
      }

      function checked(length) {
        // Note: cannot use `length < kMaxLength()` here because that fails when
        // length is NaN (which is otherwise coerced to zero.)
        if (length >= kMaxLength()) {
          throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
            'size: 0x' + kMaxLength().toString(16) + ' bytes')
        }
        return length | 0
      }

      function SlowBuffer(length) {
        if (+length != length) { // eslint-disable-line eqeqeq
          length = 0
        }
        return Buffer.alloc(+length)
      }

      Buffer.isBuffer = function isBuffer(b) {
        return !!(b != null && b._isBuffer)
      }

      Buffer.compare = function compare(a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
          throw new TypeError('Arguments must be Buffers')
        }

        if (a === b) return 0

        var x = a.length
        var y = b.length

        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i]
            y = b[i]
            break
          }
        }

        if (x < y) return -1
        if (y < x) return 1
        return 0
      }

      Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case 'hex':
          case 'utf8':
          case 'utf-8':
          case 'ascii':
          case 'latin1':
          case 'binary':
          case 'base64':
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return true
          default:
            return false
        }
      }

      Buffer.concat = function concat(list, length) {
        if (!isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers')
        }

        if (list.length === 0) {
          return Buffer.alloc(0)
        }

        var i
        if (length === undefined) {
          length = 0
          for (i = 0; i < list.length; ++i) {
            length += list[i].length
          }
        }

        var buffer = Buffer.allocUnsafe(length)
        var pos = 0
        for (i = 0; i < list.length; ++i) {
          var buf = list[i]
          if (!Buffer.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers')
          }
          buf.copy(buffer, pos)
          pos += buf.length
        }
        return buffer
      }

      function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) {
          return string.length
        }
        if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
          (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
          return string.byteLength
        }
        if (typeof string !== 'string') {
          string = '' + string
        }

        var len = string.length
        if (len === 0) return 0

        // Use a for loop to avoid recursion
        var loweredCase = false
        for (;;) {
          switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
              return len
            case 'utf8':
            case 'utf-8':
            case undefined:
              return utf8ToBytes(string).length
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return len * 2
            case 'hex':
              return len >>> 1
            case 'base64':
              return base64ToBytes(string).length
            default:
              if (loweredCase) return utf8ToBytes(string).length // assume utf8
              encoding = ('' + encoding).toLowerCase()
              loweredCase = true
          }
        }
      }
      Buffer.byteLength = byteLength

      function slowToString(encoding, start, end) {
        var loweredCase = false

        // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
        // property of a typed array.

        // This behaves neither like String nor Uint8Array in that we set start/end
        // to their upper/lower bounds if the value passed is out of range.
        // undefined is handled specially as per ECMA-262 6th Edition,
        // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
        if (start === undefined || start < 0) {
          start = 0
        }
        // Return early if start > this.length. Done here to prevent potential uint32
        // coercion fail below.
        if (start > this.length) {
          return ''
        }

        if (end === undefined || end > this.length) {
          end = this.length
        }

        if (end <= 0) {
          return ''
        }

        // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
        end >>>= 0
        start >>>= 0

        if (end <= start) {
          return ''
        }

        if (!encoding) encoding = 'utf8'

        while (true) {
          switch (encoding) {
            case 'hex':
              return hexSlice(this, start, end)

            case 'utf8':
            case 'utf-8':
              return utf8Slice(this, start, end)

            case 'ascii':
              return asciiSlice(this, start, end)

            case 'latin1':
            case 'binary':
              return latin1Slice(this, start, end)

            case 'base64':
              return base64Slice(this, start, end)

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return utf16leSlice(this, start, end)

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
              encoding = (encoding + '').toLowerCase()
              loweredCase = true
          }
        }
      }

      // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
      // Buffer instances.
      Buffer.prototype._isBuffer = true

      function swap(b, n, m) {
        var i = b[n]
        b[n] = b[m]
        b[m] = i
      }

      Buffer.prototype.swap16 = function swap16() {
        var len = this.length
        if (len % 2 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 16-bits')
        }
        for (var i = 0; i < len; i += 2) {
          swap(this, i, i + 1)
        }
        return this
      }

      Buffer.prototype.swap32 = function swap32() {
        var len = this.length
        if (len % 4 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 32-bits')
        }
        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3)
          swap(this, i + 1, i + 2)
        }
        return this
      }

      Buffer.prototype.swap64 = function swap64() {
        var len = this.length
        if (len % 8 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 64-bits')
        }
        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7)
          swap(this, i + 1, i + 6)
          swap(this, i + 2, i + 5)
          swap(this, i + 3, i + 4)
        }
        return this
      }

      Buffer.prototype.toString = function toString() {
        var length = this.length | 0
        if (length === 0) return ''
        if (arguments.length === 0) return utf8Slice(this, 0, length)
        return slowToString.apply(this, arguments)
      }

      Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
        if (this === b) return true
        return Buffer.compare(this, b) === 0
      }

      Buffer.prototype.inspect = function inspect() {
        var str = ''
        var max = exports.INSPECT_MAX_BYTES
        if (this.length > 0) {
          str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
          if (this.length > max) str += ' ... '
        }
        return '<Buffer ' + str + '>'
      }

      Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) {
          throw new TypeError('Argument must be a Buffer')
        }

        if (start === undefined) {
          start = 0
        }
        if (end === undefined) {
          end = target ? target.length : 0
        }
        if (thisStart === undefined) {
          thisStart = 0
        }
        if (thisEnd === undefined) {
          thisEnd = this.length
        }

        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError('out of range index')
        }

        if (thisStart >= thisEnd && start >= end) {
          return 0
        }
        if (thisStart >= thisEnd) {
          return -1
        }
        if (start >= end) {
          return 1
        }

        start >>>= 0
        end >>>= 0
        thisStart >>>= 0
        thisEnd >>>= 0

        if (this === target) return 0

        var x = thisEnd - thisStart
        var y = end - start
        var len = Math.min(x, y)

        var thisCopy = this.slice(thisStart, thisEnd)
        var targetCopy = target.slice(start, end)

        for (var i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i]
            y = targetCopy[i]
            break
          }
        }

        if (x < y) return -1
        if (y < x) return 1
        return 0
      }

      // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
      // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
      //
      // Arguments:
      // - buffer - a Buffer to search
      // - val - a string, Buffer, or number
      // - byteOffset - an index into `buffer`; will be clamped to an int32
      // - encoding - an optional encoding, relevant is val is a string
      // - dir - true for indexOf, false for lastIndexOf
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        // Empty buffer means no match
        if (buffer.length === 0) return -1

        // Normalize byteOffset
        if (typeof byteOffset === 'string') {
          encoding = byteOffset
          byteOffset = 0
        } else if (byteOffset > 0x7fffffff) {
          byteOffset = 0x7fffffff
        } else if (byteOffset < -0x80000000) {
          byteOffset = -0x80000000
        }
        byteOffset = +byteOffset // Coerce to Number.
        if (isNaN(byteOffset)) {
          // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
          byteOffset = dir ? 0 : (buffer.length - 1)
        }

        // Normalize byteOffset: negative offsets start from the end of the buffer
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset
        if (byteOffset >= buffer.length) {
          if (dir) return -1
          else byteOffset = buffer.length - 1
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0
          else return -1
        }

        // Normalize val
        if (typeof val === 'string') {
          val = Buffer.from(val, encoding)
        }

        // Finally, search either indexOf (if dir is true) or lastIndexOf
        if (Buffer.isBuffer(val)) {
          // Special case: looking for empty string/buffer always fails
          if (val.length === 0) {
            return -1
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
        } else if (typeof val === 'number') {
          val = val & 0xFF // Search for a byte value [0-255]
          if (Buffer.TYPED_ARRAY_SUPPORT &&
            typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
        }

        throw new TypeError('val must be string, number or Buffer')
      }

      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1
        var arrLength = arr.length
        var valLength = val.length

        if (encoding !== undefined) {
          encoding = String(encoding).toLowerCase()
          if (encoding === 'ucs2' || encoding === 'ucs-2' ||
            encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) {
              return -1
            }
            indexSize = 2
            arrLength /= 2
            valLength /= 2
            byteOffset /= 2
          }
        }

        function read(buf, i) {
          if (indexSize === 1) {
            return buf[i]
          } else {
            return buf.readUInt16BE(i * indexSize)
          }
        }

        var i
        if (dir) {
          var foundIndex = -1
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
            } else {
              if (foundIndex !== -1) i -= i - foundIndex
              foundIndex = -1
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
          for (i = byteOffset; i >= 0; i--) {
            var found = true
            for (var j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false
                break
              }
            }
            if (found) return i
          }
        }

        return -1
      }

      Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1
      }

      Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
      }

      Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
      }

      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0
        var remaining = buf.length - offset
        if (!length) {
          length = remaining
        } else {
          length = Number(length)
          if (length > remaining) {
            length = remaining
          }
        }

        // must be an even number of digits
        var strLen = string.length
        if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

        if (length > strLen / 2) {
          length = strLen / 2
        }
        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(i * 2, 2), 16)
          if (isNaN(parsed)) return i
          buf[offset + i] = parsed
        }
        return i
      }

      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
      }

      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length)
      }

      function latin1Write(buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length)
      }

      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length)
      }

      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
      }

      Buffer.prototype.write = function write(string, offset, length, encoding) {
        // Buffer#write(string)
        if (offset === undefined) {
          encoding = 'utf8'
          length = this.length
          offset = 0
            // Buffer#write(string, encoding)
        } else if (length === undefined && typeof offset === 'string') {
          encoding = offset
          length = this.length
          offset = 0
            // Buffer#write(string, offset[, length][, encoding])
        } else if (isFinite(offset)) {
          offset = offset | 0
          if (isFinite(length)) {
            length = length | 0
            if (encoding === undefined) encoding = 'utf8'
          } else {
            encoding = length
            length = undefined
          }
          // legacy write(string, encoding, offset, length) - remove in v0.13
        } else {
          throw new Error(
            'Buffer.write(string, encoding, offset[, length]) is no longer supported'
          )
        }

        var remaining = this.length - offset
        if (length === undefined || length > remaining) length = remaining

        if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
          throw new RangeError('Attempt to write outside buffer bounds')
        }

        if (!encoding) encoding = 'utf8'

        var loweredCase = false
        for (;;) {
          switch (encoding) {
            case 'hex':
              return hexWrite(this, string, offset, length)

            case 'utf8':
            case 'utf-8':
              return utf8Write(this, string, offset, length)

            case 'ascii':
              return asciiWrite(this, string, offset, length)

            case 'latin1':
            case 'binary':
              return latin1Write(this, string, offset, length)

            case 'base64':
              // Warning: maxLength not taken into account in base64Write
              return base64Write(this, string, offset, length)

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return ucs2Write(this, string, offset, length)

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
              encoding = ('' + encoding).toLowerCase()
              loweredCase = true
          }
        }
      }

      Buffer.prototype.toJSON = function toJSON() {
        return {
          type: 'Buffer',
          data: Array.prototype.slice.call(this._arr || this, 0)
        }
      }

      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf)
        } else {
          return base64.fromByteArray(buf.slice(start, end))
        }
      }

      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end)
        var res = []

        var i = start
        while (i < end) {
          var firstByte = buf[i]
          var codePoint = null
          var bytesPerSequence = (firstByte > 0xEF) ? 4 : (firstByte > 0xDF) ? 3 : (firstByte > 0xBF) ? 2 : 1

          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint

            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 0x80) {
                  codePoint = firstByte
                }
                break
              case 2:
                secondByte = buf[i + 1]
                if ((secondByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                  if (tempCodePoint > 0x7F) {
                    codePoint = tempCodePoint
                  }
                }
                break
              case 3:
                secondByte = buf[i + 1]
                thirdByte = buf[i + 2]
                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                  if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                    codePoint = tempCodePoint
                  }
                }
                break
              case 4:
                secondByte = buf[i + 1]
                thirdByte = buf[i + 2]
                fourthByte = buf[i + 3]
                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                  if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                    codePoint = tempCodePoint
                  }
                }
            }
          }

          if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD
            bytesPerSequence = 1
          } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000
            res.push(codePoint >>> 10 & 0x3FF | 0xD800)
            codePoint = 0xDC00 | codePoint & 0x3FF
          }

          res.push(codePoint)
          i += bytesPerSequence
        }

        return decodeCodePointsArray(res)
      }

      // Based on http://stackoverflow.com/a/22747272/680742, the browser with
      // the lowest limit is Chrome, with 0x10000 args.
      // We go 1 magnitude less, for safety
      var MAX_ARGUMENTS_LENGTH = 0x1000

      function decodeCodePointsArray(codePoints) {
        var len = codePoints.length
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
        }

        // Decode in chunks to avoid "call stack size exceeded".
        var res = ''
        var i = 0
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          )
        }
        return res
      }

      function asciiSlice(buf, start, end) {
        var ret = ''
        end = Math.min(buf.length, end)

        for (var i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 0x7F)
        }
        return ret
      }

      function latin1Slice(buf, start, end) {
        var ret = ''
        end = Math.min(buf.length, end)

        for (var i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i])
        }
        return ret
      }

      function hexSlice(buf, start, end) {
        var len = buf.length

        if (!start || start < 0) start = 0
        if (!end || end < 0 || end > len) end = len

        var out = ''
        for (var i = start; i < end; ++i) {
          out += toHex(buf[i])
        }
        return out
      }

      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end)
        var res = ''
        for (var i = 0; i < bytes.length; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
        }
        return res
      }

      Buffer.prototype.slice = function slice(start, end) {
        var len = this.length
        start = ~~start
        end = end === undefined ? len : ~~end

        if (start < 0) {
          start += len
          if (start < 0) start = 0
        } else if (start > len) {
          start = len
        }

        if (end < 0) {
          end += len
          if (end < 0) end = 0
        } else if (end > len) {
          end = len
        }

        if (end < start) end = start

        var newBuf
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          newBuf = this.subarray(start, end)
          newBuf.__proto__ = Buffer.prototype
        } else {
          var sliceLen = end - start
          newBuf = new Buffer(sliceLen, undefined)
          for (var i = 0; i < sliceLen; ++i) {
            newBuf[i] = this[i + start]
          }
        }

        return newBuf
      }

      /*
       * Need to make sure that buffer isn't trying to write out of bounds.
       */
      function checkOffset(offset, ext, length) {
        if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
        if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
      }

      Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var val = this[offset]
        var mul = 1
        var i = 0
        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul
        }

        return val
      }

      Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) {
          checkOffset(offset, byteLength, this.length)
        }

        var val = this[offset + --byteLength]
        var mul = 1
        while (byteLength > 0 && (mul *= 0x100)) {
          val += this[offset + --byteLength] * mul
        }

        return val
      }

      Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 1, this.length)
        return this[offset]
      }

      Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        return this[offset] | (this[offset + 1] << 8)
      }

      Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        return (this[offset] << 8) | this[offset + 1]
      }

      Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return ((this[offset]) |
            (this[offset + 1] << 8) |
            (this[offset + 2] << 16)) +
          (this[offset + 3] * 0x1000000)
      }

      Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset] * 0x1000000) +
          ((this[offset + 1] << 16) |
            (this[offset + 2] << 8) |
            this[offset + 3])
      }

      Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var val = this[offset]
        var mul = 1
        var i = 0
        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul
        }
        mul *= 0x80

        if (val >= mul) val -= Math.pow(2, 8 * byteLength)

        return val
      }

      Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var i = byteLength
        var mul = 1
        var val = this[offset + --i]
        while (i > 0 && (mul *= 0x100)) {
          val += this[offset + --i] * mul
        }
        mul *= 0x80

        if (val >= mul) val -= Math.pow(2, 8 * byteLength)

        return val
      }

      Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 1, this.length)
        if (!(this[offset] & 0x80)) return (this[offset])
        return ((0xff - this[offset] + 1) * -1)
      }

      Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        var val = this[offset] | (this[offset + 1] << 8)
        return (val & 0x8000) ? val | 0xFFFF0000 : val
      }

      Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        var val = this[offset + 1] | (this[offset] << 8)
        return (val & 0x8000) ? val | 0xFFFF0000 : val
      }

      Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset]) |
          (this[offset + 1] << 8) |
          (this[offset + 2] << 16) |
          (this[offset + 3] << 24)
      }

      Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset] << 24) |
          (this[offset + 1] << 16) |
          (this[offset + 2] << 8) |
          (this[offset + 3])
      }

      Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)
        return ieee754.read(this, offset, true, 23, 4)
      }

      Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)
        return ieee754.read(this, offset, false, 23, 4)
      }

      Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 8, this.length)
        return ieee754.read(this, offset, true, 52, 8)
      }

      Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 8, this.length)
        return ieee754.read(this, offset, false, 52, 8)
      }

      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
        if (offset + ext > buf.length) throw new RangeError('Index out of range')
      }

      Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1
          checkInt(this, value, offset, byteLength, maxBytes, 0)
        }

        var mul = 1
        var i = 0
        this[offset] = value & 0xFF
        while (++i < byteLength && (mul *= 0x100)) {
          this[offset + i] = (value / mul) & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1
          checkInt(this, value, offset, byteLength, maxBytes, 0)
        }

        var i = byteLength - 1
        var mul = 1
        this[offset + i] = value & 0xFF
        while (--i >= 0 && (mul *= 0x100)) {
          this[offset + i] = (value / mul) & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
        if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
        this[offset] = (value & 0xff)
        return offset + 1
      }

      function objectWriteUInt16(buf, value, offset, littleEndian) {
        if (value < 0) value = 0xffff + value + 1
        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
          buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
        }
      }

      Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value & 0xff)
          this[offset + 1] = (value >>> 8)
        } else {
          objectWriteUInt16(this, value, offset, true)
        }
        return offset + 2
      }

      Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value >>> 8)
          this[offset + 1] = (value & 0xff)
        } else {
          objectWriteUInt16(this, value, offset, false)
        }
        return offset + 2
      }

      function objectWriteUInt32(buf, value, offset, littleEndian) {
        if (value < 0) value = 0xffffffff + value + 1
        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
          buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
        }
      }

      Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset + 3] = (value >>> 24)
          this[offset + 2] = (value >>> 16)
          this[offset + 1] = (value >>> 8)
          this[offset] = (value & 0xff)
        } else {
          objectWriteUInt32(this, value, offset, true)
        }
        return offset + 4
      }

      Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value >>> 24)
          this[offset + 1] = (value >>> 16)
          this[offset + 2] = (value >>> 8)
          this[offset + 3] = (value & 0xff)
        } else {
          objectWriteUInt32(this, value, offset, false)
        }
        return offset + 4
      }

      Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1)

          checkInt(this, value, offset, byteLength, limit - 1, -limit)
        }

        var i = 0
        var mul = 1
        var sub = 0
        this[offset] = value & 0xFF
        while (++i < byteLength && (mul *= 0x100)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1
          }
          this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1)

          checkInt(this, value, offset, byteLength, limit - 1, -limit)
        }

        var i = byteLength - 1
        var mul = 1
        var sub = 0
        this[offset + i] = value & 0xFF
        while (--i >= 0 && (mul *= 0x100)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1
          }
          this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
        if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
        if (value < 0) value = 0xff + value + 1
        this[offset] = (value & 0xff)
        return offset + 1
      }

      Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value & 0xff)
          this[offset + 1] = (value >>> 8)
        } else {
          objectWriteUInt16(this, value, offset, true)
        }
        return offset + 2
      }

      Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value >>> 8)
          this[offset + 1] = (value & 0xff)
        } else {
          objectWriteUInt16(this, value, offset, false)
        }
        return offset + 2
      }

      Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value & 0xff)
          this[offset + 1] = (value >>> 8)
          this[offset + 2] = (value >>> 16)
          this[offset + 3] = (value >>> 24)
        } else {
          objectWriteUInt32(this, value, offset, true)
        }
        return offset + 4
      }

      Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
        if (value < 0) value = 0xffffffff + value + 1
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = (value >>> 24)
          this[offset + 1] = (value >>> 16)
          this[offset + 2] = (value >>> 8)
          this[offset + 3] = (value & 0xff)
        } else {
          objectWriteUInt32(this, value, offset, false)
        }
        return offset + 4
      }

      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError('Index out of range')
        if (offset < 0) throw new RangeError('Index out of range')
      }

      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4)
        return offset + 4
      }

      Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert)
      }

      Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert)
      }

      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8)
        return offset + 8
      }

      Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert)
      }

      Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert)
      }

      // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
      Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        if (!start) start = 0
        if (!end && end !== 0) end = this.length
        if (targetStart >= target.length) targetStart = target.length
        if (!targetStart) targetStart = 0
        if (end > 0 && end < start) end = start

        // Copy 0 bytes; we're done
        if (end === start) return 0
        if (target.length === 0 || this.length === 0) return 0

        // Fatal error conditions
        if (targetStart < 0) {
          throw new RangeError('targetStart out of bounds')
        }
        if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
        if (end < 0) throw new RangeError('sourceEnd out of bounds')

        // Are we oob?
        if (end > this.length) end = this.length
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start
        }

        var len = end - start
        var i

        if (this === target && start < targetStart && targetStart < end) {
          // descending copy from end
          for (i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start]
          }
        } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
          // ascending copy from start
          for (i = 0; i < len; ++i) {
            target[i + targetStart] = this[i + start]
          }
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, start + len),
            targetStart
          )
        }

        return len
      }

      // Usage:
      //    buffer.fill(number[, offset[, end]])
      //    buffer.fill(buffer[, offset[, end]])
      //    buffer.fill(string[, offset[, end]][, encoding])
      Buffer.prototype.fill = function fill(val, start, end, encoding) {
        // Handle string cases:
        if (typeof val === 'string') {
          if (typeof start === 'string') {
            encoding = start
            start = 0
            end = this.length
          } else if (typeof end === 'string') {
            encoding = end
            end = this.length
          }
          if (val.length === 1) {
            var code = val.charCodeAt(0)
            if (code < 256) {
              val = code
            }
          }
          if (encoding !== undefined && typeof encoding !== 'string') {
            throw new TypeError('encoding must be a string')
          }
          if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding)
          }
        } else if (typeof val === 'number') {
          val = val & 255
        }

        // Invalid ranges are not set to a default, so can range check early.
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError('Out of range index')
        }

        if (end <= start) {
          return this
        }

        start = start >>> 0
        end = end === undefined ? this.length : end >>> 0

        if (!val) val = 0

        var i
        if (typeof val === 'number') {
          for (i = start; i < end; ++i) {
            this[i] = val
          }
        } else {
          var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString())
          var len = bytes.length
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len]
          }
        }

        return this
      }

      // HELPER FUNCTIONS
      // ================

      var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

      function base64clean(str) {
        // Node strips out invalid characters like \n and \t from the string, base64-js does not
        str = stringtrim(str).replace(INVALID_BASE64_RE, '')
          // Node converts strings with length < 2 to ''
        if (str.length < 2) return ''
          // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
        while (str.length % 4 !== 0) {
          str = str + '='
        }
        return str
      }

      function stringtrim(str) {
        if (str.trim) return str.trim()
        return str.replace(/^\s+|\s+$/g, '')
      }

      function toHex(n) {
        if (n < 16) return '0' + n.toString(16)
        return n.toString(16)
      }

      function utf8ToBytes(string, units) {
        units = units || Infinity
        var codePoint
        var length = string.length
        var leadSurrogate = null
        var bytes = []

        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i)

          // is surrogate component
          if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
              // no lead yet
              if (codePoint > 0xDBFF) {
                // unexpected trail
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                continue
              } else if (i + 1 === length) {
                // unpaired lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                continue
              }

              // valid lead
              leadSurrogate = codePoint

              continue
            }

            // 2 leads in a row
            if (codePoint < 0xDC00) {
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              leadSurrogate = codePoint
              continue
            }

            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
          } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          }

          leadSurrogate = null

          // encode utf8
          if (codePoint < 0x80) {
            if ((units -= 1) < 0) break
            bytes.push(codePoint)
          } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break
            bytes.push(
              codePoint >> 0x6 | 0xC0,
              codePoint & 0x3F | 0x80
            )
          } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break
            bytes.push(
              codePoint >> 0xC | 0xE0,
              codePoint >> 0x6 & 0x3F | 0x80,
              codePoint & 0x3F | 0x80
            )
          } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break
            bytes.push(
              codePoint >> 0x12 | 0xF0,
              codePoint >> 0xC & 0x3F | 0x80,
              codePoint >> 0x6 & 0x3F | 0x80,
              codePoint & 0x3F | 0x80
            )
          } else {
            throw new Error('Invalid code point')
          }
        }

        return bytes
      }

      function asciiToBytes(str) {
        var byteArray = []
        for (var i = 0; i < str.length; ++i) {
          // Node's code seems to be doing this and not & 0x7F..
          byteArray.push(str.charCodeAt(i) & 0xFF)
        }
        return byteArray
      }

      function utf16leToBytes(str, units) {
        var c, hi, lo
        var byteArray = []
        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break

          c = str.charCodeAt(i)
          hi = c >> 8
          lo = c % 256
          byteArray.push(lo)
          byteArray.push(hi)
        }

        return byteArray
      }

      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str))
      }

      function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if ((i + offset >= dst.length) || (i >= src.length)) break
          dst[i + offset] = src[i]
        }
        return i
      }

      function isnan(val) {
        return val !== val // eslint-disable-line no-self-compare
      }

      /* WEBPACK VAR INJECTION */
    }.call(exports, (function() {
      return this;
    }())))

    /***/
  },

  /***/
  76:
  /***/
    function(module, exports) {

    'use strict'

    exports.byteLength = byteLength
    exports.toByteArray = toByteArray
    exports.fromByteArray = fromByteArray

    var lookup = []
    var revLookup = []
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i]
      revLookup[code.charCodeAt(i)] = i
    }

    revLookup['-'.charCodeAt(0)] = 62
    revLookup['_'.charCodeAt(0)] = 63

    function placeHoldersCount(b64) {
      var len = b64.length
      if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4')
      }

      // the number of equal signs (place holders)
      // if there are two placeholders, than the two characters before it
      // represent one byte
      // if there is only one, then the three characters before it represent 2 bytes
      // this is just a cheap hack to not do indexOf twice
      return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
    }

    function byteLength(b64) {
      // base64 is 4/3 + up to two characters of the original data
      return b64.length * 3 / 4 - placeHoldersCount(b64)
    }

    function toByteArray(b64) {
      var i, j, l, tmp, placeHolders, arr
      var len = b64.length
      placeHolders = placeHoldersCount(b64)

      arr = new Arr(len * 3 / 4 - placeHolders)

      // if there are placeholders, only get up to the last complete 4 chars
      l = placeHolders > 0 ? len - 4 : len

      var L = 0

      for (i = 0, j = 0; i < l; i += 4, j += 3) {
        tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
        arr[L++] = (tmp >> 16) & 0xFF
        arr[L++] = (tmp >> 8) & 0xFF
        arr[L++] = tmp & 0xFF
      }

      if (placeHolders === 2) {
        tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
        arr[L++] = tmp & 0xFF
      } else if (placeHolders === 1) {
        tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
        arr[L++] = (tmp >> 8) & 0xFF
        arr[L++] = tmp & 0xFF
      }

      return arr
    }

    function tripletToBase64(num) {
      return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
    }

    function encodeChunk(uint8, start, end) {
      var tmp
      var output = []
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
        output.push(tripletToBase64(tmp))
      }
      return output.join('')
    }

    function fromByteArray(uint8) {
      var tmp
      var len = uint8.length
      var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
      var output = ''
      var parts = []
      var maxChunkLength = 16383 // must be multiple of 3

      // go through the array every three bytes, we'll deal with trailing stuff later
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
      }

      // pad the end with zeros, but make sure to not forget the extra bytes
      if (extraBytes === 1) {
        tmp = uint8[len - 1]
        output += lookup[tmp >> 2]
        output += lookup[(tmp << 4) & 0x3F]
        output += '=='
      } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
        output += lookup[tmp >> 10]
        output += lookup[(tmp >> 4) & 0x3F]
        output += lookup[(tmp << 2) & 0x3F]
        output += '='
      }

      parts.push(output)

      return parts.join('')
    }


    /***/
  },

  /***/
  77:
  /***/
    function(module, exports) {

    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m
      var eLen = nBytes * 8 - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var nBits = -7
      var i = isLE ? (nBytes - 1) : 0
      var d = isLE ? -1 : 1
      var s = buffer[offset + i]

      i += d

      e = s & ((1 << (-nBits)) - 1)
      s >>= (-nBits)
      nBits += eLen
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

      m = e & ((1 << (-nBits)) - 1)
      e >>= (-nBits)
      nBits += mLen
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

      if (e === 0) {
        e = 1 - eBias
      } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity)
      } else {
        m = m + Math.pow(2, mLen)
        e = e - eBias
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    }

    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c
      var eLen = nBytes * 8 - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
      var i = isLE ? 0 : (nBytes - 1)
      var d = isLE ? 1 : -1
      var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

      value = Math.abs(value)

      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0
        e = eMax
      } else {
        e = Math.floor(Math.log(value) / Math.LN2)
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--
          c *= 2
        }
        if (e + eBias >= 1) {
          value += rt / c
        } else {
          value += rt * Math.pow(2, 1 - eBias)
        }
        if (value * c >= 2) {
          e++
          c /= 2
        }

        if (e + eBias >= eMax) {
          m = 0
          e = eMax
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen)
          e = e + eBias
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
          e = 0
        }
      }

      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

      e = (e << mLen) | m
      eLen += mLen
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

      buffer[offset + i - d] |= s * 128
    }


    /***/
  },

  /***/
  78:
  /***/
    function(module, exports) {

    var toString = {}.toString;

    module.exports = Array.isArray || function(arr) {
      return toString.call(arr) == '[object Array]';
    };


    /***/
  },

  /***/
  79:
  /***/
    function(module, exports) {

    'use strict';

    module.exports = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };


    /***/
  },

  /***/
  80:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var defaults = __webpack_require__(81);
    var utils = __webpack_require__(74);
    var InterceptorManager = __webpack_require__(92);
    var dispatchRequest = __webpack_require__(93);
    var isAbsoluteURL = __webpack_require__(96);
    var combineURLs = __webpack_require__(97);

    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof config === 'string') {
        config = utils.merge({
          url: arguments[0]
        }, arguments[1]);
      }

      config = utils.merge(defaults, this.defaults, {
        method: 'get'
      }, config);

      // Support baseURL config
      if (config.baseURL && !isAbsoluteURL(config.url)) {
        config.url = combineURLs(config.baseURL, config.url);
      }

      // Hook up interceptors middleware
      var chain = [dispatchRequest, undefined];
      var promise = Promise.resolve(config);

      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });

      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(utils.merge(config || {}, {
          method: method,
          url: url
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, data, config) {
        return this.request(utils.merge(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });

    module.exports = Axios;


    /***/
  },

  /***/
  81:
  /***/
    function(module, exports, __webpack_require__) {

    /* WEBPACK VAR INJECTION */
    (function(process) {
      'use strict';

      var utils = __webpack_require__(74);
      var normalizeHeaderName = __webpack_require__(82);

      var DEFAULT_CONTENT_TYPE = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      function setContentTypeIfUnset(headers, value) {
        if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
          headers['Content-Type'] = value;
        }
      }

      function getDefaultAdapter() {
        var adapter;
        if (typeof XMLHttpRequest !== 'undefined') {
          // For browsers use XHR adapter
          adapter = __webpack_require__(83);
        } else if (typeof process !== 'undefined') {
          // For node use HTTP adapter
          adapter = __webpack_require__(83);
        }
        return adapter;
      }

      var defaults = {
        adapter: getDefaultAdapter(),

        transformRequest: [function transformRequest(data, headers) {
          normalizeHeaderName(headers, 'Content-Type');
          if (utils.isFormData(data) ||
            utils.isArrayBuffer(data) ||
            utils.isBuffer(data) ||
            utils.isStream(data) ||
            utils.isFile(data) ||
            utils.isBlob(data)
          ) {
            return data;
          }
          if (utils.isArrayBufferView(data)) {
            return data.buffer;
          }
          if (utils.isURLSearchParams(data)) {
            setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
            return data.toString();
          }
          if (utils.isObject(data)) {
            setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
            return JSON.stringify(data);
          }
          return data;
        }],

        transformResponse: [function transformResponse(data) {
          /*eslint no-param-reassign:0*/
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) { /* Ignore */ }
          }
          return data;
        }],

        timeout: 0,

        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',

        maxContentLength: -1,

        validateStatus: function validateStatus(status) {
          return status >= 200 && status < 300;
        }
      };

      defaults.headers = {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      };

      utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
        defaults.headers[method] = {};
      });

      utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
        defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
      });

      module.exports = defaults;

      /* WEBPACK VAR INJECTION */
    }.call(exports, __webpack_require__(68)))

    /***/
  },

  /***/
  82:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var utils = __webpack_require__(74);

    module.exports = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };


    /***/
  },

  /***/
  83:
  /***/
    function(module, exports, __webpack_require__) {

    /* WEBPACK VAR INJECTION */
    (function(process) {
      'use strict';

      var utils = __webpack_require__(74);
      var settle = __webpack_require__(84);
      var buildURL = __webpack_require__(87);
      var parseHeaders = __webpack_require__(88);
      var isURLSameOrigin = __webpack_require__(89);
      var createError = __webpack_require__(85);
      var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(90);

      module.exports = function xhrAdapter(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject) {
          var requestData = config.data;
          var requestHeaders = config.headers;

          if (utils.isFormData(requestData)) {
            delete requestHeaders['Content-Type']; // Let the browser set it
          }

          var request = new XMLHttpRequest();
          var loadEvent = 'onreadystatechange';
          var xDomain = false;

          // For IE 8/9 CORS support
          // Only supports POST and GET calls and doesn't returns the response headers.
          // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
          if (process.env.NODE_ENV !== 'test' &&
            typeof window !== 'undefined' &&
            window.XDomainRequest && !('withCredentials' in request) &&
            !isURLSameOrigin(config.url)) {
            request = new window.XDomainRequest();
            loadEvent = 'onload';
            xDomain = true;
            request.onprogress = function handleProgress() {};
            request.ontimeout = function handleTimeout() {};
          }

          // HTTP basic authentication
          if (config.auth) {
            var username = config.auth.username || '';
            var password = config.auth.password || '';
            requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
          }

          request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

          // Set the request timeout in MS
          request.timeout = config.timeout;

          // Listen for ready state
          request[loadEvent] = function handleLoad() {
            if (!request || (request.readyState !== 4 && !xDomain)) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }

            // Prepare the response
            var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
            var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
            var response = {
              data: responseData,
              // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
              status: request.status === 1223 ? 204 : request.status,
              statusText: request.status === 1223 ? 'No Content' : request.statusText,
              headers: responseHeaders,
              config: config,
              request: request
            };

            settle(resolve, reject, response);

            // Clean up request
            request = null;
          };

          // Handle low level network errors
          request.onerror = function handleError() {
            // Real errors are hidden from us by the browser
            // onerror should only fire if it's a network error
            reject(createError('Network Error', config));

            // Clean up request
            request = null;
          };

          // Handle timeout
          request.ontimeout = function handleTimeout() {
            reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));

            // Clean up request
            request = null;
          };

          // Add xsrf header
          // This is only done if running in a standard browser environment.
          // Specifically not if we're in a web worker, or react-native.
          if (utils.isStandardBrowserEnv()) {
            var cookies = __webpack_require__(91);

            // Add xsrf header
            var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
              cookies.read(config.xsrfCookieName) :
              undefined;

            if (xsrfValue) {
              requestHeaders[config.xsrfHeaderName] = xsrfValue;
            }
          }

          // Add headers to the request
          if ('setRequestHeader' in request) {
            utils.forEach(requestHeaders, function setRequestHeader(val, key) {
              if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
                // Remove Content-Type if data is undefined
                delete requestHeaders[key];
              } else {
                // Otherwise add header to the request
                request.setRequestHeader(key, val);
              }
            });
          }

          // Add withCredentials to request if needed
          if (config.withCredentials) {
            request.withCredentials = true;
          }

          // Add responseType to request if needed
          if (config.responseType) {
            try {
              request.responseType = config.responseType;
            } catch (e) {
              // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
              // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
              if (config.responseType !== 'json') {
                throw e;
              }
            }
          }

          // Handle progress if needed
          if (typeof config.onDownloadProgress === 'function') {
            request.addEventListener('progress', config.onDownloadProgress);
          }

          // Not all browsers support upload events
          if (typeof config.onUploadProgress === 'function' && request.upload) {
            request.upload.addEventListener('progress', config.onUploadProgress);
          }

          if (config.cancelToken) {
            // Handle cancellation
            config.cancelToken.promise.then(function onCanceled(cancel) {
              if (!request) {
                return;
              }

              request.abort();
              reject(cancel);
              // Clean up request
              request = null;
            });
          }

          if (requestData === undefined) {
            requestData = null;
          }

          // Send the request
          request.send(requestData);
        });
      };

      /* WEBPACK VAR INJECTION */
    }.call(exports, __webpack_require__(68)))

    /***/
  },

  /***/
  84:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var createError = __webpack_require__(85);

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    module.exports = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      // Note: status is not exposed by XDomainRequest
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response
        ));
      }
    };


    /***/
  },

  /***/
  85:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var enhanceError = __webpack_require__(86);

    /**
     * Create an Error with the specified message, config, error code, and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     @ @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    module.exports = function createError(message, config, code, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, response);
    };


    /***/
  },

  /***/
  86:
  /***/
    function(module, exports) {

    'use strict';

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     @ @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    module.exports = function enhanceError(error, config, code, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }
      error.response = response;
      return error;
    };


    /***/
  },

  /***/
  87:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var utils = __webpack_require__(74);

    function encode(val) {
      return encodeURIComponent(val).
      replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    module.exports = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          }

          if (!utils.isArray(val)) {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };


    /***/
  },

  /***/
  88:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var utils = __webpack_require__(74);

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    module.exports = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) {
        return parsed;
      }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      });

      return parsed;
    };


    /***/
  },

  /***/
  89:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var utils = __webpack_require__(74);

    module.exports = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
         * Parse a URL to discover it's components
         *
         * @param {String} url The URL to be parsed
         * @returns {Object}
         */
        function resolveURL(url) {
          var href = url;

          if (msie) {
            // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname : '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
         * Determine if a URL shares the same origin as the current location
         *
         * @param {String} requestURL The URL to test
         * @returns {boolean} True if URL shares the same origin, otherwise false
         */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
        };
      })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
    );


    /***/
  },

  /***/
  90:
  /***/
    function(module, exports) {

    'use strict';

    // btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    function E() {
      this.message = 'String contains an invalid character';
    }
    E.prototype = new Error;
    E.prototype.code = 5;
    E.prototype.name = 'InvalidCharacterError';

    function btoa(input) {
      var str = String(input);
      var output = '';
      for (
        // initialize result and counter
        var block, charCode, idx = 0, map = chars;
        // if the next str index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        str.charAt(idx | 0) || (map = '=', idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)
      ) {
        charCode = str.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) {
          throw new E();
        }
        block = block << 8 | charCode;
      }
      return output;
    }

    module.exports = btoa;


    /***/
  },

  /***/
  91:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var utils = __webpack_require__(74);

    module.exports = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

      // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() {
            return null;
          },
          remove: function remove() {}
        };
      })()
    );


    /***/
  },

  /***/
  92:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var utils = __webpack_require__(74);

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    module.exports = InterceptorManager;


    /***/
  },

  /***/
  93:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var utils = __webpack_require__(74);
    var transformData = __webpack_require__(94);
    var isCancel = __webpack_require__(95);
    var defaults = __webpack_require__(81);

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    module.exports = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData(
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers || {}
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData(
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData(
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };


    /***/
  },

  /***/
  94:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var utils = __webpack_require__(74);

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    module.exports = function transformData(data, headers, fns) {
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn(data, headers);
      });

      return data;
    };


    /***/
  },

  /***/
  95:
  /***/
    function(module, exports) {

    'use strict';

    module.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };


    /***/
  },

  /***/
  96:
  /***/
    function(module, exports) {

    'use strict';

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    module.exports = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };


    /***/
  },

  /***/
  97:
  /***/
    function(module, exports) {

    'use strict';

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    module.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
    };


    /***/
  },

  /***/
  98:
  /***/
    function(module, exports) {

    'use strict';

    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function Cancel(message) {
      this.message = message;
    }

    Cancel.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel.prototype.__CANCEL__ = true;

    module.exports = Cancel;


    /***/
  },

  /***/
  99:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    var Cancel = __webpack_require__(98);

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;
      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new Cancel(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    module.exports = CancelToken;


    /***/
  },

  /***/
  100:
  /***/
    function(module, exports) {

    'use strict';

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    module.exports = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };


    /***/
  },

  /***/
  134:
  /***/
    function(module, exports) {

    // removed by extract-text-webpack-plugin

    /***/
  },

  /***/
  237:
  /***/
    function(module, exports, __webpack_require__) {

    var __vue_exports__, __vue_options__
    var __vue_styles__ = {}

    /* script */
    __vue_exports__ = __webpack_require__(238)

    /* template */
    var __vue_template__ = __webpack_require__(245)
    __vue_options__ = __vue_exports__ = __vue_exports__ || {}
    if (
      typeof __vue_exports__.default === "object" ||
      typeof __vue_exports__.default === "function"
    ) {
      if (Object.keys(__vue_exports__).some(function(key) {
          return key !== "default" && key !== "__esModule"
        })) {
        console.error("named exports are not supported in *.vue files.")
      }
      __vue_options__ = __vue_exports__ = __vue_exports__.default
    }
    if (typeof __vue_options__ === "function") {
      __vue_options__ = __vue_options__.options
    }
    __vue_options__.__file = "F:\\open_team\\static\\developer\\src\\view\\page\\energy.vue"
    __vue_options__.render = __vue_template__.render
    __vue_options__.staticRenderFns = __vue_template__.staticRenderFns

    /* hot reload */
    if (false) {
      (function() {
        var hotAPI = require("vue-hot-reload-api")
        hotAPI.install(require("vue"), false)
        if (!hotAPI.compatible) return
        module.hot.accept()
        if (!module.hot.data) {
          hotAPI.createRecord("data-v-0416c072", __vue_options__)
        } else {
          hotAPI.reload("data-v-0416c072", __vue_options__)
        }
      })()
    }
    if (__vue_options__.functional) {
      console.error("[vue-loader] energy.vue: functional components are not supported and should be defined in plain js files using render functions.")
    }

    module.exports = __vue_exports__


    /***/
  },

  /***/
  238:
  /***/
    function(module, exports, __webpack_require__) {

    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _vue = __webpack_require__(70);

    var _vue2 = _interopRequireDefault(_vue);

    __webpack_require__(134);

    __webpack_require__(239);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    exports.default = {
      data: function data() {
        return {
          cHeight: null,
          info: null,
          switchBtn: false,
          loaded: false,
          tagArray: [{
            isCheck: false,
            isOn: true,
            name: '总经理办公室',
            id: 1639053,
            boundingBox: {
              max: {
                x: -53101.81,
                y: 2721.257,
                z: 1352.483
              },
              min: {
                x: -53123.81,
                y: 2527.628,
                z: 1220.26
              }
            },
            cameraStatus: {
              position: {
                x: -2287.149370952311,
                y: 110.52557569686243,
                z: -192.1875071537883
              },
              target: {
                x: -2269.582016914656,
                y: 101.27441349800284,
                z: -179.21726068967553
              },
              up: {
                x: 0,
                y: 1,
                z: 0
              }
            },
            arr: [831512, 831648, 831511, 831510, 831632, 831481, 831480, 831479, 831477, 831476, 831475, 831503, 831474, 831453, 831644, 831454, 831455, 831456, 831457, 831458, 831459, 831460, 831506, 831507, 831508, 831649, 831509, 1242435, 838898, 1280238, 831453, 831454, 831455, 831456, 831457, 831458, 831459, 831460, 831474, 831475, 831476, 831477, 831479, 831480, 831481, 831503, 831506, 831507, 831508, 831509, 831510, 831511, 831512, 831632, 831644, 831648, 831649],
            info: {
              co2: 800,
              tvoc: 0.2,
              pm25: 32,
              t: 24,
              h: 32,
              pm: 60
            }
          }, {
            isCheck: false,
            isOn: true,
            name: '财务部',
            id: 1630239,
            boundingBox: {
              max: {
                x: -52981.81,
                y: 3003.376,
                z: 1493.396
              },
              min: {
                x: -53001.81,
                y: 2883.376,
                z: 1373.396
              }
            },
            cameraStatus: {
              position: {
                x: -2121.1852885149365,
                y: 64.23217351460244,
                z: -129.7344066005589
              },
              target: {
                x: -2139.176163459029,
                y: 57.32617924509378,
                z: -115.91200141371534
              },
              up: {
                x: 0,
                y: 1,
                z: 0
              }
            },
            arr: [831533, 831532, 831531, 831530, 831526, 831529, 831528, 831527, 831488, 831489, 831635, 831490, 831491, 831492, 831493, 840866, 831473, 831472, 831471, 831470, 831469, 831502, 831468, 831467, 831467, 831468, 831469, 831470, 831471, 831472, 831473, 831488, 831489, 831490, 831491, 831492, 831493, 831502, 831526, 831527, 831528, 831529, 831530, 831531, 831532, 831533, 840866],
            info: {
              co2: 792,
              tvoc: 0.2,
              pm25: 32,
              t: 26,
              h: 32,
              pm: 60
            }
          }, {
            isCheck: false,
            isOn: true,
            name: '会议室',
            id: 1636188,
            boundingBox: {
              max: {
                x: -46427.89,
                y: 17902.37,
                z: 1360.034
              },
              min: {
                x: -46449.89,
                y: 17708.74,
                z: 1227.811
              }
            },
            cameraStatus: {
              position: {
                x: -1754.591615954263,
                y: 92.71290626702813,
                z: -673.0872154996584
              },
              target: {
                x: -1779.6175349575065,
                y: 80.36309759561225,
                z: -688.5824773989018
              },
              up: {
                x: 0,
                y: 1,
                z: 0
              }
            },
            arr: [831199, 831200, 831201, 831203, 831204, 831205, 831206, 831207, 831208, 831209, 831210, 831211, 831247, 831249, 831250, 831252, 831253, 831255, 831256, 831257, 831258, 831259, 831261, 831297, 831298, 831302, 831303, 831304, 831305, 831306, 831308, 831309, 831310, 831311, 831338, 831339, 831340, 831545, 831546, 831547, 831548, 831549, 831550, 831551, 831552, 831553, 831554, 831555, 831556, 831557, 831558, 831608, 841228, 841327, 843654, 831146, 831147, 831149, 831150, 831151, 831152, 831153, 831154, 831155, 831156, 831157, 831158, 831159, 831160, 831161, 831163, 831164, 831165, 831196, 831197, 831198, 831199, 831200, 831201, 831203, 831204, 831205, 831206, 831207, 831208, 831209, 831210, 831211, 831212, 831213, 831214, 831215, 831216, 831217, 831247, 831249, 831250, 831252, 831253, 831255, 831256, 831257, 831258, 831259, 831261, 831263, 831266, 831296, 831297, 831298, 831302, 831303, 831304, 831305, 831306, 831308, 831309, 831310, 831311, 831312, 831313, 831315, 831316, 831317, 831338, 831339, 831340, 831545, 831546, 831547, 831548, 831549, 831550, 831551, 831552, 831553, 831554, 831555, 831556, 831557, 831558, 831559, 831560, 831561, 831562, 831563, 831564, 831608, 841228, 841327, 841370, 843654, 844007, 1244007, 1495905],
            info: {
              co2: 802,
              tvoc: 0.2,
              pm25: 32,
              t: 25,
              h: 33,
              pm: 60
            }
          }, {
            isCheck: false,
            isOn: true,
            name: '销售部',
            id: 1625158,
            boundingBox: {
              max: {
                x: -49050,
                y: 18892.37,
                z: 1346.615
              },
              min: {
                x: -49070,
                y: 18772.37,
                z: 1226.615
              }
            },
            cameraStatus: {
              position: {
                x: -2031.032845212085,
                y: 76.27969620662729,
                z: -743.905675339089
              },
              target: {
                x: -2025.3701997983305,
                y: 69.25473932201328,
                z: -751.5384570478523
              },
              up: {
                x: 0,
                y: 1,
                z: 0
              }
            },
            arr: [831274, 831275, 831276, 831277, 831278, 831279, 831280, 831293, 831300, 831321, 831322, 831323, 831324, 831325, 831326, 831336, 831337, 831341, 831569, 831570, 831571, 831572, 831573, 831574, 831575, 831576, 831577, 831578],
            info: {
              co2: 798,
              tvoc: 0.2,
              pm25: 32,
              t: 26,
              h: 32,
              pm: 60
            }
          }, {
            isCheck: false,
            isOn: true,
            name: '采购部',
            id: 1634894,
            boundingBox: {
              max: {
                x: -57602.53,
                y: 21253.29,
                z: 1371.756
              },
              min: {
                x: -57796.16,
                y: 21231.29,
                z: 1239.534
              }
            },
            cameraStatus: {
              position: {
                x: -2394.836663307207,
                y: 92.22732617442831,
                z: -795.9765848144136
              },
              target: {
                x: -2300.042610098042,
                y: 7.957387471467581,
                z: -894.5133700626192
              },
              up: {
                x: 0,
                y: 1,
                z: 0
              }
            },
            arr: [831287, 831288, 831290, 831294, 831332, 831333, 831587, 831588, 831589, 831590, 831591, 831616, 831659, 831660, 844253, 844402],
            info: {
              co2: 812,
              tvoc: 0.2,
              pm25: 32,
              t: 27,
              h: 36,
              pm: 60
            }
          }],
          componentsColor: [],
          tagList: [],
          infoBox: {
            co2: 0,
            tvoc: 0,
            pm25: 0,
            t: 0,
            h: 0,
            pm: 0
          }
        };
      },
      mounted: function mounted() {
        var me = this;

        me.cHeight = document.documentElement.clientHeight - 475 + 'px';

        me.$http.get('http://bimface.com/console/share/preview/viewtoken?token=4b042b5d').then(function(res) {
          if (res.data.code == 'success') {
            var successCallback = function successCallback() {
              // 获取DOM元素
              var dom4Show = document.getElementById('view3d');
              var webAppConfig = new Glodon.Bimface.Application.WebApplication3DConfig();
              webAppConfig.domElement = dom4Show;

              // 创建WebApplication
              window.app = new Glodon.Bimface.Application.WebApplication3D(webAppConfig);

              // 添加待显示的模型
              app.addView(viewToken);

              // 监听添加view完成的事件
              app.addEventListener(Glodon.Bimface.Application.WebApplication3DEvent.ViewAdded, function() {

                // 从WebApplication获取viewer3D对象
                window.viewer3D = app.getViewer();

                app.render();
                me.loaded = true;

                // 初始化DrawableContainer
                var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
                drawableConfig.viewer = window.viewer3D;
                window.drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);

                me.updateTag();
              });
            };

            var failureCallback = function failureCallback(error) {
              console.log(error);
            };

			//var viewToken = "e563f4b54bd94a2b9ddaf1d6e33d172a"

			
            //var viewToken = res.data.data;

            var options = new BimfaceSDKLoaderConfig();
            options.viewToken = viewToken;
            BimfaceSDKLoader.load(options, successCallback, failureCallback);

            ;;
          }
        });

        window.chart = new Highcharts.Chart({
          chart: {
            renderTo: 'energy',
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            backgroundColor: '#333333',
            events: {
              load: function load() {
                // set up the updating of the chart each second
                var series = this.series[0];
                setInterval(function() {
                  var x = new Date().getTime(),
                    // current time
                    y = Math.random();
                  series.addPoint([x, y], true, true);
                }, 500);
              }
            }
          },
          plotOptions: {
            spline: {
              lineWidth: 1.5,
              fillOpacity: 0.1,
              marker: {
                enabled: false,
                states: {
                  hover: {
                    enabled: true,
                    radius: 2
                  }
                }
              },
              shadow: false
            }
          },
          colors: ['#68a526'],
          credits: {
            enabled: false
          },
          title: {
            text: null
          },
          xAxis: {
            gridLineColor: '#5d5d5d',
            gridLineWidth: 1,
            lineColor: '#5d5d5d',
            labels: {
              enabled: false
            }
          },
          yAxis: {
            title: {
              text: null
            },
            min: 0,
            gridLineColor: '#5d5d5d',
            gridLineWidth: 1,
            labels: {
              enabled: false
            }
          },
          tooltip: {
            enabled: false
          },
          legend: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          series: [{
            name: '实时耗电量',
            data: function() {
              // generate an array of random data
              var data = [],
                time = new Date().getTime(),
                i;

              for (i = -10; i <= 0; i++) {
                data.push({
                  x: time + i * 500,
                  y: Math.random()
                });
              }
              return data;
            }()
          }]
        });
      },


      methods: {
        showBoard: function showBoard(num) {
          viewer3D.setView(Glodon.Bimface.Viewer.ViewOption.Home);
          this.selectTag(num);
        },

        selectTag: function selectTag(num) {
          var me = this;
          me.reset();
          me.tagArray[num].isCheck = true;
          viewer3D.restoreComponentsColorById(me.componentsColor);
          if (this.tagArray[num].isOn) {
            me.switchBtn = true;
            me.infoBox = me.tagArray[num].info;
            me.componentsColor = me.tagArray[num].arr;
            var modeColor = new Glodon.Web.Graphics.Color(0, 255, 0, 100);
            viewer3D.overrideComponentsColorById(me.componentsColor, modeColor);
          } else {
            me.switchBtn = false;
            this.infoBox = {
              co2: 0,
              tvoc: 0,
              pm25: 0,
              t: 0,
              h: 0,
              pm: 0
            };
          }
          viewer3D.render();
        },

        updateTag: function updateTag() {
          var me = this;
          me.tagList = [];

          var _loop = function _loop(i) {
            if (me.tagArray[i].isOn) {
              var _worldPosition = new Object();
              _worldPosition.x = (me.tagArray[i].boundingBox.max.x + me.tagArray[i].boundingBox.min.x) / 2;
              _worldPosition.y = (me.tagArray[i].boundingBox.max.y + me.tagArray[i].boundingBox.min.y) / 2;
              _worldPosition.z = (me.tagArray[i].boundingBox.max.z + me.tagArray[i].boundingBox.min.z) / 2;

              config = new Glodon.Bimface.Plugins.Drawable.CustomItemConfig();
              circle = document.createElement('div');

              circle.className = 'bln';
              config.content = circle;
              config.viewer = window.viewer3D;
              config.index = i;
              config.worldPosition = _worldPosition;

              //生成customItem实例
              customItem = new Glodon.Bimface.Plugins.Drawable.CustomItem(config);

              customItem.onClick(function(item) {
                me.selectTag(item._config.index);
                viewer3D.setCameraStatus(me.tagArray[i].cameraStatus);
              });

              me.tagList.push(customItem);
            }
          };

          for (var i = 0; i < me.tagArray.length; i++) {
            var config;
            var circle;
            var customItem;

            _loop(i);
          }
          drawableContainer.addItems(me.tagList);
          viewer3D.render();
        },

        reset: function reset() {
          var me = this;
          for (var i = 0; i < me.tagArray.length; i++) {
            me.tagArray[i].isCheck = false;
          }
        },

        btnSwitch: function btnSwitch() {
          for (var i = 0; i < this.tagArray.length; i++) {
            if (this.tagArray[i].isCheck) {
              if (this.tagArray[i].isOn) {
                this.switchBtn = false;
                this.tagArray[i].isOn = false;
                this.infoBox = {
                  co2: 0,
                  tvoc: 0,
                  pm25: 0,
                  t: 0,
                  h: 0,
                  pm: 0
                };
                viewer3D.restoreComponentsColorById(this.componentsColor);
                this.updateTag();
              } else {
                this.switchBtn = true;
                this.tagArray[i].isOn = true;
                this.infoBox = {
                  co2: this.tagArray[i].info.co2,
                  tvoc: this.tagArray[i].info.tvoc,
                  pm25: this.tagArray[i].info.pm25,
                  t: this.tagArray[i].info.t,
                  h: this.tagArray[i].info.h,
                  pm: this.tagArray[i].info.pm
                };
                this.componentsColor = this.tagArray[i].arr;
                var modeColor = new Glodon.Web.Graphics.Color(0, 255, 0, 100);
                viewer3D.overrideComponentsColorById(this.componentsColor, modeColor);
                this.updateTag();
              }
            }
          }
          viewer3D.render();
        },

        updataCharts: function updataCharts() {
          var inc = [];
          var time = new Date().getTime();
          for (var i = -10; i <= 0; i++) {
            inc.push({
              x: time + i * 1000,
              y: Math.random()
            });
          }
          chart.series[0].setData(inc);
          chart.redraw(false);
        },

        btnUp: function btnUp() {
          if (this.switchBtn && this.infoBox.t < 36) {
            this.infoBox.t++;
          }
        },

        btnDown: function btnDown() {
          if (this.switchBtn && this.infoBox.t > 18) {
            this.infoBox.t--;
          }
        }
      }
    }; //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    /***/
  },

  /***/
  239:
  /***/
    function(module, exports) {

    // removed by extract-text-webpack-plugin

    /***/
  },

  /***/
  245:
  /***/
    function(module, exports, __webpack_require__) {

    module.exports = {
      render: function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c('div', {
          attrs: {
            "id": "app"
          }
        }, [_c('div', {
          staticClass: "container"
        }, [_c('div', {
          attrs: {
            "id": "view3d"
          }
        }), _vm._v(" "), _c('div', {
          directives: [{
            name: "show",
            rawName: "v-show",
            value: (_vm.loaded),
            expression: "loaded"
          }],
          staticClass: "side"
        }, [_c('ul', {
          staticClass: "list",
          style: ({
            'height': _vm.cHeight
          })
        }, _vm._l((_vm.tagArray), function(item, i) {
          return _c('li', {
            class: {
              'cur': item.isCheck
            },
            on: {
              "click": function($event) {
                _vm.showBoard(i)
              }
            }
          }, [_vm._v(_vm._s(item.name))])
        })), _vm._v(" "), _c('ul', {
          staticClass: "info",
          class: {
            'off': !_vm.switchBtn
          }
        }, [_c('li', [_vm._v(_vm._s(_vm.infoBox.co2))]), _vm._v(" "), _c('li', [_vm._v(_vm._s(_vm.infoBox.tvoc))]), _vm._v(" "), _c('li', [_vm._v(_vm._s(_vm.infoBox.pm25))]), _vm._v(" "), _c('li', [(_vm.infoBox.t < 28) ? _c('span', [_vm._v(_vm._s(_vm.infoBox.t))]) : _vm._e(), _vm._v(" "), (_vm.infoBox.t > 27 && _vm.infoBox.t < 32) ? _c('span', {
          staticClass: "yellow"
        }, [_vm._v(_vm._s(_vm.infoBox.t))]) : _vm._e(), _vm._v(" "), (_vm.infoBox.t > 31) ? _c('span', {
          staticClass: "red"
        }, [_vm._v(_vm._s(_vm.infoBox.t))]) : _vm._e()]), _vm._v(" "), _c('li', [_vm._v(_vm._s(_vm.infoBox.h))]), _vm._v(" "), _c('li', [_vm._v(_vm._s(_vm.infoBox.pm))])]), _vm._v(" "), _c('div', {
          staticClass: "btn-box"
        }, [_c('span', {
          staticClass: "switch",
          on: {
            "click": _vm.btnSwitch
          }
        }), _vm._v(" "), _c('span', {
          staticClass: "up",
          on: {
            "click": _vm.btnUp
          }
        }), _vm._v(" "), _c('span', {
          staticClass: "down",
          on: {
            "click": _vm.btnDown
          }
        })]), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1)])])])
      },
      staticRenderFns: [function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c('div', {
          staticClass: "energy"
        }, [_vm._v("\n        实时耗电量\n        "), _c('div', {
          staticClass: "energy-charts",
          attrs: {
            "id": "energy",
            "data-highcharts-chart": "0"
          }
        })])
      }, function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c('div', {
          staticClass: "bottom"
        }, [_c('a', {
          staticClass: "btn btn-sm btn-default",
          attrs: {
            "href": "https://github.com/bimface/example-energy",
            "target": "_blank"
          }
        }, [_vm._v("示例代码")])])
      }]
    }
    if (false) {
      module.hot.accept()
      if (module.hot.data) {
        require("vue-hot-reload-api").rerender("data-v-0416c072", module.exports)
      }
    }

    /***/
  }

  /******/
});