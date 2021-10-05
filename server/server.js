const colors = require("colors");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (clientSocket) => {
	console.log(`user has connected at room : ${clientSocket.id}`.green.inverse);

	//TODO => listen to event from client => Event is : join_chat
	clientSocket.on("join_room", (roomID) => {
		clientSocket.join(roomID);
		console.log(`user has joined into room ${roomID}`.yellow.inverse);
	});

	// TODO => listen to event from client => Event is : send_message
	clientSocket.on("send_message", (messageData) => {
		console.log(messageData);
		//* emit an event to all users at the same room, this event to send them the message that you sent
		clientSocket.to(messageData.room).emit("receive_message", messageData);
	});

	// TODO => listen to event from client => Event is : disconnect
	clientSocket.on("disconnect", () => {
		console.log("User had left".red.inverse);
	});
});

server.listen(5000, () => {
	console.log(`server is running up on port 5000`.magenta.inverse);
});
