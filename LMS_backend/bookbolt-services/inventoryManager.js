const { MoleculerClientError } = require("moleculer").Errors;
const INVENTORY = require("../models/inventoryModel");

const getInventoryBook = async (_id) => {
	try {
		const data = await INVENTORY.findOne({ _id }).populate("bookId");

		if (!data) {
			throw new MoleculerClientError(`Book not found`, 404, "NOT_FOUND");
		}
		console.log(data);
		return data;
	} catch (err) {
		throw err;
	}
};

const getInventoryBooks = async () => {
	try {
		const data = await INVENTORY.find()
			.populate("bookId")
			.sort({ createdAt: -1 });
		if (data.length < 1) {
			throw new MoleculerClientError(`Books not found`, 404, "NOT_FOUND");
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const updateInventoryBook = async (_id, totalQuantity, availableQuantity) => {
	try {
		if (totalQuantity < 0 || availableQuantity < 0) {
			throw new MoleculerClientError(`Invalid value`, 422, "ERROR");
		}
		const data = await INVENTORY.findByIdAndUpdate(
			{ _id },
			{
				availableQuantity,
				totalQuantity,
			},

			{ new: true }
		);

		console.log(data);
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteInventoryBook = async (_id) => {
	try {
		const data = await INVENTORY.findByIdAndDelete({ _id });
		if (!data) {
			throw new MoleculerClientError(`Deleting book error`, 400, "ERROR");
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteInventoryBooks = async () => {
	try {
		const data = await INVENTORY.deleteMany();

		if (data.deletedCount >= 1 && data.acknowledged === true) {
			return {
				message: `All inventory books are deleted`,
			};
		}

		return { message: `Inventory books are empty` };
	} catch (err) {
		throw err;
	}
};
module.exports = {
	getInventoryBook,
	getInventoryBooks,
	updateInventoryBook,
	deleteInventoryBook,
	deleteInventoryBooks,
};
