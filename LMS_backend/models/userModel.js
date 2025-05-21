const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const { tokenHelper } = require("../helper");
// const Joi = require("joi");

const userModel = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		accessToken: {
			type: String,
		},
		refreshToken: {
			type: String,
		},
		userImg: {
			type: String,
			default:
				"https://res.cloudinary.com/dc73d4fcl/image/upload/v1710833239/profile.png",
		},
	},
	{ timestamps: true }
);

userModel.methods.generateAccessToken = function () {
	try {
		const sub = this._id;
		const accessToken = tokenHelper.sign({ sub: sub });
		this.accessToken = accessToken;
		return accessToken;
	} catch (err) {
		console.log(`error generating auth token in user model ${err}`);
	}
};

userModel.methods.generateRefreshToken = function () {
	try {
		const sub = this._id;
		const refreshToken = tokenHelper.signRefreshToken({ sub: sub });
		this.refreshToken = refreshToken;
		return refreshToken;
	} catch (err) {
		console.log(`error generating auth token in user model ${err}`);
	}
};

// userModel.pre("save", async function () {
// 	try {
// 		if (!this.isModified(this.password)) {
// 			// const saltRounds = 12;
// 			// const salt = bcrypt.genSalt(saltRounds);
// 			const hashedPassword = await bcrypt.hash(this.password, 12);
// 			console.log(hashedPassword);
// 			this.password = hashedPassword;
// 			return;
// 		}
// 	} catch (err) {
// 		console.log(`bcrypt error ${err}`);
// 	}
// });

const USER = mongoose.model("user", userModel);

module.exports = USER;
