class Auth {
	signin(body) {
		fetch("/signin", {
			body: JSON.stringify(body),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				localStorage.setItem("auth-token", data.token);
				location.reload();
			})
			.catch(() => {
				alert("usuário ou senha incorretos");
			});
	}

	signup(body) {
		fetch("/signup", {
			body: JSON.stringify(body),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				localStorage.setItem("auth-token", data.token);
				location.reload();
			})
			.catch(() => {
				alert("nome de usuário já escolhido");
			});
	}

	logout() {
		localStorage.removeItem("auth-token");
		location.replace("/public/pages/login");
	}

	valide() {
		fetch("/valide", {
			body: JSON.stringify({ token: localStorage.getItem("auth-token") }),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.catch(() => {
				this.logout();
			});
	}
}

const auth = new Auth();
