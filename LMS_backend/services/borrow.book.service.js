const BORROW = require("../models/borrowModel");
const { methodHelper } = require("../helper");
const { MoleculerClientError } = require("moleculer").Errors;
const BORROW_APPROVAL = require("../models/borrowApprovalModel");
const BORROW_COUNT = require("../models/borrowCountModel");
const config = require("../configure.json");
const mongoose = require("mongoose");
const {
	borrowManager,
	booksManager,
	borrowReqManager,
} = require("../bookbolt-services");

module.exports = {
	name: "borrows",
	version: 1,
	settings: {
		routes: [
			{
				rest: "/subscriber",
			},
		],
	},

	actions: {
		borrow: {
			rest: {
				method: "POST",
				path: "/",
			},

			params: {
				bookId: "string",
				$$strict: true,
			},

			async handler(ctx) {
				const session = await mongoose.startSession();
				session.startTransaction();
				try {
					const bookId = ctx.params.bookId;
					const userId = ctx.meta.user;

					methodHelper.isValidId(bookId);

					const bookData = await booksManager.getBookById(bookId);

					if (!bookData || bookData.status === false) {
						throw new MoleculerClientError(
							`Book not available`,
							404,
							"NOT_AVAILABLE"
						);
					}

					const isBorrowed = await borrowManager.getBorrowedBooks({
						book: bookId,
						user: userId,
						status: true,
					});

					if (isBorrowed.length >= 1) {
						throw new MoleculerClientError(
							"You have already borrowed this book",
							400,
							`ERROR`
						);
					}

					const countData = await BORROW_COUNT.findOne({
						userId: userId,
					});

					if (
						countData &&
						Number(countData.borrowCount) >=
							Number(config.borrowLimit)
					) {
						throw new MoleculerClientError(
							"Your borrow limit exceeds",
							400
						);
					}

					const appReqData = await borrowReqManager.getBorrowReq({
						bookId: bookId,
						userId: userId,
						status: "pending",
					});

					if (appReqData.length >= 1) {
						throw new MoleculerClientError(
							`Your order has already been placed`,
							400,
							"ERROR"
						);
					}

					const borrowData = await borrowReqManager.getBorrowReq({
						userId: userId,
						status: "pending",
					});

					console.log(borrowData);
					// return borrowData;

					if (
						borrowData &&
						borrowData.length >= Number(config.borrowLimit)
					) {
						{
							throw new MoleculerClientError(
								"Your borrow limit exceeds",
								400
							);
						}
					}
					const data = new BORROW({
						book: bookId,
						user: userId,
						dueDate: new Date(),
					});

					// this.broker.emit("books.borrow", bookId);

					const borrowReq = await borrowReqManager.createBorrowReq(
						data
					);

					await session.commitTransaction();
					return { message: `Your order has been placed` };
				} catch (err) {
					await session.abortTransaction();
					throw err;
				} finally {
					session.endSession();
				}
			},
		},

		// getBorrowedBooksByStatus: {
		// 	rest: {
		// 		method: "GET",
		// 		fullPath: "/admin/v1/users/:id/borrows/true",
		// 	},
		// 	params: {
		// 		id: "string",

		// 		$$strict: true,
		// 	},
		// 	async handler(ctx) {
		// 		try {
		// 			const id = ctx.params.id;
		// 			methodHelper.isValidId(id);

		// 			const data = await BORROW.find(
		// 				{
		// 					user: id,
		// 					status: true,
		// 				},
		// 				"-user"
		// 			).populate("book");

		// 			if (!data) {
		// 				throw new MoleculerClientError(
		// 					`borrowed books with status true not found`,
		// 					404,
		// 					"NOT_FOUND"
		// 				);
		// 			}
		// 			return data;
		// 		} catch (err) {
		// 			throw err;
		// 		}
		// 	},
		// },

		getMyBorrowedBooks: {
			rest: {
				method: "GET",
				path: "/",
			},
			async handler(ctx) {
				try {
					const id = ctx.meta.user;
					// return id;
					methodHelper.isValidId(id);
					const data = await borrowManager.getBorrowedBooks({
						user: id,
					});

					return data;
				} catch (err) {
					throw err;
				}
			},
		},
		getBorrowedBooksByUserid: {
			rest: {
				method: "GET",
				fullPath: "/admin/v1/users/:id/borrows",
			},
			params: {
				id: "string",
				$$strict: true,
			},
			async handler(ctx) {
				try {
					const id = ctx.params.id;

					methodHelper.isValidId(id);
					const data = await borrowManager.getBorrowedBooks({
						user: id,
					});

					return data;
				} catch (err) {
					throw err;
				}
			},
		},

		getBorrowedBook: {
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

					return await borrowManager.getBorrowedBook(id);
				} catch (err) {
					throw err;
				}
			},
		},

		getAllBorrowedBooks: {
			rest: {
				method: "GET",
				path: "/",
			},
			async handler(ctx) {
				try {
					return await borrowManager.getBorrowedBooks();
				} catch (err) {
					throw err;
				}
			},
		},

		updateBorrowedBook: {
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
				status: { type: "boolean", optional: true },
				returnOrder: { type: "string", optional: true },
				$$strict: true,
			},
			async handler(ctx) {
				const borrowId = ctx.params.id;
				methodHelper.isValidId(borrowId);

				try {
					const data = await borrowManager.updateBorrowedBook(
						borrowId,
						ctx.params
					);
					return data;
				} catch (err) {
					throw err;
				}
			},
		},

		deleteBorrowedBook: {
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
				const borrowId = ctx.params.id;
				methodHelper.isValidId(borrowId);

				try {
					return await borrowManager.deleteBorrowedBook(borrowId);
				} catch (err) {
					throw err;
				}
			},
		},

		deleteAllBorrowedBooks: {
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
				await borrowManager.deleteBorrowedBooks();
			},
		},
	},

	methods: {},
};
