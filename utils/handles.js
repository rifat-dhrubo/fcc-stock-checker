const asyncHandler = (promise) => {
	return promise.then((data) => [null, data]).catch((err) => Promise.resolve([err]));
};

module.exports = { asyncHandler };
