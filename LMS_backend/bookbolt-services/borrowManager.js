const { methodHelper } = require("../helper");
const BORROW = require("../models/borrowModel");
const { MoleculerClientError } = require("moleculer").Errors;

const getBorrowedBooks = async (datas) => {
	try {
		if (!datas) {
			const data = await BORROW.find()
				.populate("book")
				.populate(
					"user",
					"-password -accessToken -refreshToken -role -userImg"
				)
				.sort({ createdAt: -1 });
			console.log("no data");
			return data;
		}

		if (datas) {
			const { book, user, status } = datas;

			let query = {};

			if (book !== undefined) {
				query.book = book;
			}
			if (user !== undefined) {
				query.user = user;
			}
			if (status !== undefined) {
				query.status = status;
			}

			const data = await BORROW.find(query)
				.populate("book")
				.populate(
					"user",
					"-password -accessToken -refreshToken -role -userImg"
				)
				.sort({ createdAt: -1 });

			return data;
		}
	} catch (err) {
		throw err;
	}
};

// const getBorrowedBooksByUser = async (user) => {
// 	try {
// 		const data = await BORROW.find({ user });

// 		if (data.length < 1) {
// 			throw new MoleculerClientError(
// 				`Borrowed books not found`,
// 				404,
// 				"NOT_FOUND"
// 			);
// 		}
// 		return data;
// 	} catch (err) {
// 		throw err;
// 	}
// };

const getBorrowedBook = async (_id) => {
	try {
		const data = await BORROW.findById({
			_id,
		});

		if (!data) {
			throw new MoleculerClientError(
				`Borrowed book not found`,
				404,
				"NOT_FOUND"
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteBorrowedBook = async (_id) => {
	try {
		const data = await BORROW.findByIdAndDelete({
			_id,
		});
		if (!data) {
			throw new MoleculerClientError(
				`Borrowed book not found`,
				404,
				`NOT_FOUND`
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteBorrowedBooks = async () => {
	try {
		const data = await BORROW.deleteMany();

		if (data.deletedCount >= 1 && data.acknowledged === true) {
			return {
				message: `All borrowed books are deleted`,
			};
		}

		return { message: `Borrowed books are empty` };
	} catch (err) {
		throw err;
	}
};

const updateBorrowedBook = async (_id, updateData) => {
	const { status, returnOrder } = updateData;
	try {
		methodHelper.isValidId(_id);
		const data = await BORROW.findByIdAndUpdate(
			{
				_id,
			},
			{ status, returnOrder },
			{ new: true }
		);
		return data;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	getBorrowedBooks,
	getBorrowedBook,
	deleteBorrowedBook,
	deleteBorrowedBooks,
	updateBorrowedBook,
	// getBorrowedBooksByUser,
};
