'use strict';
const isFunction = (val) => val instanceof Function;

const getPlugin = (transformer) => {
	return (files, ms, done) => {
		try {
			if (!isFunction(transformer)) {
				throw new Error('transformer is required')
			}

			Object.keys(files)
				.forEach((file) => {
					files[file].contents =
						new Buffer(transformer(files[file].contents.toString()));
				});
			done();
		}
		catch (e) {
			done(e);
		}
	};
};

module.exports = getPlugin;
