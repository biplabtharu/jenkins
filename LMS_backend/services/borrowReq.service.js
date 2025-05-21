const { borrowReqManager } = require("../bookbolt-services");
const { methodHelper } = require("../helper");

module.exports = {
	name: "borrow-requests",
	version: 1,

	actions: {
		getMyborrowRequests: {
			rest: {
				method: "GET",
				path: "/",
			},
			params: {
				// status: "string",
				$$strict: true,
			},

			async handler(ctx) {
				try {
					const userId = ctx.meta.user;
					methodHelper.isValidId(userId);

					const data = await borrowReqManager.getBorrowReq({
						userId,
						status: "pending",
					});

					return data;
				} catch (err) {
					throw err;
				}
			},
		},

		getAllBorrowReqs: {
			rest: {
				method: "GET",
				path: "/",
			},
			params: {
				$$strict: true,
			},

			async handler(ctx) {
				try {
					return await borrowReqManager.getAllBorrowReqs();
				} catch (err) {
					throw err;
				}
			},
		},

		getBorrowReq: {
			rest: {
				method: "GET",
				path: "/:id",
			},
			params: {
				id: "string",
				$$strict: true,
			},

			async handler(ctx) {
				const id = ctx.params.id;
				methodHelper.isValidId(id);

				return await borrowReqManager.getBorrowReqById(id);
			},
		},

		updateBorrowReq: {
			rest: {
				method: "PUT",
				path: "/:id",
			},
			params: {
				id: "string",
				status: "string",
				$$strict: true,
			},

			async handler(ctx) {
				const { id, status } = ctx.params;

				try {
					const data = await borrowReqManager.updateBorrowReq(
						id,
						status
					);
					return data;
				} catch (err) {
					throw err;
				}
			},
		},

		deleteBorrowReq: {
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
					methodHelper.isValidId(id);
					return await borrowReqManager.deleteBorrowReq(id);
				} catch (err) {
					throw err;
				}
			},
		},

		deleteAllBorrowReqs: {
			rest: {
				method: "DELETE",
				path: "/",
			},
			params: {
				$$strict: true,
			},

			async handler(ctx) {
				try {
					return await borrowReqManager.deleteAllBorroReqs();
				} catch (err) {
					throw err;
				}
			},
		},
	},
};
