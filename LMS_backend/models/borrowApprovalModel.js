const mongoose = require("mongoose");

const borrowApprovalModel = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		borrowId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "borrow",
			required: true,
		},
		bookId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "book",
			required: true,
		},
		status: {
			type: "String",
			enum: ["pending", "accepted", "rejected"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

const BORROW_APPROVAL = mongoose.model("borrow_approval", borrowApprovalModel);
module.exports = BORROW_APPROVAL;
