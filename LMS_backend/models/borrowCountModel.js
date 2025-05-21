const mongoose = require("mongoose");

const borrowCountModel = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		borrowCount: {
			type: Number,
			min: 0,
			default: 0,
		},
	},
	{ timestamps: true }
);

const BORROW_COUNT = mongoose.model("borrow_count", borrowCountModel);

module.exports = BORROW_COUNT;
