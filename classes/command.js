const path = require("path");
const Embed = require("./embed");

class Command {
	constructor({
		name = null,
		aliases = new Array(),
		desc = null,
		botPermissions = new Array(),
		memberPermissions = new Array(),
		helpOptions = {
			helpArg: true,
			noArgs: true
		},
		defaultSettings = new Object(),
		category = false,
		enabled = true,
		guildOnly = true,
		ownerOnly = false,
		allowNoPrefix = false
	}) {
		this.name = name;
		this.aliases = aliases;
		this.desc = desc;
		this.botPermissions = botPermissions;
		this.memberPermissions = memberPermissions;
		this.helpOptions = helpOptions;
		this.category = category ? category.split(path.sep)[parseInt(category.split(path.sep).length - 1, 10)] : false;
		this.enabled = enabled;
		this.guildOnly = guildOnly;
		this.ownerOnly = ownerOnly;
		this.allowNoPrefix = allowNoPrefix;
		this.defaultSettings = Object.assign(
			{
				cooldown: 0,
				whitelist: [],
				blacklist: [],
				mode: "blacklist",
				enabled: true
			},
			defaultSettings
		);
	}
}

module.exports = Command;
