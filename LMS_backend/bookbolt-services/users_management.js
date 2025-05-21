const USER = require("../models/userModel");
const { hashPassword } = require("../helper");
const { MoleculerClientError } = require("moleculer").Errors;
const mongoose = require("mongoose");

const getUser = async (email) => {
	try {
		const data = await USER.findOne({ email });
		if (!data || data.role === "admin") {
			throw new MoleculerClientError(
				`invalid credentials`,
				401,
				"UNAUTHORIZED"
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const getAdmin = async (email) => {
	try {
		const data = await USER.findOne({ email });
		if (!data) {
			throw new MoleculerClientError(
				`invalid credentials`,
				401,
				"UNAUTHORIZED"
			);
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const getUserById = async (_id) => {
	try {
		const data = await USER.findById({ _id }).select("-password -__v");

		if (!data) {
			throw new MoleculerClientError(`user not found`, 404, "NOT_FOUND");
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const getUsers = async () => {
	try {
		const data = await USER.find({
			role: { $ne: "admin" },
		})
			.select("-password -role -refreshToken -accessToken -__v")
			.sort({ createdAt: -1 });
		return data;
	} catch (err) {
		throw err;
	}
};

const createUser = async (firstName, lastName, email, password, userImg) => {
	if (!firstName || !lastName || !email || !password) {
		throw new MoleculerClientError(
			`fill all the required fields`,
			422,
			"ERROR"
		);
	}

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const userExists = await USER.findOne({ email });

		if (userExists) {
			throw new MoleculerClientError("Email is exist", 422, "ERROR");
		}

		const hashedPassword = await hashPassword.hashPass(password);

		const createUser = new USER({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			userImg,
		});

		const accessToken = await createUser.generateAccessToken();

		const refreshToken = await createUser.generateRefreshToken();

		await createUser.save();
		await session.commitTransaction();
		return { accessToken, refreshToken };
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
};

const updateUser = async (_id, updateData) => {
	const {
		accessToken,
		refreshToken,
		firstName,
		lastName,
		email,
		password,
		role,
		userImg,
	} = updateData;

	try {
		const data = await USER.findByIdAndUpdate(
			{ _id },
			{
				accessToken,
				refreshToken,
				firstName,
				lastName,
				email,
				password,
				role,
				userImg,
			},
			{ new: true }
		);
		if (!data) {
			throw new MoleculerClientError(`updating user error`, 400, "ERROR");
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteUser = async (_id) => {
	try {
		const data = await USER.findByIdAndDelete({ _id }).select(
			"-password -role -refreshToken -accessToken -__v"
		);
		if (!data) {
			throw new MoleculerClientError(`user not found`, 404, "NOT_FOUND");
		}
		return data;
	} catch (err) {
		throw err;
	}
};

const deleteUsers = async () => {
	try {
		const data = await USER.deleteMany({
			email: { $ne: "admin@gmail.com" },
		});
		return data;
	} catch (err) {
		throw err;
	}
};
module.exports = {
	createUser,
	getUser,
	updateUser,
	getUserById,
	getUsers,
	deleteUser,
	deleteUsers,
	getAdmin,
};
