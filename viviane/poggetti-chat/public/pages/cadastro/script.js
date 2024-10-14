if (localStorage.getItem("auth-token") !== null) {
	location.replace("/public/pages/chat");
}

document.getElementById("form").addEventListener("submit", (e) => {
	e.preventDefault();

	const name = document.getElementById("name").value;
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	const cPassword = document.getElementById("cPassword").value;

	if (password !== cPassword) {
		alert("Senhas não são iguais");
		return;
	}

	auth.signup({
		name,
		username,
		password,
	});
});
