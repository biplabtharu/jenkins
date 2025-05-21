const BOOK = require("../models/bookModel");
const { MoleculerClientError } = require("moleculer").Errors;

const getBooks = async (query) => {
	try {
		// console.log(query);
		if (!query) {
			const data = await BOOK.find().sort({ createdAt: -1 });
			return data;
		}
		const searchData = await BOOK.find({ bookName: query });
		return searchData;
	} catch (err) {
		throw err;
	}
};

const getSpecBooks = async (bookName, author) => {
	try {
		const data = await BOOK.find({ bookName, author });
		return data;
	} catch (err) {
		throw err;
	}
};

const createBook = async (addData) => {
	const {
		bookName,
		author,
		genre,
		publisher,
		publicationDate,
		ISBN,
		bookImg,
	} = addData;
	try {
		if (
			!bookName ||
			!author ||
			!genre ||
			!publisher ||
			!publicationDate ||
			!ISBN
		) {
			throw new MoleculerClientError(
				`fill all the required fields`,
				422,
				`ERROR`
			);
		}

		const newBook = new BOOK({
			bookName,
			author,
			genre,
			publisher,
			publicationDate,
			ISBN,
			bookImg,
		});
		const data = await newBook.save();
		return data;
	} catch (err) {
		throw err;
	}
};

const getBookById = async (_id) => {
	try {
		const data = await BOOK.findById({ _id }).select("-__v");
		if (!data) {
			throw new MoleculerClientError(`Book not found`, 404, "NOT_FOUND");
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const updateBook = async (_id, updateData) => {
	const {
		bookName,
		author,
		genre,
		publisher,
		publicationDate,
		ISBN,
		status,
		bookImg,
	} = updateData;

	try {
		const data = await BOOK.findByIdAndUpdate(
			{ _id },
			{
				bookName,
				author,
				genre,
				publisher,
				publicationDate,
				ISBN,
				status,
				bookImg,
			},
			{ new: true }
		);

		if (!data) {
			throw new MoleculerClientError(
				`Updating book error.`,
				400,
				"ERROR"
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteBook = async (_id) => {
	try {
		const data = await BOOK.findByIdAndDelete({ _id });
		if (!data) {
			throw new MoleculerClientError(`Deleting book error`, 400, "ERROR");
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteBooks = async () => {
	try {
		const data = await BOOK.deleteMany();
		return {
			message: `All books are deleted`,
		};
	} catch (err) {
		throw err;
	}
};
module.exports = {
	getBooks,
	getBookById,
	updateBook,
	deleteBook,
	deleteBooks,
	getSpecBooks,
	createBook,
};
