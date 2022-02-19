const { prefix } = require("../utils/config");
const gameModel = require("../database/models/game");
const collections = require("../utils/collections");

var { hasBotPermissions } = require("../utils/functions");

module.exports = async (client, msg) => {
	if (msg.channel.type !== 0) return; // Return DM's
	if (msg.author.bot) return;
	if (msg.channel.guild && !msg.channel.permissionsOf(client.user.id).has("sendMessages")) return;

	var wordleRegex = /(Wordle )[0-9]{3} ([1-6]|X)\/6\n/;
	var wordlePrefix = msg.content.match(wordleRegex);
	var squareCount = msg.content.match(/(🟩|🟨|⬛)/g);

	if (wordlePrefix) wordlePrefix = wordlePrefix[0];
	if (squareCount) squareCount = squareCount.length;

	// Handle Wordle submission
	if (wordlePrefix && squareCount > 0 && squareCount % 5 == 0) {
		var wordleNumber = wordlePrefix.match(/[0-9]{3}/)[0];
		var wordleGuesses = wordlePrefix.match(/([1-6]|X)\/6/)[0];

		wordleGuesses = wordleGuesses.split("/")[0];

		if (wordleGuesses == "X") wordleGuesses = 7;

		var userWordle = await gameModel.findOne({ userID: msg.author.id, wordleNumber: wordleNumber });

		if (!userWordle) {
			userWordle = await new gameModel({
				userID: msg.author.id,
				guildIDs: [msg.guild.id],
				wordleNumber: wordleNumber,
				guesses: wordleGuesses,
				points: 7 - wordleGuesses,
				submitTime: new Date()
			});

			await userWordle.save();

			await msg.addReaction("🟩");
		} else if (!userWordle.guildIDs.includes(msg.guild.id)) {
			userWordle.guildIDs.push(msg.guild.id);

			await userWordle.updateOne({
				guildIDs: userWordle.guildIDs
			});

			await msg.addReaction("🟨");
		} else {
			await msg.addReaction("🟥");
		}
	}

	var msgArray = msg.content.split(/ +/); // Array of words in the message
	var commandName = [...msgArray].shift().toLowerCase().slice(prefix.length); // Clones msgArray and gets the command name from the 1st arg

	if (!commandName) return;

	var command = await collections.commands.get(commandName);

	if (!command) command = await collections.commands.get(collections.aliases.get(commandName));

	if (command) {
		if (command.ownerOnly && msg.author.id !== ownerID) return;

		commandName = command.name.toLowerCase();

		var args = msg.content.toLowerCase().split(/ +/).slice(1);

		// Send the help embed if the command's help options are reached
		if (
			(args[0] == "help" && command.helpOptions.helpArg == true) ||
			(args[0] == null && command.helpOptions.noArgs == true)
		) {
			// Require only basic perms for help embeds
			var textPerms = await hasBotPermissions(["sendMessages", "embedLinks"], msg.channel, true);

			return;

			if (textPerms.length > 0) return;
			else return msg.channel.createMessage({ embeds: [await command.helpEmbed(prefix, msg.guild.language)] });
		}

		// Check if bot has necessary permissions for the command
		var missingBotPerms = await hasBotPermissions(command.botPermissions, msg.channel, true);

		if (missingBotPerms.length > 0) return;

		console.log(`${command.name.toUpperCase()} COMMAND`);

		try {
			await command.run(client, msg);
		} catch (err) {
			console.log(`${err}`);
		}
	}

	return;
};
