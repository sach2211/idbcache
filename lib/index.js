import idb from 'idb-keyval';

class idb {

  set(key, val, time) {
    // Make arrangements to expire it;
    if (time) {
      const currentTimeStamp = Date.now();
      let expiryTime;
      expiryTime = time * 60 * 1000;
      expiryTime += currentTimeStamp;
      setTimeout(() => {
        idb.delete(key);
      }, expiryTime);
    }

    // Set the key;
    return idb.set(key, val);
  }

  get(key) {
    // Get the key;
    return idb.get(key)
  }

  remove(key) {
    // Delete a specific key
    idb.delete(key);
  }

  flush() {
    idb.clear();
  }

  all() {
    return idb.keys();
  }
}

export default new idb();