auth.valide();

function logout() {
	auth.logout();
}

const socket = io();

document.getElementById("form").addEventListener("submit", (e) => {
	e.preventDefault();

	const message = document.getElementById("message").value;

	socket.emit("new-message", {
		token: localStorage.getItem("auth-token"),
		message,
	});

	document.getElementById("message").value = "";
});

socket.on("new-message", (data) => {
	console.log(data);

	const chatMessages = document.getElementById("chat-messages");

	chatMessages.innerHTML += `
		<div class="message-text">
			<p>${data.message}</p>
			<span>${data.name}</span>
		</div>
	`;

	chatMessages.scroll({
		behavior: "smooth",
		top: chatMessages.scrollHeight,
	});
});
