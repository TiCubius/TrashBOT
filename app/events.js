// TrashBOT / app/event.js
// VERSION: 2.15
// TiCubius <trashmates@protonmail.com>

// MODULES
const colors   = require("colors")

// SETTINGS
const database = require("./database.js")
const settings = require("../config/settings.js")

module.exports = class Events
{

	/*
	* ===
	* - DISCORD EVENTS
	* ===
	*/

	discordOnReady()
	{
		if (settings.debug)
		{
			console.log(" DISCORD".cyan, "-", "READY".green)
		}
	}

	discordOnMessage(message)
	{
		// SETTING UP THE VARIABLES
		var userid    = message.author.id
		var username  = message.author.username
		var channel   = message.channel.name
		var content   = message.content
		var createdAt = Date.now()

		// LOGGING TO CONSOLE
		console.log(" D ".cyan + ("#" + channel).green + ":" + username.green + " - " + content)
	}

	/*
	* ===
	* - TWITCH EVENTS
	* ===
	*/

	twitchOnReady()
	{
		if (settings.debug)
		{
			console.log(" TWITCH".cyan, " -", "READY".green)
		}
	}

	twitchOnMessage(channel, userstate, content, self)
	{
		// SETTING UP THE VARIABLES
		var userid    = userstate["user-id"]
		var username  = userstate["display-name"] || userstate["username"]
		var createdAt = Date.now()

		// LOGGING TO CONSOLE
		console.log(" T ".cyan + channel.green + ":" + username.green + " - " + content)
	}

	twitchOnSubscription(channel, username, method, content, userstate)
	{
		// SETTING UP THE VARIABLES
		var userid    = userstate["user-id"]
		var username  = userstate["display-name"] || userstate["username"]
		var createdAt = Date.now()

		// LOGGING TO CONSOLE
		console.log(" S ".red + channel.green + ":" + username.green + " - " + method + " / " + content)
	}

}