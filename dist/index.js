"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _idbKeyval = require("idb-keyval");

var _idbKeyval2 = _interopRequireDefault(_idbKeyval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IDBCache = function () {
  function IDBCache() {
    _classCallCheck(this, IDBCache);
  }

  _createClass(IDBCache, [{
    key: "set",
    value: function set(key, val, time) {
      var _this = this;

      // Set default expiry as 100 days;
      if (!time) {
        time = 2400 * 60 * 60 * 1000;
      }

      // Set the key;
      Promise.all([_idbKeyval2.default.set(key, val), _idbKeyval2.default.set("__" + key + "ExpiryTimeStamp", Date.now() + time * 60 * 1000)]).then(function () {
        // Once the keys are set, remove any expired keys.
        _this.removeExpiredKeys();
      }).catch(function (e) {
        console.log("IDBCache: Setting keys failed", e);
      });
    }
  }, {
    key: "get",
    value: function get(key) {
      var _this2 = this;

      // Get the key;
      return new Promise(function (resolve) {
        var timeStampKey = "__" + key + "ExpiryTimeStamp";
        _idbKeyval2.default.get(timeStampKey).then(function (v) {
          if (v > Date.now()) {
            _idbKeyval2.default.get(key).then(function (val) {
              // value to return;
              resolve(val);
            }).catch(function (e) {
              // Fetching the key failed.
              // resolve with nothing.
              resolve();
            });
          } else {
            // Key has expired => delete it and return null;
            _this2.remove(key);
            resolve();
          }
        }).catch(function (e) {
          // Fetching the timestamp key failed;
          // resolve with nothing.
          resolve();
        });
      });
      // return idb.get(key)
    }
  }, {
    key: "remove",
    value: function remove(key) {
      // Delete a specific key and its timestamp key.
      if (this.isInternalExpiryTimestampKey(key)) {
        // if trying to delete the expiryTimeStamp key, delete the original key as well.
        _idbKeyval2.default.delete(key);
        _idbKeyval2.default.delete(key.substring(2, key.length - "ExpiryTimeStamp".length));
      } else {
        // if trying to delete the original key, delete the expiryTimeStamp key as well.
        _idbKeyval2.default.delete(key);
        _idbKeyval2.default.delete("__" + key + "ExpiryTimeStamp");
      }
    }
  }, {
    key: "flush",
    value: function flush() {
      _idbKeyval2.default.clear();
    }
  }, {
    key: "all",
    value: function all() {
      return _idbKeyval2.default.keys();
    }
  }, {
    key: "isInternalExpiryTimestampKey",
    value: function isInternalExpiryTimestampKey(key) {
      // timestamp keys have following format : '__<key>ExpiryTimeStamp'
      if (key.match(/__\w*ExpiryTimeStamp/g)) {
        return true;
      }
      return false;
    }
  }, {
    key: "getAllInternalTimestampKeys",
    value: function getAllInternalTimestampKeys() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.all().then(function (keys) {
          var internalKeys = keys.filter(function (thisKey) {
            return _this3.isInternalExpiryTimestampKey(thisKey) ? thisKey : null;
          });
          resolve(internalKeys);
        }).catch(function (e) {
          return Promise.reject();
        });
      });
    }
  }, {
    key: "removeExpiredKeys",
    value: function removeExpiredKeys() {
      var _this4 = this;

      this.getAllInternalTimestampKeys().then(function (keys) {
        keys.map(function (thisKey) {
          _this4.get(thisKey).then(function (val) {
            return Date.now() > val ? _this4.remove(thisKey) : null;
          });
        });
      });
    }
  }]);

  return IDBCache;
}();

exports.default = new IDBCache();