'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _idbKeyval = require('idb-keyval');

var _idbKeyval2 = _interopRequireDefault(_idbKeyval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IDBCache = function () {
  function IDBCache() {
    _classCallCheck(this, IDBCache);
  }

  _createClass(IDBCache, [{
    key: 'set',
    value: function set(key, val, time) {
      // Make arrangements to expire it;
      if (time) {
        var currentTimeStamp = Date.now();
        var expiryTime = void 0;
        expiryTime = time * 60 * 1000;
        setTimeout(function () {
          _idbKeyval2.default.delete(key);
        }, expiryTime);
      }

      // Set the key;
      return _idbKeyval2.default.set(key, val);
    }
  }, {
    key: 'get',
    value: function get(key) {
      // Get the key;
      return _idbKeyval2.default.get(key);
    }
  }, {
    key: 'remove',
    value: function remove(key) {
      // Delete a specific key
      _idbKeyval2.default.delete(key);
    }
  }, {
    key: 'flush',
    value: function flush() {
      _idbKeyval2.default.clear();
    }
  }, {
    key: 'all',
    value: function all() {
      return _idbKeyval2.default.keys();
    }
  }]);

  return IDBCache;
}();

exports.default = new IDBCache();