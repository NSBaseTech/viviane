if (localStorage.getItem("auth-token") !== null) {
	location.replace("/public/pages/chat");
}

document.getElementById("form").addEventListener("submit", (e) => {
	e.preventDefault();

	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	auth.signin({ username, password });

	console.log(username, password);
});
