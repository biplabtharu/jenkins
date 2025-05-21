const BORROW_APPROVAL = require("../models/borrowApprovalModel");
const { MoleculerClientError } = require("moleculer").Errors;
const BOOK = require("../models/bookModel");
const BORROW = require("../models/borrowModel");
const BORROW_COUNT = require("../models/borrowCountModel");
const INVENTORY = require("../models/inventoryModel");
const configPath = "./configure.json";
const fs = require("node:fs/promises");
const mongoose = require("mongoose");

const createBorrowReq = async (data) => {
	// return data;
	const { _id, book, user } = data;
	try {
		const data = new BORROW_APPROVAL({
			borrowId: _id,
			userId: user,
			bookId: book,
		});
		const savedData = await data.save();
		return savedData;
	} catch (err) {
		throw err;
	}
};

const getAllBorrowReqs = async () => {
	try {
		const data = await BORROW_APPROVAL.find()
			.populate(
				"userId",
				"-password -accessToken -refreshToken -role -userImg"
			)
			.populate("bookId")
			.sort({ createdAt: -1 });
		if (data.length < 1) {
			throw new MoleculerClientError(
				`Borrow requests data are empty`,
				400,
				"ERROR"
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const getConfig = async () => {
	try {
		const data = await fs.readFile(configPath, "utf-8");
		const parseData = JSON.parse(data);
		// return parseData.borrowDays;
		return parseData;
	} catch (err) {
		throw err;
	}
};

const getBorrowReq = async (datas) => {
	const { bookId, userId, status } = datas;

	let query = {};
	if (bookId !== undefined) {
		query.bookId = bookId;
	}
	if (userId !== undefined) {
		query.userId = userId;
	}
	if (status !== undefined) {
		query.status = status;
	}

	try {
		const data = await BORROW_APPROVAL.find(query).populate("bookId");
		// console.log(data);
		return data;
	} catch (err) {
		throw err;
	}
};

const getBorrowReqById = async (_id) => {
	try {
		const data = await BORROW_APPROVAL.findById({ _id });
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

const getBorrowReqByUserId = async (userId) => {
	try {
		const data = await BORROW_APPROVAL.find({ userId });
		if (data.length < 1) {
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

function addDays(date, days) {
	const newDate = new Date(date);
	newDate.setDate(date.getDate() + days);
	return newDate;
}

const updateBorrowReq = async (_id, status) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const data = await BORROW_APPROVAL.findByIdAndUpdate(
			{ _id },
			{ status },
			{ new: true }
		);
		// return data;
		let borrowData;
		if (data && status === "accepted") {
			const configData = await getConfig();
			const todayDate = new Date();

			const dueDate = addDays(todayDate, Number(configData.borrowDays));

			borrowData = new BORROW({
				_id: data.borrowId,
				book: data.bookId,
				user: data.userId,
				dueDate: dueDate,
			});

			await borrowData.save();

			const countData = await BORROW_COUNT.findOne({
				userId: data.userId,
			});
			if (!countData) {
				const saveCountData = new BORROW_COUNT({
					userId: data.userId,
					borrowCount: 1,
				});

				await saveCountData.save();
				return;
			}
			await BORROW_COUNT.findByIdAndUpdate(
				{ _id: countData._id },
				{
					borrowCount: Number(countData.borrowCount) + 1,
				}
			);

			// return data;
			const inventoryData = await INVENTORY.findOne({
				bookId: data.bookId,
			});

			let availableQuantity;
			if (Number(inventoryData.availableQuantity) - 1 >= 0) {
				availableQuantity = Number(inventoryData.availableQuantity) - 1;
			} else {
				availableQuantity = 0;
			}
			const updatedData = await INVENTORY.findByIdAndUpdate(
				{ _id: inventoryData._id },
				{
					availableQuantity,
				},
				{ new: true }
			);
			if (!updatedData) {
				throw new MoleculerClientError(
					"updating inventory error",
					400,
					"ERROR"
				);
			}
			console.log(updatedData);

			if (Number(updatedData.availableQuantity) < 1) {
				await BOOK.findByIdAndUpdate(
					{ _id: data.bookId },
					{ status: false }
				);
			}
			await session.commitTransaction();

			return { message: `Accepted` };
		} else if (data && data.status === "rejected") {
			await session.commitTransaction();
			return { message: `Rejected` };
		} else {
			throw new MoleculerClientError(
				"borrow req update error",
				400,
				"ERROR"
			);
		}
	} catch (err) {
		await session.abortTransaction();
		console.log(err);
		throw err;
	} finally {
		session.endSession();
	}
};

const deleteBorrowReq = async (_id) => {
	try {
		const data = await BORROW_APPROVAL.findByIdAndDelete({
			_id,
		});

		if (!data) {
			throw new MoleculerClientError(
				`Borrow requests data deleting error`,
				400,
				"ERROR"
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteAllBorroReqs = async () => {
	try {
		const data = await BORROW_APPROVAL.deleteMany();
		// return data;
	} catch (err) {
		throw err;
	}
};
module.exports = {
	createBorrowReq,
	updateBorrowReq,
	getAllBorrowReqs,
	getBorrowReq,
	getBorrowReqById,
	deleteBorrowReq,
	deleteAllBorroReqs,
	getBorrowReqByUserId,
	getConfig,
};
