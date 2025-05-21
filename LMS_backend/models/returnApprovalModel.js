const mongoose = require("mongoose");

const returnApprovalModel = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		returnId: {
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

const RETURN_APPROVAL = mongoose.model("return_approval", returnApprovalModel);
module.exports = RETURN_APPROVAL;
