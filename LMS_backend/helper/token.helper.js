const jwt = require("jsonwebtoken");
const { MoleculerClientError } = require("moleculer").Errors;

const sign = (sub) => {
	try {
		const accessToken = jwt.sign(sub, process.env.ACCESS_TOKEN_SECRET_KEY, {
			expiresIn: "24h",
		});
		return accessToken;
	} catch (err) {
		throw err;
	}
};

const decode = async (token) => {
	try {
		let decodedToken;
		jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET_KEY,
			(err, decoded) => {
				if (err) {
					throw new MoleculerClientError(
						`You are not authenticated`,
						401,
						`UNAUTHENTICATED`
					);
				}
				decodedToken = decoded.sub;
			}
		);

		console.log(decodedToken);
		return decodedToken;
	} catch (err) {
		// console.log(`jwt decoding error ${err}`);
		console.log(`${err.message}`);
		throw err;
	}
};

const signRefreshToken = (sub) => {
	try {
		const refreshToken = jwt.sign(
			sub,
			process.env.REFRESH_TOKEN_SECRET_KEY,
			{
				expiresIn: "1y",
			}
		);
		// console.log(refreshToken);
		return refreshToken;
	} catch (err) {
		// console.log(`jwt sign error ${err}`);
		throw err;
	}
};

const decodeRefreshToken = (token) => {
	let decodedRefreshToken;

	try {
		jwt.verify(
			token,
			process.env.REFRESH_TOKEN_SECRET_KEY,
			(err, decoded) => {
				if (err) {
					throw new MoleculerClientError(
						`You are not authenticated`,
						401,
						`UNAUTHENTICATED`
					);
				} else {
					decodedRefreshToken = decoded.sub;
				}
			}
		);
		return decodedRefreshToken;
	} catch (err) {
		// console.log(`jwt decoding error ${err}`);
		throw err;
	}
};

module.exports = {
	sign,
	decode,
	signRefreshToken,
	decodeRefreshToken,
};
