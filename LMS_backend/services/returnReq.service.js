const { returnReqManager } = require("../bookbolt-services");
const { methodHelper } = require("../helper");

module.exports = {
	name: "return-requests",
	version: 1,

	actions: {
		getAllReturnReqs: {
			rest: {
				method: "GET",
				path: "/",
			},
			params: {
				$$strict: true,
			},

			async handler(ctx) {
				try {
					return await returnReqManager.getAllReturnReqs();
				} catch (err) {
					throw err;
				}
			},
		},

		getReturnReq: {
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
				try {
					methodHelper.isValidId(id);
					return await returnReqManager.getReturnReq(id);
				} catch (err) {
					throw err;
				}
			},
		},

		getMyReturnRequests: {
			rest: {
				method: "GET",
				path: "/",
			},
			params: {
				$$strict: true,
			},

			async handler(ctx) {
				const id = ctx.meta.user;
				try {
					methodHelper.isValidId(id);
					return await returnReqManager.getReturnReqByUserId(id);
				} catch (err) {
					throw err;
				}
			},
		},

		updateReturnReq: {
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
					methodHelper.isValidId(id);
					return await returnReqManager.updateReturnReq(id, status);
				} catch (err) {
					throw err;
				}
			},
		},

		deleteReturnReq: {
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
					return await returnReqManager.deleteReturnReq(id);
				} catch (err) {
					throw err;
				}
			},
		},

		deleteAllReturnReqs: {
			rest: {
				method: "DELETE",
				path: "/",
			},
			params: {
				$$strict: true,
			},

			async handler(ctx) {
				try {
					return await returnReqManager.deleteAllReturnReqs();
				} catch (err) {
					throw err;
				}
			},
		},
	},
};
