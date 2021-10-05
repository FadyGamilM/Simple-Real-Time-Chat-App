import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
//* define socket variable
const socket = io.connect("http://localhost:5000");
function App() {
	const [username, setUsername] = useState("");
	const [room, setRoom] = useState("");
	const [showChatPage, setShowChatPage] = useState(false);

	//* this function will establish the connection between the user and the room
	const JoinHandle = (e) => {
		if (username !== "" && room !== "") {
			//TODO => emit event to server
			socket.emit("join_room", room);
			setShowChatPage(true);
		}
	};
	return (
		<div className="App text-center  justify-center min-h-screen bg-gradient-to-r from-pink-200 to-purple-400">
			{!showChatPage ? (
				<div className="p-8 flex flex-col gap-4">
					<h1 className="text-xl text-purple-600">Join A Chat</h1>
					<input
						className="text-xl p-1 border-2 border-purple-200"
						type="text"
						placeholder="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<input
						className="text-xl p-1 border-2 border-purple-200"
						type="text"
						placeholder="room"
						value={room}
						onChange={(e) => setRoom(e.target.value)}
					/>
					<button
						onClick={JoinHandle}
						className="bg-purple-700 p-2 rounded-lg text-white block"
					>
						Join
					</button>
				</div>
			) : (
				<div className="text-center items-center flex justify-center">
					<Chat socket={socket} username={username} room={room} />
				</div>
			)}
		</div>
	);
}

export default App;
