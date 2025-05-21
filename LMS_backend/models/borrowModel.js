const mongoose = require("mongoose");

const borrowModel = new mongoose.Schema(
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
		returnOrder: {
			type: String,
			enum: ["placed", "not_placed", "accepted", "rejected"],
			default: "not_placed",
		},
		dueDate: {
			type: Date,
		},
	},
	{ timestamps: true }
);

const BORROW = mongoose.model("borrow", borrowModel);

module.exports = BORROW;
