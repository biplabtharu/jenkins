const FINE = require("../models/fineModel");
const { MoleculerClientError } = require("moleculer").Errors;

const getFine = async () => {
	try {
		const data = await FINE.findOne({
			_id: id,
		});

		if (!data) {
			throw new MoleculerClientError(
				`User fine not found`,
				404,
				`NOT_FOUND`
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const getAllFines = async () => {
	try {
		const data = await FINE.find();

		if (data.length < 1) {
			throw new MoleculerClientError(
				`All user fines not found`,
				404,
				`NOT_FOUND`
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const updateFine = async (_id, userId, bookId, fineAmount) => {
	try {
		const data = await FINE.findByIdAndUpdate(
			{
				_id,
			},
			{
				userId,
				bookId,
				fineAmount,
			},
			{ new: true }
		);

		if (!data) {
			throw new MoleculerClientError(
				`Updating user fine error`,
				400,
				`ERROR`
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteFine = async (_id) => {
	try {
		const data = await FINE.findByIdAndDelete({
			_id,
		});

		if (!data) {
			throw new MoleculerClientError(
				`Deleting user fine error`,
				400,
				`ERROR`
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteAllFines = async () => {
	try {
		const data = await FINE.deleteMany();
		if (data.deletedCount >= 1 && data.acknowledged === true) {
			return {
				message: `All user fines are deleted successfully`,
			};
		}

		throw new MoleculerClientError(
			`Deleting all user fine error`,
			400,
			`ERROR`
		);
	} catch (err) {
		throw err;
	}
};
module.exports = {
	getFine,
	getAllFines,
	updateFine,
	deleteFine,
	deleteAllFines,
};
