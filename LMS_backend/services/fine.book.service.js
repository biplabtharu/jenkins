const { MoleculerClientError } = require("moleculer").Errors;
const FINE = require("../models/fineModel");
const { methodHelper } = require("../helper");
const { fineManager } = require("../bookbolt-services");

module.exports = {
	name: "fines",
	version: 1,

	actions: {
		getUserFine: {
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

					return await fineManager.getFine(id);
				} catch (err) {
					throw err;
				}
			},
		},

		getFineByUserid: {
			rest: {
				method: "GET",
				fullpath: "/admin/v1/users/:id/fines",
			},

			params: {
				id: "string",
				$$strict: true,
			},
			async handler(ctx) {
				try {
					const id = ctx.params.id;

					const data = await FINE.find({
						userId: id,
					});

					if (!data) {
						throw new MoleculerClientError(
							`User fine not found`,
							404,
							`NOT_FOUND`
						);
					}
					return data;
				} catch (err) {
					throw err;
				}
			},
		},

		getMyFine: {
			rest: {
				method: "GET",
				path: "/",
			},

			async handler(ctx) {
				try {
					const id = ctx.meta.user;

					const data = await FINE.find({
						userId: id,
					});

					if (!data) {
						return 0;
					}
					const totalAmount = data.reduce(
						(a, v) => (a = a + v.fineAmount),
						0
					);
					return totalAmount;
				} catch (err) {
					throw err;
				}
			},
		},

		getAllUserFine: {
			rest: {
				method: "GET",
				path: "/",
			},
			async handler(ctx) {
				try {
					return await fineManager.getAllFines();
				} catch (err) {
					throw err;
				}
			},
		},

		updateUserFine: {
			rest: {
				method: "PUT",
				path: "/:id",
			},

			params: {
				id: "string",
				userId: { type: "string", optional: true },
				bookId: { type: "string", optional: true },
				fineAmount: { type: "string", optional: true },
				$$strict: true,
			},
			async handler(ctx) {
				try {
					const id = ctx.params.id;
					const { userId, bookId, fineAmount } = ctx.params;

					return await fineManager.updateFine(
						id,
						userId,
						bookId,
						fineAmount
					);
				} catch (err) {
					throw err;
				}
			},
		},

		deleteUserFine: {
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
					return await fineManager.deleteFine(id);
				} catch (err) {
					throw err;
				}
			},
		},

		deleteAllUserFine: {
			rest: {
				method: "DELETE",
				path: "/",
			},

			async handler(ctx) {
				try {
					return await fineManager.deleteAllFines();
				} catch (err) {
					throw err;
				}
			},
		},
	},

	methods: {},
};
