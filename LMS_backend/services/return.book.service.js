const RETURN = require("../models/returnModel");
const { MoleculerClientError } = require("moleculer").Errors;
const { methodHelper } = require("../helper");
const RETURN_APPROVAL = require("../models/returnApprovalModel");
const {
	returnManager,
	borrowManager,
	returnReqManager,
} = require("../bookbolt-services");

module.exports = {
	name: "returns",
	version: 1,
	settings: {},
	actions: {
		return: {
			rest: {
				method: "POST",
				path: "/",
			},

			params: {
				bookId: "string",
				$$strict: true,
			},
			async handler(ctx) {
				try {
					const { bookId } = ctx.params;
					const user = ctx.meta.user;

					methodHelper.isValidId(bookId);
					methodHelper.isValidId(user);

					// const status = true;
					const borrowData = await borrowManager.getBorrowedBooks({
						book: bookId,
						user,
						status: true,
					});
					if (borrowData.length < 1) {
						throw new MoleculerClientError(
							`You have not borrowed this book`,
							400,
							"ERROR"
						);
					}

					const appReqData = await RETURN_APPROVAL.findOne({
						bookId,
						userId: user,
						status: "pending",
					});

					if (appReqData) {
						throw new MoleculerClientError(
							`You have already placed return order`,
							400,
							"ERROR"
						);
					}

					const data = new RETURN({
						book: bookId,
						user: user,
					});

					const returnReq = await returnReqManager.createReturnReq(
						data
					);
					const id = borrowData[0]._id;
					const updateBorrow = await borrowManager.updateBorrowedBook(
						id,
						{ returnOrder: "placed" }
					);

					return { message: `Your return order has been placed` };
				} catch (err) {
					throw err;
				}
			},
		},

		getReturnedBooksByUserId: {
			rest: {
				method: "GET",
				path: "/",
			},
			params: {
				userId: {
					type: "string",
					optional: true,
				},
				$$strict: true,
			},

			async handler(ctx) {
				try {
					const myId = ctx.meta.user;
					const { userId } = ctx.params;
					const role = ctx.meta.role;
					console.log(role);

					if (role === "user") {
						console.log(`This is from user`);
						methodHelper.isValidId(myId);
						return await returnManager.getReturnedBooksByUser(myId);
					}
					if (role === "admin") {
						console.log(`This is from admin`);
						methodHelper.isValidId(userId);
						return await returnManager.getReturnedBooksByUser(
							userId
						);
					}
				} catch (err) {
					throw err;
				}
			},
		},

		// getReturnedBooks: {
		// 	rest: {
		// 		method: "GET",
		// 		fullPath: "/admin/v1/users/:id/returns",
		// 	},

		// 	params: {
		// 		id: "string",
		// 		$$strict: true,
		// 	},
		// 	async handler(ctx) {
		// 		try {
		// 			const userId = ctx.params.id;

		// 			methodHelper.isValidId(userId);

		// 			const data = await RETURN.find(
		// 				{
		// 					user: userId,
		// 				},
		// 				"-user"
		// 			).populate("book");

		// 			if (data.length < 1) {
		// 				throw new MoleculerClientError(
		// 					`Returned books not found`,
		// 					404,
		// 					"ERR_NOT_FOUND"
		// 				);
		// 			}
		// 			return data;
		// 		} catch (err) {
		// 			throw err;
		// 		}
		// 	},
		// },

		getReturnedBook: {
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

					return (await returnManager.getReturnedBook(id)).populate(
						"book"
					);
				} catch (err) {
					throw err;
				}
			},
		},

		getAllReturnedBooks: {
			rest: {
				method: "GET",
				path: "/",
			},
			params: {
				$$strict: true,
			},
			async handler(ctx) {
				try {
					return await returnManager.getReturnedBooks();
				} catch (err) {
					throw err;
				}
			},
		},

		deleteReturnedBook: {
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
				const returnId = ctx.params.id;
				try {
					methodHelper.isValidId(returnId);
					return await returnManager.deleteReturnedBook(returnId);
				} catch (err) {
					throw err;
				}
			},
		},

		updateReturnedBook: {
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
				user: {
					type: "string",
					optional: true,
				},
				book: {
					type: "string",
					optional: true,
				},
				status: {
					type: "boolean",
					optional: true,
				},
				$$strict: true,
			},
			async handler(ctx) {
				const returnId = ctx.params.id;

				const { user, book, status } = ctx.params;

				try {
					const data = await RETURN.findByIdAndUpdate(
						{
							_id: returnId,
						},
						{ user, book, status },
						{ new: true }
					);
					return await returnManager.updateReturnedBook(
						returnId,
						ctx.params
					);
				} catch (err) {
					throw err;
				}
			},
		},

		deleteAllReturnedBooks: {
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
			async handler(ctx) {
				try {
					return await returnManager.deleteReturnedBooks();
				} catch (err) {
					throw err;
				}
			},
		},
	},
	methods: {},
};
