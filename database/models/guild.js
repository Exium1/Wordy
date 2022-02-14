const mongoose = require("mongoose");
const { prefix } = require("../../utils/config");

const guildSchema = new mongoose.Schema(
	{
		_id: String,
		prefix: {
			type: String,
			default: prefix
		},
		ownerID: String,
		settings: {
			type: Object,
			default: {
				commands: {}
			}
		}
	},
	{ minimize: false }
);

module.exports = mongoose.connection.model("Guild", guildSchema);
