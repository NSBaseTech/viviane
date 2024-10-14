const jwt = require("jsonwebtoken");

const SECRET = "poggetti";

function generateToken(payload) {
	return jwt.sign(payload, SECRET, { expiresIn: "1d" });
}

function valideToken(token) {
	return jwt.verify(token, SECRET);
}

module.exports = {
	generateToken,
	valideToken,
};
