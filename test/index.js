'use strict';

const test = require('tape');
const transformer = require('../lib/index');

const getFiles = () => {
	return {
		'file.html': {
			contents: new Buffer('file one')
		},
		'file.md': {
			contents: new Buffer('file two')
		},
		'file.css': {
			contents: new Buffer('file three')
		}
	}
};

test('no configuration', (assert) => {
	const filesOriginal = getFiles();
	const filesModified = getFiles();
	
	let doneCalled = false;
	let err = undefined;
	const done = (e) => {
		err = e;
		doneCalled = true;
	}

	transformer()(filesModified, undefined, done);

	Object.keys(filesOriginal).forEach((key) => {
		assert.equal(filesModified.hasOwnProperty(key), true, 'paths are not modified');
		assert.equal(filesModified[key].contents.toString(),
			filesOriginal[key].contents.toString(),
			'defaults to identity function and default encoding');
	});

	assert.equal(doneCalled, true, 'done() was called');
	assert.equal(err, undefined, 'done was not given an error')
	assert.end();
});

test('transformer is not a function', (assert) => {
	const config = {
		transformer: 1
	};
	
	const files = getFiles();

	let err = undefined;
	const done = (e) => {
		err = e;
	};

	transformer(config)(files, undefined, done);
	assert.notEqual(err, undefined, 'done was called with an error');
	assert.end();
});

test('unsupported decoding', (assert) => {
	const config = {
		decoding: 'invalid'
	};

	const files = getFiles();

	let err = undefined;
	const done = (e) => {
		err = e;
	};

	transformer(config)(files, undefined, done);
	assert.notEqual(err, undefined, 'done was called with an error');
	assert.end();
});

test('unsupported encoding', (assert) => {
	const config = {
		encoding: 'invalid'
	};

	const files = getFiles();

	let err = undefined;
	const done = (e) => {
		err = e;
	};

	transformer(config)(files, undefined, done);
	assert.notEqual(err, undefined, 'done was called with an error');
	assert.end();
});

test('given a transformer function', (assert) => {
	const filesOriginal = getFiles();
	const filesModified = getFiles();

	const f = (str) => `${str}!`;
	
	const config = {
		transformer: f
	};

	let doneCalled = false;
	let err = undefined;
	const done = (e) => {
		err = e;
		doneCalled = true;
	};

	transformer(config)(filesModified, undefined, done);

	Object.keys(filesOriginal).forEach((key) => {
		assert.equal(filesModified.hasOwnProperty(key), true, 'paths are not modified');
		assert.equal(filesModified[key].contents.toString(),
			f(filesOriginal[key].contents.toString()),
			'transformer is called on all files');
	});

	assert.equal(doneCalled, true, 'done() was called');
	assert.equal(err, undefined, 'done was not given an error')
	assert.end();
});

test('given a decoding', (assert) => {
	const filename = 'file.html';
	const getFile = () => {
		const file = { };
			file[filename] = {
				contents: new Buffer('file one')
		};
		return file;
	};

	const fileOriginal = getFile();
	const fileModified = getFile();
	
	const decoding = 'base64';
	
	let decodedStr = undefined;
	const t = (str) => {
		decodedStr = str;
		return str;
	}

	const config = {
		transformer: t,
		decoding: decoding
	};

	let doneCalled = false;
	let err = undefined;
	const done = (e) => {
		err = e;
		doneCalled = true;
	};

	transformer(config)(fileModified, undefined, done);

	assert.equal(decodedStr, fileOriginal[filename].contents.toString(decoding),
		'transformer received a string using the decoding');
	assert.equal(doneCalled, true, 'done() was called');
	assert.equal(err, undefined, 'done was not given an error')
	assert.end();
});

test('given an encoding', (assert) => {
	const filename = 'file.html';
	const getFile = () => {
		const file = { };
			file[filename] = {
				contents: new Buffer('file one')
		};
		return file;
	};

	const fileOriginal = getFile();
	const fileModified = getFile();
	
	const encoding = 'ucs2';

	const config = {
		encoding: encoding
	};

	let doneCalled = false;
	let err = undefined;
	const done = (e) => {
		err = e;
		doneCalled = true;
	};

	transformer(config)(fileModified, undefined, done);

	assert.equal(fileModified[filename].contents.toString(encoding),
		fileOriginal[filename].contents.toString(),
		'updated file was encoded using the encoding');
	assert.equal(doneCalled, true, 'done() was called');
	assert.equal(err, undefined, 'done was not given an error')
	assert.end();
});