!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.idbcache=t():e.idbcache=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1)),u=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return r(e,[{key:"set",value:function(e,t,n){var r=this;n||(n=864e7),Promise.all([o.default.set(e,t),o.default.set("__"+e+"ExpiryTimeStamp",Date.now()+60*n*1e3)]).then(function(){r.removeExpiredKeys()}).catch(function(e){console.log("IDBCache: Setting keys failed",e)})}},{key:"get",value:function(e){var t=this;return new Promise(function(n){if(t.isInternalExpiryTimestampKey(e))o.default.get(e).then(function(e){n(e)});else{var r="__"+e+"ExpiryTimeStamp";o.default.get(r).then(function(r){r>Date.now()?o.default.get(e).then(function(e){n(e)}).catch(function(e){n()}):(t.remove(e),n())}).catch(function(e){n()})}})}},{key:"remove",value:function(e){this.isInternalExpiryTimestampKey(e)?(o.default.delete(e),o.default.delete(e.substring(2,e.length-"ExpiryTimeStamp".length))):(o.default.delete(e),o.default.delete("__"+e+"ExpiryTimeStamp"))}},{key:"flush",value:function(){o.default.clear()}},{key:"all",value:function(){return o.default.keys()}},{key:"isInternalExpiryTimestampKey",value:function(e){return!!e.match(/__\w*ExpiryTimeStamp/g)}},{key:"getAllInternalTimestampKeys",value:function(){var e=this;return new Promise(function(t,n){e.all().then(function(n){var r=n.filter(function(t){return e.isInternalExpiryTimestampKey(t)?t:null});t(r)}).catch(function(e){return Promise.reject()})})}},{key:"removeExpiredKeys",value:function(){var e=this;this.getAllInternalTimestampKeys().then(function(t){t.map(function(t){e.get(t).then(function(n){return Date.now()>n?e.remove(t):null})})})}}]),e}();t.default=new u},function(e,t,n){var r,o;!function(){"use strict";function n(e,t){return(u||(u=new Promise(function(e,t){var n=indexedDB.open("keyval-store",1);n.onerror=function(){t(n.error)},n.onupgradeneeded=function(){n.result.createObjectStore("keyval")},n.onsuccess=function(){e(n.result)}})),u).then(function(n){return new Promise(function(r,o){var u=n.transaction("keyval",e);u.oncomplete=function(){r()},u.onerror=function(){o(u.error)},t(u.objectStore("keyval"))})})}var u,i={get:function(e){var t;return n("readonly",function(n){t=n.get(e)}).then(function(){return t.result})},set:function(e,t){return n("readwrite",function(n){n.put(t,e)})},delete:function(e){return n("readwrite",function(t){t.delete(e)})},clear:function(){return n("readwrite",function(e){e.clear()})},keys:function(){var e=[];return n("readonly",function(t){(t.openKeyCursor||t.openCursor).call(t).onsuccess=function(){this.result&&(e.push(this.result.key),this.result.continue())}}).then(function(){return e})}};void 0!==e&&e.exports?e.exports=i:void 0===(o=function(){return i}.apply(t,r=[]))||(e.exports=o)}()}])});