const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const res = await mongoose.connect(process.env.MONGO_URI);
		// console.log(res);
		if (res) {
			console.log(`mongodb connected successfully`);
		} else {
			console.log(`mongodb connection error`);
		}
	} catch (err) {
		console.log(`mongodb connection error ${err}`);
	}
};

module.exports = connectDB;
