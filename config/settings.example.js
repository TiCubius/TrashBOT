// TrashBOT - config/settings.example.js
// VERSION: 2.10 [25/08/2017]
// AUTHOR: TiCubius <trashmates@protonmail.com>

const settings = 
{

	database:
	{
		host:     "localhost",
		user:     "root",
		password: "root",
		database: "trashbot"
	},

	discord:
	{
		serverID:  "123456789",
		messageID: "123456789",

		token:  "TOKEN-TOKEN",
		header: "Bot TOKEN-TOKEN" // https://discordapp.com/developers/docs/reference
	},

	twitch:
	{
		options: {debug: false},
		clientId: "",
		connection:
		{
			reconnect: true,
			secure: true
		},
		identity:
		{
			username: "username",
			password: "password"
		},
		channels: ["#username"]
	}

}

module.exports = settings