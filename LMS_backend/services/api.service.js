"use strict";

const ApiGateway = require("moleculer-web");
const { tokenHelper, methodHelper } = require("../helper");
const USER = require("../models/userModel");
const { UnAuthorizedError } = ApiGateway.Errors;
const { MoleculerClientError } = require("moleculer").Errors;

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 * @typedef {import('moleculer-web').ApiSettingsSchema} ApiSettingsSchema API Setting Schema
 */

module.exports = {
	name: "api",

	mixins: [ApiGateway],

	/** @type {ApiSettingsSchema} More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html */
	settings: {
		// Exposed port
		port: process.env.PORT || 3000,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		cors: {
			// Configures the Access-Control-Allow-Origin CORS header.
			origin: "*",
			// Configures the Access-Control-Allow-Methods CORS header.
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			// Configures the Access-Control-Allow-Headers CORS header.
			allowedHeaders: ["*"],
			// Configures the Access-Control-Expose-Headers CORS header.
			exposedHeaders: [],
			// Configures the Access-Control-Allow-Credentials CORS header.
			credentials: false,
			// Configures the Access-Control-Max-Age CORS header.
			maxAge: 3600,
		},

		routes: [
			{
				path: "/api",

				whitelist: [
					"v1.users.refreshToken",

					"v1.users.signin",
					"v1.users.signup",

					"v1.users.adminSignin",

					"v1.books.getBooks",
					"v1.books.getBook",

					"v1.users.some",

					"$node.*",
				],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {},

				/**
				 * Before call hook. You can check the request.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				 *
				onBeforeCall(ctx, route, req, res) {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
				}, */

				/**
				 * After call hook. You can modify the data.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				onAfterCall(ctx, route, req, res, data) {
					// Async function which return with Promise
					return doSomething(ctx, res, data);
				}, */

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},

			{
				path: "/subscriber",

				whitelist: [
					"v1.users.signout",
					"v1.users.profile",

					"v1.borrows.borrow",
					"v1.borrows.getMyBorrowedBooks",
					"v1.borrows.getBorrowedBook",
					"v1.borrows.approvalRequest",

					"v1.returns.return",
					"v1.returns.getReturnedBooksByUserId",
					"v1.returns.getReturnedBook",

					"v1.fines.getUserFine",
					"v1.fines.getMyFine",

					"v1.borrow-requests.getMyborrowRequests",

					"v1.return-requests.getMyReturnRequests",
					// "v1.inventories.getInventoryBook",
					// "v1.inventories.getInventoryBooks",
				],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: true,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {},

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},

			{
				path: "/api/openapi",
				aliases: {
					"GET /openapi.json": "openapi.generateDocs", // swagger scheme
					"GET /ui": "openapi.ui", // ui
					"GET /assets/:file": "openapi.assets", // js/css files
				},
			},

			{
				path: "/admin",

				whitelist: [
					"v1.users.getUser",
					"v1.users.getUsers",
					"v1.users.updateUser",
					"v1.users.deleteUser",
					"v1.users.deleteUsers",
					"v1.users.signout",

					"v1.books.addBook",
					"v1.books.updateBook",
					"v1.books.deleteBook",
					"v1.books.deleteBooks",

					"v1.borrows.getBorrowedBooksByStatus",
					"v1.borrows.getBorrowedBooksByUserid",
					"v1.borrows.getBorrowedBook",
					"v1.borrows.getAllBorrowedBooks",
					"v1.borrows.updateBorrowedBook",
					"v1.borrows.deleteBorrowedBook",
					"v1.borrows.deleteAllBorrowedBooks",

					"v1.borrow-requests.getAllBorrowReqs",
					"v1.borrow-requests.getBorrowReq",
					"v1.borrow-requests.updateBorrowReq",
					"v1.borrow-requests.deleteBorrowReq",
					"v1.borrow-requests.deleteAllBorrowReqs",

					"v1.fines.getUserFine",
					"v1.fines.getFineByUserid",
					"v1.fines.getAllUserFine",
					"v1.fines.updateUserFine",
					"v1.fines.deleteUserFine",
					"v1.fines.deleteAllUserFine",

					"v1.returns.getReturnedBooks",
					"v1.returns.getReturnedBook",

					"v1.returns.getAllReturnedBooks",
					"v1.returns.updateReturnedBook",
					"v1.returns.deleteReturnedBook",
					"v1.returns.deleteAllReturnedBooks",

					"v1.return-requests.getAllReturnReqs",
					"v1.return-requests.getReturnReq",
					"v1.return-requests.updateReturnReq",
					"v1.return-requests.deleteReturnReq",
					"v1.return-requests.deleteAllReturnReqs",

					"v1.inventories.getInventoryBook",
					"v1.inventories.getInventoryBooks",
					"v1.inventories.updateInventoryBook",
					"v1.inventories.deleteInventoryBook",
					"v1.inventories.deleteInventoryBooks",

					"v1.users.configs",
					"v1.users.updateConfigs",

					"v1.notifications.notifyBorrowRequest",
				],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: true,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {},

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},
			//
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {},
		},
	},

	methods: {
		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			const auth = req.headers["authorization"];
			if (auth && auth.startsWith("Bearer")) {
				const accessToken = auth.slice(7);
				console.log(accessToken);
				let decodedToken = await tokenHelper.decode(accessToken);

				methodHelper.isValidId(decodedToken);
				if (decodedToken) {
					const findUser = await USER.findById({ _id: decodedToken });
					if (accessToken !== findUser.accessToken) {
						throw new ApiGateway.Errors.UnAuthorizedError(
							ApiGateway.Errors.ERR_INVALID_TOKEN
						);
					}
					ctx.meta.role = findUser.role;
					return decodedToken;
				} else {
					// Invalid token
					throw new ApiGateway.Errors.UnAuthorizedError(
						ApiGateway.Errors.ERR_INVALID_TOKEN
					);
				}
			} else {
				// No token. Throw an error or do nothing if anonymous access is allowed.
				throw new UnAuthorizedError(ApiGateway.Errors.ERR_NO_TOKEN);
			}
		},
		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			if (ctx.meta.role !== "admin") {
				throw new MoleculerClientError(
					"You are not admin",
					401,
					"UNAUTHORIZED"
				);
			}
		},
	},
};
