const gameModel = require("../database/models/game");

module.exports = {
	hasBotPermissions: async function (permsNeeded, channel, respond = false) {
		var botPermissions = channel.permissionsOf(channel.guild.me);
		var permsMissing = [];

		await permsNeeded.forEach((perm) => {
			if (botPermissions.has(perm) == false) permsMissing.push(perm);
		});

		if (respond && !permsMissing.includes("sendMessages")) {
			if (permsMissing.length > 1) {
				channel.error(
					await module.exports.translate("commands.missingPerms", channel.guild.language, {
						permsMissing
					})
				);
			} else if (permsMissing.length == 1) {
				channel.error(
					await module.exports.translate("commands.missingPerm", channel.guild.language, {
						permsMissing: permsMissing[0]
					})
				);
			}
		}

		return permsMissing.length == 0 ? true : permsMissing;
	},

	addPlayerPoints: async function (games) {
		var players = {};

		for (var i = 0; i < games.length; i++) {
			var game = games[i];

			if (!players[game.userID]) players[game.userID] = game.points;
			else players[game.userID] += game.points;
		}

		return players;
	},

	sortObjectToArray: async function (object, descending = true) {
		var sortedArray = [];

		for (var i = 0; i < Object.keys(object).length; i++) {
			var key = Object.keys(object)[i];
			sortedArray.push([key, object[key]]);
		}

		sortedArray.sort(function (a, b) {
			return b[1] - a[1];
		});

		return sortedArray;
	}
};
