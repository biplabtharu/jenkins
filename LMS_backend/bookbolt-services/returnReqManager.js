const RETURN_APPROVAL = require("../models/returnApprovalModel");
const { MoleculerClientError } = require("moleculer").Errors;
const INVENTORY = require("../models/inventoryModel");
const BOOK = require("../models/bookModel");
const BORROW = require("../models/borrowModel");
const config = require("../configure.json");
const FINE = require("../models/fineModel");
const RETURN = require("../models/returnModel");
const BORROW_COUNT = require("../models/borrowCountModel");

const createReturnReq = async (data) => {
	const { _id, book, user } = data;
	try {
		const data = new RETURN_APPROVAL({
			returnId: _id,
			userId: user,
			bookId: book,
		});
		const savedData = await data.save();
		return savedData;
	} catch (err) {
		throw err;
	}
};

const getAllReturnReqs = async () => {
	try {
		const data = await RETURN_APPROVAL.find()
			.populate(
				"userId",
				"-password -accessToken -refreshToken -role -userImg"
			)
			.populate("bookId")
			.sort({ createdAt: -1 });
		if (data.length < 1) {
			throw new MoleculerClientError(
				`Return requests data are empty`,
				400,
				"ERROR"
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const getReturnReq = async (_id) => {
	try {
		const data = await RETURN_APPROVAL.findById({ _id });
		if (!data) {
			throw new MoleculerClientError(
				`Return requests data not found`,
				404,
				"NOT_FOUND"
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const getReturnReqByUserId = async (userId) => {
	try {
		const data = await RETURN_APPROVAL.findOne({ userId });
		if (!data) {
			throw new MoleculerClientError(
				`Borrow requests data not found`,
				404,
				"NOT_FOUND"
			);
		}

		return data;
	} catch (err) {
		throw err;
	}
};

const updateReturnReq = async (_id, status) => {
	try {
		const data = await RETURN_APPROVAL.findByIdAndUpdate(
			{ _id },
			{ status },
			{ new: true }
		);

		let borrowData;
		if (data && status === "accepted") {
			const returnData = new RETURN({
				_id: data.borrowId,
				book: data.bookId,
				user: data.userId,
				// _id: data.
			});

			const savedData = await returnData.save();
			// return data;
			const countData = await BORROW_COUNT.findOne({
				userId: data.userId,
			});

			if (!countData) {
				throw new MoleculerClientError(
					`Borrow Count data not found`,
					404,
					"ERR_NOT_FOUND"
				);
			}
			await BORROW_COUNT.findByIdAndUpdate(
				{ _id: countData._id },
				{
					borrowCount: Number(countData.borrowCount) - 1,
				}
			);

			borrowData = await BORROW.findOne({
				book: data.bookId,
				user: data.userId,
				status: true,
			});
			const inventoryData = await INVENTORY.findOne({
				bookId: data.bookId,
			});

			const updatedInventory = await INVENTORY.findByIdAndUpdate(
				{ _id: inventoryData._id },
				{
					availableQuantity:
						Number(inventoryData.availableQuantity) + 1,
				},
				{ new: true }
			);

			if (Number(updatedInventory.availableQuantity) >= 1) {
				const findBook = await BOOK.findOne({
					_id: data.bookId,
				});
				await BOOK.findByIdAndUpdate(
					{ _id: findBook._id },
					{ status: true }
				);
			}

			const diffTime = Math.abs(savedData.createdAt - borrowData.date);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			let fineMoney;
			if (diffDays > Number(config.borrowDays)) {
				fineMoney =
					(diffDays - Number(config.borrowDays)) *
					Number(config.finePerDay);
				// RETURN.fineMoney = fineMoney;

				const fineObj = await FINE.findOne({
					user: data.userId,
					book: data.bookId,
				});

				if (!fineObj) {
					const fine = new FINE({
						book: data.bookId,
						user: data.userId,
						fineMoney: fineMoney,
					});

					await fine.save();
				} else {
					await FINE.findByIdAndUpdate(
						{ _id: fineObj._id },
						{ fineMoney: fineMoney }
					);
				}
			}

			await BORROW.findByIdAndUpdate(
				{ _id: borrowData._id },
				{ status: false, returnOrder: "accepted" }
			);

			return savedData;
		} else if (data && status === "rejected") {
			borrowData = await BORROW.findOne({
				book: data.bookId,
				user: data.userId,
				status: true,
			});
			await BORROW.findByIdAndUpdate(
				{ _id: borrowData._id },
				{ returnOrder: "rejected" }
			);
			return data;
		}
	} catch (err) {
		throw err;
	}
};

const deleteReturnReq = async (_id) => {
	try {
		const data = await RETURN_APPROVAL.findByIdAndDelete({
			_id,
		});

		if (!data) {
			throw new MoleculerClientError(
				`Return requests data deleting error`,
				400,
				"ERROR"
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteAllReturnReqs = async () => {
	try {
		const data = await RETURN_APPROVAL.deleteMany();

		return data;
	} catch (err) {
		throw err;
	}
};
module.exports = {
	createReturnReq,
	updateReturnReq,
	getAllReturnReqs,
	getReturnReq,
	deleteReturnReq,
	deleteAllReturnReqs,
	getReturnReqByUserId,
};
