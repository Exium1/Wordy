const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		_id: String,
		options: {
			type: Object,
			default: {}
		}
	},
	{ minimize: false }
);

module.exports = mongoose.connection.model("Users", userSchema);
