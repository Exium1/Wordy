module.exports = async (client) => {
	client.editStatus("online", { name: "Wordle | w!help", type: 0 });

	console.log(`\n>>> ${client.user.username} is ready at ${new Date(client.startTime)}\n`);
};
