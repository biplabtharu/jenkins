"use strict";

const INVENTORY = require("../models/inventoryModel");
const BOOK = require("../models/bookModel");
const { methodHelper } = require("../helper");
const { booksManager, regexManager } = require("../bookbolt-services");
const { MoleculerClientError } = require("moleculer").Errors;

module.exports = {
	name: "books",
	version: 1,
	settings: {},

	actions: {
		addBook: {
			settings: {
				routes: [
					{
						rest: "/admin",
					},
				],
			},
			rest: {
				method: "POST",
				path: "/",
			},

			params: {
				bookName: "string|min:3|max:80",
				author: "string|min:3|max:50",
				genre: "string|min:3|max:30",
				publisher: "string|min:3|max:80",
				publicationDate: "string",
				ISBN: "string",
				bookImg: {
					type: "string",
					optional: true,
				},
			},
			async handler(ctx) {
				try {
					let {
						bookName,
						author,
						genre,
						publisher,
						publicationDate,
						ISBN,
						bookImg,
					} = ctx.params;

					if (
						!bookName ||
						!author ||
						!genre ||
						!publisher ||
						!publicationDate ||
						!ISBN
					) {
						throw new MoleculerClientError(
							`fill all the required fields`,
							422,
							`ERROR`
						);
					}
					const bookData = await booksManager.getSpecBooks(
						bookName,
						author
					);

					if (bookData.length >= 1) {
						throw new MoleculerClientError(
							"This book is already added",
							400,
							"ERROR"
						);
					}
					if (bookData.length < 1) {
						const data = await booksManager.createBook(ctx.params);

						const createInventory = new INVENTORY({
							bookId: data._id,
							totalQuantity: 1,
							availableQuantity: 1,
						});

						const inventoryData = await createInventory.save();

						if (!inventoryData) {
							throw new MoleculerClientError(
								"Saving inventory book error",
								400,
								"ERROR"
							);
						}

						return data;
					}

					// const bookId = bookData[0]._id;
					// // if (bookData.length === 1) {
					// const findInventory = await INVENTORY.find({
					// 	bookId,
					// });

					// if (findInventory.length === 1) {
					// 	const inventoryId = findInventory[0]._id;
					// 	const totalQuantity = Number(
					// 		findInventory[0].totalQuantity
					// 	);
					// 	const availableQuantity = Number(
					// 		findInventory[0].availableQuantity
					// 	);
					// 	// console.log(typeof quantity);
					// 	const updateInventory =
					// 		await INVENTORY.findByIdAndUpdate(
					// 			{ _id: inventoryId },
					// 			{
					// 				totalQuantity: totalQuantity + 1,
					// 				availableQuantity: availableQuantity + 1,
					// 			},
					// 			{ new: true }
					// 		);

					// 	if (!updateInventory) {
					// 		throw new MoleculerClientError(
					// 			"Updating inventory book error",
					// 			400,
					// 			"ERROR"
					// 		);
					// 	}

					// 	if (Number(updateInventory.availableQuantity) >= 1) {
					// 		await BOOK.findByIdAndUpdate(
					// 			{
					// 				_id: bookId,
					// 			},
					// 			{ status: true }
					// 		);
					// 	}

					// 	return updateInventory;
					// } else if (findInventory.length > 1) {
					// 	throw new MoleculerClientError(
					// 		`Same books are repeated in inventory`,
					// 		422,
					// 		`ERROR`
					// 	);
					// }

					// const createInventory = new INVENTORY({
					// 	bookId: bookId,
					// 	totalQuantity: 1,
					// 	availableQuantity: 1,
					// });

					// const inventData = await createInventory.save();

					// if (!inventData) {
					// 	throw new MoleculerClientError(
					// 		"Saving inventory book error",
					// 		400,
					// 		"RROR"
					// 	);
					// }
					// return inventData;
					// } else if (findBook.length > 1) {
					// 	throw new MoleculerClientError(
					// 		`Same books are repeated in book`,
					// 		422,
					// 		`ERROR`
					// 	);
					// }

					// const createBook = new BOOK({
					// 	bookName,
					// 	author,
					// 	genre,
					// 	publisher,
					// 	publicationDate,
					// 	ISBN,
					// 	bookImg,
					// });

					// ctx.meta.$statusCode = 201;
					// const data = await createBook.save();

					// if (!data) {
					// 	throw new MoleculerClientError(
					// 		"Saving book error",
					// 		400,
					// 		"ERROR"
					// 	);
					// }

					// bookId = data._id;

					// const createInventory = new INVENTORY({
					// 	bookId: bookId,
					// 	totalQuantity: 1,
					// 	availableQuantity: 1,
					// });

					// const inventoryData = await createInventory.save();

					// if (!inventoryData) {
					// 	throw new MoleculerClientError(
					// 		"Saving inventory book error",
					// 		400,
					// 		"ERROR"
					// 	);
					// }

					// return data;
				} catch (err) {
					throw err;
				}
			},
		},

		getBooks: {
			rest: {
				method: "GET",
				path: "/",
			},

			params: {
				query: {
					type: "string",
					optional: true,
				},
			},

			async handler(ctx) {
				try {
					const { query } = ctx.params;
					console.log(`query is `);
					console.log(query);
					if (query) {
						const regex = regexManager.constructRegExp(query);
						return await booksManager.getBooks(regex);
					}
					return await booksManager.getBooks();
				} catch (err) {
					throw err;
				}
			},
		},

		getBook: {
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

					return await booksManager.getBookById(id);
				} catch (err) {
					throw err;
				}
			},
		},

		updateBook: {
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
				bookName: {
					type: "string",
					optional: true,
				},
				author: {
					type: "string",
					optional: true,
				},
				genre: {
					type: "string",
					optional: true,
				},
				status: {
					type: "string",
					optional: true,
				},
				publisher: {
					type: "string",
					optional: true,
				},
				publicationDate: {
					type: "string",
					optional: true,
				},
				ISBN: {
					type: "string",
					optional: true,
				},
				bookImg: {
					type: "string",
					optional: true,
				},
				$$strict: true,
			},

			async handler(ctx) {
				try {
					const bookId = ctx.params.id;

					methodHelper.isValidId(bookId);

					const data = await booksManager.updateBook(
						bookId,
						ctx.params
					);

					return data;
				} catch (err) {
					throw err;
				}
			},
		},

		deleteBook: {
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
				const bookId = ctx.params.id;
				methodHelper.isValidId(bookId);
				try {
					return await booksManager.deleteBook(bookId);
				} catch (err) {
					throw err;
				}
			},
		},

		deleteBooks: {
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
					return await booksManager.deleteBooks();
				} catch (err) {
					throw err;
				}
			},
		},
	},
	methods: {},
};
