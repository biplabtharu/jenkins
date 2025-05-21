const mongoose = require("mongoose");

const inventoryModel = mongoose.Schema(
	{
		bookId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "book",
		},
		totalQuantity: {
			type: Number,
			required: true,
		},
		availableQuantity: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const INVENTORY = mongoose.model("inventory", inventoryModel);

module.exports = INVENTORY;
