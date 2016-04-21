'use strict';

const defaultTransformer = (str) => str;
const defaultDecoding = 'utf8';
const defaultEncoding = 'utf8';

const isFunction = (val) => val instanceof Function;

const defaultTo = (defaultVal, val) => val === undefined ? defaultVal : val;

const getPlugin = (options) => {
	const definedOptions = options || {};
	const transformer = defaultTo(defaultTransformer, definedOptions.transformer);
	const decoding = defaultTo(defaultDecoding, definedOptions.decoding);
	const encoding = defaultTo(defaultEncoding, definedOptions.encoding);

	return (files, ms, done) => {
		try {
			if (!isFunction(transformer)) {
				throw new Error('transformer must be a function')
			}

			Object.keys(files).forEach((file) => {
				files[file].contents = new Buffer(
					transformer(files[file].contents.toString(decoding)),
					encoding);
			});
			done();
		}
		catch (e) {
			done(e);
		}
	};
};

module.exports = getPlugin;
