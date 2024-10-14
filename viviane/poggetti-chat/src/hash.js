const crypto = require("node:crypto");

function generateHash(arg) {
	return crypto.createHash("sha256").update(arg).digest("hex");
}

module.exports = {
	generateHash,
};
