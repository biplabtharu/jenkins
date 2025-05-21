const { inventoryManager } = require("../bookbolt-services");
const { methodHelper } = require("../helper");
const { booksManager } = require("../bookbolt-services");

module.exports = {
	name: "inventories",
	version: 1,
	settings: {
		routes: [
			{
				rest: "/subscriber",
				// authorization: true,
			},
		],
	},

	actions: {
		getInventoryBook: {
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

					return await inventoryManager.getInventoryBook(id);
				} catch (err) {
					throw err;
				}
			},
		},

		getInventoryBooks: {
			rest: {
				method: "GET",
				path: "/",
			},
			async handler(ctx) {
				try {
					return await inventoryManager.getInventoryBooks();
				} catch (err) {
					throw err;
				}
			},
		},

		updateInventoryBook: {
			rest: {
				method: "PUT",
				path: "/:id",
			},
			params: {
				id: "string",
				totalQuantity: { type: "number", optional: true },
				availableQuantity: { type: "number", optional: true },
				$$strict: true,
			},
			async handler(ctx) {
				try {
					const { id, totalQuantity, availableQuantity } = ctx.params;
					const data = await inventoryManager.updateInventoryBook(
						id,
						totalQuantity,
						availableQuantity
					);
					if (Number(data.availableQuantity) < 1) {
						await booksManager.updateBook(data.bookId, {
							status: false,
						});
					} else {
						await booksManager.updateBook(data.bookId, {
							status: true,
						});
					}
					return data;
				} catch (err) {
					throw err;
				}
			},
		},

		deleteInventoryBook: {
			rest: {
				method: "DELETE",
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
					return await inventoryManager.deleteInventoryBook(id);
				} catch (err) {
					throw err;
				}
			},
		},

		deleteInventoryBooks: {
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
					return await inventoryManager.deleteInventoryBooks();
				} catch (err) {
					throw err;
				}
			},
		},
	},

	methods: {},
};
