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

test('no transformer function', (assert) => {
	assert.throws(() => transformer()(), 'throws an error');
	assert.end();
});

test('null transformer function', (assert) => {
	assert.throws(() => transformer()(null), 'throws an error');
	assert.end();
});

test('transformer is not a function', (assert) => {
	assert.throws(() => transformer()(1), 'throws an error');
	assert.end();
});

test('given a transformer function', (assert) => {
	const filesOriginal = getFiles();
	const filesModified = getFiles();

	const f = (str) => `${str}!`;

	let doneCalled = false;
	const done = () => {
		doneCalled = true;
	};

	transformer(f)(filesModified, undefined, done)

	Object.keys(filesOriginal).forEach((key) => {
		assert.equal(filesModified.hasOwnProperty(key), true, 'paths are not modified');
		assert.equal(filesModified[key].contents.toString(),
			f(filesOriginal[key].contents.toString()),
			'transformer is called on all files');
	});

	assert.equal(doneCalled, true, 'done() was called');
	assert.end();
});
