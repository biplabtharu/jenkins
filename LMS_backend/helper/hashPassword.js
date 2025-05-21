const bcrypt = require("bcrypt");
const { MoleculerClientError } = require("moleculer").Errors;

const hashPass = async (password) => {
	try {
		const hashedPass = await bcrypt.hash(password, 12);
		return hashedPass;
	} catch (err) {
		throw err;
	}
};

const comparePass = async (userPass, dbPass) => {
	try {
		const decryptPass = await bcrypt.compare(userPass, dbPass);
		if (!decryptPass) {
			throw new MoleculerClientError(
				"Invalid credentials",
				401,
				"UNAUTHORIZED"
			);
		}
		return decryptPass;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	hashPass,
	comparePass,
};
