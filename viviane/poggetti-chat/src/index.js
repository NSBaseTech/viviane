// Importa bibliotecas
require("express-async-errors");
const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const { addUser, findUserByUsername } = require("./users");
const { generateHash } = require("./hash");
const { generateToken, valideToken } = require("./token");

// Porta que o programa vai rodar
const PORT = 3000;

// Configura as conexões
const app = express();
const server = createServer(app);
const io = new Server(server);

// Rotas http
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));
app.get("/", (_, res) => res.redirect("/public/pages/login"));

// Logar
app.post("/signin", async (req, res) => {
	const user = await findUserByUsername(req.body.username);

	if (user.password !== generateHash(req.body.password))
		throw new Error("Senha incorreta");

	res.json({ token: generateToken(user) });
});

// Cadastrar
app.post("/signup", async (req, res) => {
	const user = await addUser(req.body);
	res.status(201).json({ token: generateToken(user) });
});

// Validar token
app.post("/valide", async (req, res) => {
	valideToken(req.body.token);
	res.json({ message: "ok" });
});

// Eventos Websocket
io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	socket.on("new-message", (data) => {
		const { name } = valideToken(data.token);

		io.emit("new-message", {
			message: data.message,
			name,
		});
	});

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
	});
});

// Inicializa servidor
server.listen(PORT, () => {
	console.log(`server running at port ${PORT}`);
});
