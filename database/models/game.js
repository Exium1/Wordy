const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
	{
		userID: {
			type: String,
			default: ""
		},
		guildIDs: {
			type: Array,
			default: []
		},
		wordleNumber: {
			type: Number,
			default: 0
		},
		guesses: {
			type: Number,
			default: 0
		},
		points: {
			type: Number,
			default: 0
		},
		submitTime: {
			type: Date,
			default: new Date()
		}
	},
	{ minimize: false }
);

module.exports = mongoose.model("Game", gameSchema);
