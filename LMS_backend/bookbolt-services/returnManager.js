const RETURN = require("../models/returnModel");
const { MoleculerClientError } = require("moleculer").Errors;

const getReturnedBooks = async () => {
	try {
		const data = await RETURN.find()
			.sort({ createdAt: -1 })
			.populate("book")
			.populate(
				"user",
				"-password -accessToken -refreshToken -userImg -role"
			);
		// if (data.length < 1) {
		// 	throw new MoleculerClientError(
		// 		`Returned books not found`,
		// 		404,
		// 		"NOT_FOUND"
		// 	);
		// }
		return data;
	} catch (err) {
		throw err;
	}
};

const getReturnedBooksByUser = async (user) => {
	try {
		const data = await RETURN.find({ user })
			.populate("book")
			.sort({ createdAt: -1 });

		// if (data.length < 1) {
		// 	throw new MoleculerClientError(
		// 		`Returned books not found`,
		// 		404,
		// 		"NOT_FOUND"
		// 	);
		// }
		return data;
	} catch (err) {
		throw err;
	}
};

const getReturnedBook = async (_id) => {
	try {
		const data = await RETURN.findById({
			_id,
		});

		if (!data) {
			throw new MoleculerClientError(
				`Returned book not found`,
				404,
				"NOT_FOUND"
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteReturnedBook = async (_id) => {
	try {
		const data = await RETURN.findByIdAndDelete({
			_id,
		});
		if (!data) {
			throw new MoleculerClientError(
				`Returned book not found`,
				404,
				`NOT_FOUND`
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteReturnedBooks = async () => {
	try {
		const data = await RETURN.deleteMany();

		if (data.deletedCount >= 1 && data.acknowledged === true) {
			return {
				message: `All Returned books are deleted`,
			};
		}

		return { message: `Returned books are empty` };
	} catch (err) {
		throw err;
	}
};

const updateReturnedBook = async (_id, updateData) => {
	const { user, book, status } = updateData;
	try {
		const data = await RETURN.findByIdAndUpdate(
			{
				_id,
			},
			{ user, book, status },
			{ new: true }
		);
		return data;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	getReturnedBooks,
	getReturnedBook,
	deleteReturnedBook,
	deleteReturnedBooks,
	updateReturnedBook,
	getReturnedBooksByUser,
};
