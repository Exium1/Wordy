const Eris = require("eris");
const { botToken } = require("./utils/config");
const client = new Eris(botToken, {
	intents: ["guilds", "guildMembers", "guildMessages", "guildMessageReactions"]
});

require("./helpers/extenders");
require("./handlers/command")(client);
require("./handlers/event")(client);
require("./database/connect")(); // Connect to database

client.connect();
