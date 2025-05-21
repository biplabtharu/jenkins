const mongoose = require("mongoose");

const returnModel = new mongoose.Schema(
	{
		book: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "book",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		status: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const RETURN = mongoose.model("return", returnModel);

module.exports = RETURN;
