import { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
//NOTE => HERE WE ARE GOING TO SNED AND RECIEVE MESSAGES
const Chat = ({ socket, username, room }) => {
	const [currMessage, setCurrMessage] = useState("");
	//! list of messages for this room
	const [messageList, setMessageList] = useState([]);

	const sendMessage = async () => {
		if (currMessage !== "") {
			//* wrap all info we need to send when a message is sent into one object
			const messageData = {
				room: room,
				author: username,
				time:
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes(),
				message: currMessage,
			};
			//* now we need to emit an event
			await socket.emit("send_message", messageData);
			setCurrMessage("");
			// to also see your message at your chat not only at other users chat
			setMessageList((list) => [...list, messageData]);
		}
	};

	useEffect(() => {
		socket.on("receive_message", (messageData) => {
			console.log(messageData);
			setMessageList((list) => [...list, messageData]);
		});
	}, [socket]);

	return (
		<div className=" w-screen h-screen justify-center items-center flex">
			<div className="flex flex-col justify-center items-center shadow-2xl">
				<div className="bg-purple-600 text-white p-1 rounded-t-lg w-64">
					Live Chat
				</div>

				<div className="border-2 border-purple-300 h-80 w-64 shadow-lg">
					<ScrollToBottom className="h-full break-all">
						{messageList.map((messageData) => {
							return (
								<div
									className={
										username === messageData.author
											? "bg-green-200 flex flex-col content-start items-start rounded-xl shadow-lg p-2 m-2"
											: "bg-gray-200 flex flex-col items-end rounded-xl shadow-lg p-2 m-2"
									}
								>
									<div className="flex gap-2">
										<h1 className="font-extralight text-sm">
											{messageData.author}
										</h1>
										<h1 className="font-extralight text-sm">
											{messageData.time}
										</h1>
									</div>
									<div>
										<h1 className=" text-2xl font-semibold text-purple-800">
											{messageData.message}
										</h1>
									</div>
								</div>
							);
						})}
					</ScrollToBottom>
				</div>

				<div className="flex items-center w-64">
					<input
						type="text"
						placeholder="Write A Message"
						className="text-xl p-1 border-2 border-purple-200"
						value={currMessage}
						onChange={(e) => setCurrMessage(e.target.value)}
						onKeyPress={(e) => {
							e.key === "Enter" && sendMessage();
						}}
					/>
					<button onClick={sendMessage}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-5 text-white bg-purple-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Chat;
