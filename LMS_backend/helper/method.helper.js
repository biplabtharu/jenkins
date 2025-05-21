const { MoleculerClientError } = require("moleculer").Errors;
const mongoose = require("mongoose");

const isValidId = (id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new MoleculerClientError(`Invalid id`, 404, "NOT_FOUND");
	}
};

module.exports = { isValidId };
