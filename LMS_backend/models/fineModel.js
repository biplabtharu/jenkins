const mongoose = require("mongoose");

const fineModel = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	bookId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "book",
	},
	fineAmount: {
		type: Number,
		default: 0,
	},
});

const FINE = mongoose.model("fine", fineModel);

module.exports = FINE;
