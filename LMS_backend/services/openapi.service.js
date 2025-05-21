const Openapi = require("moleculer-auto-openapi");

module.exports = {
	name: "openapi",
	mixins: [Openapi],
	settings: {
		openapi: {
			info: {
				description:
					"This is a microservice based library management system api created using moleculer js.",
				title: "BookBolt",
				version: "1.0.0",
			},
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						description: "bearer authentication",
						bearerFormat: "JWT",
					},
				},
			},
			security: [
				{
					bearerAuth: [],
				},
			],
		},
	},
};
