const Command = require("../../classes/command.js");
const Embed = require("../../classes/embed.js");
const gameModel = require("../../database/models/game");

var { addPlayerPoints, sortObjectToArray } = require("../../utils/functions");

class Leaderboard extends Command {
	constructor() {
		super({
			name: "leaderboard",
			aliases: ["lb"],
			desc: "Sends the server leaderboard for wordle scores submitted here.",
			category: __dirname,
			botPermissions: ["sendMessages", "embedLinks", "addReactions"],
			helpOptions: {
				helpArg: true,
				noArgs: false
			}
		});
	}

	async run(client, msg) {
		var games = await gameModel.find({ guildIDs: msg.guild.id });
		var players = await addPlayerPoints(games);
		var playersSorted = await sortObjectToArray(players);

		var playerIDs = playersSorted.map((p) => {
			return p[0];
		});

		var playerMembers = await msg.guild.fetchMembers({
			limit: playersSorted.length,
			userIDs: playerIDs
		});

		var leaderboardEmbed = new Embed().setTitle(`${msg.guild.name} Wordle Leaderboard`).setThumbnail("logo");

		for (var i = 0; i < playersSorted.length; i++) {
			var playerData = playersSorted[i];
			var playerMember;

			await playerMembers.forEach((p) => (p.id == playerData[0] ? (playerMember = p) : false));

			leaderboardEmbed.addField(playerMember.nick || playerMember.user.username, `${playerData[1]} points`);
		}

		await msg.channel.createMessage({ embed: leaderboardEmbed });
		await msg.addReaction("👍");
	}
}

module.exports = Leaderboard;
