const { MoleculerClientError } = require("moleculer").Errors;
const { Server } = require("http");
const socketIO = require("socket.io");

module.exports = {
	name: "notifications",
	version: 1,

	actions: {
		notifyBorrowRequest: {
			async handler(ctx) {
				const { message } = ctx.params;
				console.log(`this is from notification`);

				const data = this.call(handleBorrowRequest);

				// Return a response
				return {
					success: true,
					message: "Borrow request accepted.",
				};
			},
		},
	},

	async started() {
		// const server = Server();
		// const io = socketIO(server);
		// io.on("connection", (socket) => {
		// 	console.log("New client connected");
		// 	socket.on("disconnect", () => {
		// 		console.log("Client disconnected");
		// 	});
		// });
		// server.listen(3001, () => {
		// 	console.log("Socket.IO server running on port 3000");
		// });
	},

	methods: {
		async handleBorrowRequest(ctx) {
			const { message } = ctx.params;
			// Send notification to clients
			this.io.emit("notification", {
				type: "notify_borrow_request",
				data: { message },
			});

			return {
				success: true,
				message: "Borrow request accepted.",
			};
		},
	},
};
