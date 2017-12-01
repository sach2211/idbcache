# idbcache

This is a module which tries to mimic lscache api, but with indexedDB storage.

## Usage

1.)  Install the package
<code>npm install idbcache</code>

2.) import it in your file.

<code>import idb from 'idbcache'</code> 
OR,

<code>var idb = require('idbcache')</code>

## Available API's are - 

### 1.) &nbsp; set(key, val, time)

Set a value with name 'key' and value 'val' for 'time' minutes.

#### eg.
<code>idbcache.set('hello', 'world', 2);</code>

This will set the key 'hello' with value 'world' for 2mins.

#### Returns:
A promise

### 2.) &nbsp; get(key)

Can be used to retrieve a value store against a particular key.

#### eg. 
<code>
idbcache.get('hello').then(val => console.log(val));

// logs: "world" 
</code>

#### Returns:
A promise.

### 3.) &nbsp; remove(key)

Can be used to delete a particular key.

#### eg. 
<code>
idbcache.remove('hello');

// deletes: Key titled hello from DB.
</code>


### 5.) &nbsp; flush()

Can be used to flush the entire key-value store.

#### eg. 
<code>
idbcache.flush();
</code>
