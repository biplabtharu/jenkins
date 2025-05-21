const mongoose = require("mongoose");

const bookModel = mongoose.Schema(
	{
		bookName: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		genre: {
			type: String,
		},
		status: {
			type: Boolean,
			default: true,
		},
		publisher: {
			type: String,
		},
		publicationDate: {
			type: String,
		},
		ISBN: {
			type: String,
		},
		bookImg: {
			type: String,
			default:
				"https://res.cloudinary.com/dc73d4fcl/image/upload/v1711357364/bookCover.jpg",
		},
	},
	{ timestamps: true }
);

const BOOK = mongoose.model("book", bookModel);

module.exports = BOOK;
