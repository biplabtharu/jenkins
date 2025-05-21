// const { tokenHelper } = require("../helper");

// const auth = async (ctx, req) => {
// 	// Read the token from header
// 	const auth = req.headers.authorization;

// 	if (auth && auth.startsWith("Bearer")) {
// 		const token = auth.slice(7);

// 		let decodedToken = await tokenHelper.decode(token, next);
// 		console.log(decodedToken);

// 		// return decodedToken;
// 		// req.user = decodedToken.userId;
// 		// return decodedToken.userId;
// 		ctx.meta.userId = decodedToken.userId;
// 		// next();
// 		// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
// 		// if (token == "123456") {
// 		// 	// Returns the resolved user. It will be set to the `ctx.meta.user`
// 		// 	return { id: 1, name: "John Doe" };
// 		// } else {
// 		// 	// Invalid token
// 		// 	throw new ApiGateway.Errors.UnAuthorizedError(
// 		// 		ApiGateway.Errors.ERR_INVALID_TOKEN
// 		// 	);
// 		// }
// 	} else {
// 		// No token. Throw an error or do nothing if anonymous access is allowed.
// 		// throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
// 		return { message: `not authenticated` };
// 		// next();
// 	}
// };

// module.exports = auth;
