const { PrismaClient } = require("@prisma/client");
const { generateHash } = require("./hash");

const prismaClient = new PrismaClient();

function addUser(data) {
	data.password = generateHash(data.password);
	return prismaClient.user.create({ data });
}

function findUserByUsername(username) {
	return prismaClient.user.findUniqueOrThrow({
		where: { username },
	});
}

module.exports = {
	addUser,
	findUserByUsername,
};
