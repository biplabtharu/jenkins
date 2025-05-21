"use strict";

const { tokenHelper, methodHelper, hashPassword } = require("../helper");
const AppError = require("../utils/AppError");
const fs = require("fs");
const configPath = "./configure.json";
const { users_management, borrowReqManager } = require("../bookbolt-services");
// const cookieParser = require("cookie-parser");
const { MoleculerClientError } = require("moleculer").Errors;
const mongoose = require("mongoose");

module.exports = {
	name: "users",
	version: 1,
	settings: {},

	actions: {
		signup: {
			rest: {
				method: "POST",
				path: "/signup",
			},
			params: {
				firstName: {
					type: "string",
					min: 3,
					max: 30,
					nullable: false,
				},
				lastName: {
					type: "string",
					min: 3,
					max: 30,
					nullable: false,
				},
				email: { type: "email", nullable: false, unique: true },
				password: {
					type: "string",
					nullable: false,
				},
				userImg: {
					type: "string",
					optional: true,
				},
				$$strict: true,
			},
			async handler(ctx) {
				const { firstName, lastName, email, password, userImg } =
					ctx.params;

				const data = await users_management.createUser(
					firstName,
					lastName,
					email,
					password,
					userImg
				);
				ctx.meta.$statusCode = 201;
				return data;
			},
		},

		signin: {
			rest: {
				method: "POST",
				path: "/signin",
			},

			params: {
				email: "email",
				password: "string",
				$$strict: true,
			},
			async handler(ctx) {
				const { email, password } = ctx.params;

				if (!email || !password) {
					throw new MoleculerClientError(
						`fill all the required fields`,
						422,
						"ERROR"
					);
				}

				const session = await mongoose.startSession();
				session.startTransaction();
				try {
					const userData = await users_management.getUser(email);

					await hashPassword.comparePass(password, userData.password);

					const accessToken = tokenHelper.sign({
						sub: userData._id,
					});

					const refreshToken = tokenHelper.signRefreshToken({
						sub: userData._id,
					});

					const updateData = { accessToken, refreshToken };

					const updatedData = await users_management.updateUser(
						userData._id,
						updateData
					);

					// res.cookie("token", token, {
					// 	httpOnly: true,
					// 	maxAge: 1000 * 60 * 60,
					// });
					await session.commitTransaction();
					console.log("transaction committed successfully");
					return { accessToken, refreshToken };
				} catch (err) {
					await session.abortTransaction();
					throw err;
				} finally {
					session.endSession();
				}
			},
		},

		adminSignin: {
			rest: {
				method: "POST",
				path: "/admin-signin",
			},

			params: {
				email: "email",
				password: "string",
				$$strict: true,
			},
			async handler(ctx) {
				const { email, password } = ctx.params;

				if (!email || !password) {
					throw new MoleculerClientError(
						`fill all the required fields`,
						422,
						"ERROR"
					);
				}

				const session = await mongoose.startSession();
				session.startTransaction();

				try {
					if (
						email != "admin@gmail.com" &&
						email != "kktbiplab010@gmail.com"
					) {
						throw new MoleculerClientError(
							`invalid credentials`,
							401,
							`UNAUTHENTICATED`
						);
					}
					const userData = await users_management.getAdmin(email);

					await hashPassword.comparePass(password, userData.password);

					const accessToken = tokenHelper.sign({
						sub: userData._id,
					});

					const refreshToken = tokenHelper.signRefreshToken({
						sub: userData._id,
					});

					const updateData = { accessToken, refreshToken };

					const updatedData = await users_management.updateUser(
						userData._id,
						updateData
					);

					await session.commitTransaction();
					// ctx.meta.$responseHeaders = {
					// 	"X-accessToken": accessToken,
					// 	"X-refreshToken": refreshToken,
					// 	"X-email": updatedData.email,
					// };
					return { accessToken, refreshToken };
				} catch (err) {
					await session.abortTransaction();
					throw err;
				} finally {
					session.endSession();
				}
			},
		},

		profile: {
			rest: {
				method: "GET",
				path: "/profile",
			},
			params: {
				$$strict: true,
			},

			async handler(ctx) {
				try {
					const userId = ctx.meta.user;
					const data = await users_management.getUserById(userId);

					const { _id, firstName, lastName, role, email, userImg } =
						data;

					return { _id, firstName, lastName, role, email, userImg };
				} catch (err) {
					throw err;
				}
			},
		},

		refreshToken: {
			rest: {
				method: "POST",
				path: "/refresh-token",
			},

			params: {
				refreshToken: "string",
				$$strict: true,
			},

			async handler(ctx) {
				const session = await mongoose.startSession();
				session.startTransaction();
				try {
					const userRefreshToken = ctx.params.refreshToken;

					const decodedToken = tokenHelper.decodeRefreshToken(
						userRefreshToken,
						process.env.REFRESH_TOKEN_SECRET_KEY
					);

					const userId = decodedToken;
					const user = await users_management.getUserById(userId);
					if (userRefreshToken !== user.refreshToken) {
						throw new MoleculerClientError(
							`Invalid token`,
							401,
							"UNAUTHORIZED"
						);
					}

					const accessToken = tokenHelper.sign({ sub: userId });

					const refreshToken = tokenHelper.signRefreshToken({
						sub: userId,
					});
					const data = await users_management.updateUser(userId, {
						accessToken,
						refreshToken,
					});
					await session.commitTransaction();
					return {
						accessToken: data.accessToken,
						refreshToken: data.refreshToken,
					};
				} catch (err) {
					await session.abortTransaction();
					throw err;
				} finally {
					session.endSession();
				}
			},
		},

		getUsers: {
			settings: {
				routes: [
					{
						rest: "/admin",
					},
				],
			},

			rest: {
				method: "GET",
				path: "/",
			},
			params: { $$strict: true },

			async handler(ctx) {
				try {
					return await users_management.getUsers();
				} catch (err) {
					throw err;
				}
			},
		},

		getUser: {
			rest: {
				method: "GET",
				path: "/:id",
			},

			params: {
				id: "string",
				$$strict: true,
			},
			async handler(ctx) {
				try {
					const id = ctx.params.id;
					methodHelper.isValidId(id);

					const data = await users_management.getUserById(id);
					return data;
				} catch (err) {
					throw err;
				}
			},
		},

		deleteUser: {
			settings: {
				routes: [
					{
						rest: "/admin",
					},
				],
			},
			rest: {
				method: "DELETE",
				path: "/:id",
			},
			params: {
				id: "string",
				$$strict: true,
			},
			async handler(ctx) {
				const id = ctx.params.id;
				try {
					return await users_management.deleteUser(id);
				} catch (err) {
					throw err;
				}
			},
		},

		deleteUsers: {
			settings: {
				routes: [
					{
						rest: "/admin",
					},
				],
			},
			rest: {
				method: "DELETE",
				path: "/",
			},

			params: { $$strict: true },
			async handler(ctx) {
				try {
					return await users_management.deleteUsers();
				} catch (err) {
					throw err;
				}
			},
		},

		updateUser: {
			settings: {
				routes: [
					{
						rest: "/admin",
					},
				],
			},
			rest: {
				method: "PUT",
				path: "/:id",
			},

			params: {
				id: "string",
				firstName: {
					type: "string",
					min: 3,
					max: 30,
					optional: true,
				},
				lastName: {
					type: "string",
					min: 3,
					max: 30,
					optional: true,
				},
				email: {
					type: "email",
					unique: true,
					optional: true,
				},
				password: {
					type: "string",
					optional: true,
				},
				userImg: {
					type: "string",
					optional: true,
				},
				$$strict: true,
			},
			async handler(ctx) {
				try {
					const {
						id,
						firstName,
						lastName,
						email,
						password,
						role,
						userImg,
					} = ctx.params;

					const data = await users_management.updateUser(id, {
						firstName,
						lastName,
						email,
						password,
						role,
						userImg,
					});

					return data;
				} catch (err) {
					throw err;
				}
			},
		},

		signout: {
			rest: {
				method: "GET",
				path: "/signout",
			},

			async handler(ctx) {
				try {
					const userId = ctx.meta.user;
					const updateUser = await users_management.updateUser(
						userId,
						{ refreshToken: null, accessToken: null }
					);

					// return user.refreshToken.length;

					if (
						updateUser.refreshToken === null &&
						updateUser.accessToken === null
					) {
						return { message: `Sign out Successfull` };
					}
				} catch (err) {
					throw err;
				}
			},
		},

		configs: {
			rest: {
				method: "GET",
				path: "/config",
			},

			async handler(ctx) {
				try {
					const data = await borrowReqManager.getConfig();
					return data;
				} catch (err) {
					throw err;
				}
			},
		},

		updateConfigs: {
			rest: {
				method: "PUT",
				path: "/config",
			},
			params: {
				borrowLimit: {
					type: "number",
					optional: true,
				},
				borrowDays: {
					type: "number",
					optional: true,
				},
				finePerDay: {
					type: "number",
					optional: true,
				},
			},

			async handler(ctx) {
				const { borrowLimit, borrowDays, finePerDay } = ctx.params;

				try {
					if (!borrowLimit && !borrowDays) {
						return;
					}

					fs.readFile(configPath, "utf-8", (err, data) => {
						if (err) {
							throw new MoleculerClientError(
								`Error reading config file`,
								400,
								"ERROR"
							);
						}
						const configData = JSON.parse(data);

						if (borrowDays) {
							configData.borrowDays = borrowDays;
						}
						if (borrowLimit) {
							configData.borrowLimit = borrowLimit;
						}
						if (finePerDay) {
							configData.finePerDay = finePerDay;
						}

						const modifiedData = JSON.stringify(configData);

						fs.writeFile(
							configPath,
							modifiedData,
							"utf-8",
							(err, data) => {
								if (err) {
									throw new MoleculerClientError(
										`Error writting in configure file`
									);
								}
								return {
									message: `Successfully modified configure file`,
								};
							}
						);
					});
				} catch (err) {
					throw err;
				}
			},
		},
	},
	methods: {},
};
