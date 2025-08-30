const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
	console.log("Client connected");

	ws.on("message", function incoming(message) {
		console.log("Received:", message);
		ws.send(`Echo: ${message}`);
	});

	ws.on("close", function close() {
		console.log("Client disconnected");
	});

	ws.on("error", function error(err) {
		console.error("Error:", err);
	});
});
