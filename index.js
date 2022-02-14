const Eris = require("eris");
const { botToken } = require("./utils/config");
const client = new Eris(botToken);

require("./helpers/extenders");
require("./handlers/command")(client);
require("./handlers/event")(client);
require("./database/connect")(); // Connect to database

client.connect();
