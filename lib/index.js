import idb from 'idb-keyval';

class IDBCache {

  set(key, val, time) {
    // Set default expiry as 100 days;
    if (!time) {
      time = 2400 * 60 * 60 * 1000;
    }

    // Set the key;
    Promise.all([
        idb.set(key, val),
        idb.set(`__${key}ExpiryTimeStamp`, Date.now() + (time * 60 * 1000))
      ]).then(() => {
        // Once the keys are set, remove any expired keys.
        this.removeExpiredKeys();
      })
      .catch((e) => {
        console.log("IDBCache: Setting keys failed", e);
      })
  }

  get(key) {
    // Get the key;
    return new Promise( resolve => {
      let timeStampKey = `__${key}ExpiryTimeStamp`;
      idb.get(timeStampKey)
        .then(v => {
          if (v > Date.now()) {
            idb.get(key)
              .then(val => {
                // value to return;
                resolve(val);
              })
              .catch(e => {
                // Fetching the key failed.
                // resolve with nothing.
                resolve();
              })
          } else {
            // Key has expired => delete it and return null;
            this.remove(key);
            resolve();
          }
        })
        .catch(e => {
          // Fetching the timestamp key failed;
          // resolve with nothing.
          resolve();
        })
    })
  }

  remove(key) {
    // Delete a specific key and its timestamp key.
    if (this.isInternalExpiryTimestampKey(key)) {
      // if trying to delete the expiryTimeStamp key, delete the original key as well.
      idb.delete(key);
      idb.delete(key.substring(2, key.length - "ExpiryTimeStamp".length));
    } else {
      // if trying to delete the original key, delete the expiryTimeStamp key as well.
      idb.delete(key);
      idb.delete(`__${key}ExpiryTimeStamp`);
    }
  }

  flush() {
    idb.clear();
  }

  all() {
    return idb.keys();
  }

  isInternalExpiryTimestampKey(key) {
    // timestamp keys have following format : '__<key>ExpiryTimeStamp'
    if (key.match(/__\w*ExpiryTimeStamp/g)) {
      return true;
    }
    return false;
  }

  getAllInternalTimestampKeys() {
    return new Promise((resolve, reject) => {
      this.all()
        .then(keys => {
          let internalKeys = keys.filter(thisKey => this.isInternalExpiryTimestampKey(thisKey) ? thisKey : null)
          resolve(internalKeys);
        })
        .catch(e => Promise.reject())
    })
  }

  removeExpiredKeys() {
    this.getAllInternalTimestampKeys()
      .then(keys => {
        keys.map(thisKey => {
          this.get(thisKey)
            .then(val =>
              Date.now() > val ? this.remove(thisKey) : null
            )
        })
      })
  }
}

export default new IDBCache();
