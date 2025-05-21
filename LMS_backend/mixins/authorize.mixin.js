const { MoleculerClientError } = require("moleculer").Errors;

module.exports = {
	methods: {
		isAuthenticated(ctx) {
			console.log(ctx.meta.user);
			if (!ctx.meta.user) {
				throw new MoleculerClientError(
					"You are not authenticated",
					401,
					"UNAUTHENTICATED"
				);
			}
		},

		isAdmin(ctx) {
			console.log(ctx.meta.role);
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
