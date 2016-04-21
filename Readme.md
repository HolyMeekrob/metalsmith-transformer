# metalsmith-transformer ![Build status](https://travis-ci.org/HolyMeekrob/metalsmith-transformer.svg?branch=master)

A Metalsmith plugin to modify files with a given string manipulation
function. This library is essentially a convenience for building your own
plugin if all that plugin needs to do is modify files based solely on their
own contents.

This plugin is agnostic about the specific types of files it is performing
operations on. Often you will want to use this plugin in conjunction with
other plugins that filter the files you want to transform.

## Installation
``` bash
npm install --save-dev metalsmith-transformer
```

## Usage
```js
var Metalsmith = require('metalsmith');
var transformer = require('metalsmith-transformer');

Metalsmith
	.use(transformer(options))
```

## Options
All options are optional (duh!).

**transformer** - a function with type String -> String. In other words, a function that accepts a String and returns a String. This will be called on the contents of every file passed into the plugin.  
*defaults to the identity function*

**decoding** - the encoding to use to decode the data from the file buffer before passing it into the transformer. If you set this value to anything but the default, and you do not set the encoding, then you will change the file's encoding.  
*defaults to utf8*

**encoding** - the encoding to use to encode the transformed string into the file buffer. If you set this value to anything but the default, and you do not set the decoding, then you will change the file's encoding.  
*defaults to utf8*

Please see [Node's documentation](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) for a list of supported character encodings.

## Examples
``` js
// Change every instance of the word wow to all uppercase
var options = {
	transformer: function (str) {
		return str.replace(/\swow\s/ig, 'WOW');
	}
}

// Change the encoding of the file from utf8 to ascii
var options = {
	decoding: 'utf8',
	encoding: 'ascii'
}
```

## Migrating from 1.x
Version 2.0 breaks backward compatibility (sorry!) in order to be consistent with the metalsmith plugin paradigm of accepting a single configuration object. The good news is that migrating is super simple. Simply take your transformer function, stick it in an object, and assign it to the object's `transformer` property. Here's an example:

``` js
function t (str) {
	// Return transformed string
}

// 1.x
Metalsmith
	.use(transformer(t));

// 2.0
Metalsmith
	.use(transformer({ transformer: t }));
```

And that's all there is to it!