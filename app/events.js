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
	* - Database Logging
	* ===
	*/

	logMessage(type, messageId, userid, channel, username, content, date)
	{
		database.query("INSERT INTO Messages SET messageId=?, type=?, userid=?, channel=?, username=?, content=?, createdAt=?", [messageId, type, userid, channel, username, content, date], (errors, results) =>
		{
			if (errors && settings.debug)
			{
				console.error(" LM ".red + errors)
				return
			}
		})
	}

	logUser(type, role, userid, username, date)
	{
		database.query("SELECT * FROM Users WHERE userid=?", [userid], (errors, results) =>
		{
			if (errors && settings.debug)
			{
				console.error(" LU ".red + errors)
				return
			}

			// CHECK IF USER EXISTS
			if (results.length)
			{
				database.query("UPDATE Users SET role=?, username=?, updatedAt=?", [role, username, date], (errors, results) =>
				{
					if (errors && settings.debug)
					{
						console.error(" LU ".red + errors)
						return
					}
				})
			}
			else 
			{
				database.query("INSERT INTO Users SET type=?, role=?, userid=?, username=?, createdAt=?, updatedAt=?", [type, role, userid, username, date, date], (errors, results) =>
				{
					if (errors && settings.debug)
					{
						console.error(" LU ".red + errors)
						return
					}
				})
			}
		})
	}

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

	discordOnGuildMemberAdd(newMember)
	{
		// SETTING UP THE VARIABLES
		var type      = "discord"
		var role      = newMember.highestRole.name
		var userid    = newMember.user.id
		var username  = newMember.user.username
		var date      = Date.now()

		// LOGGING TO CONSOLE
		console.log(" D ".cyan + "NEW MEMBER".green + ":" + username.green)

		// LOGGING TO DATABASE
		this.logUser(type, role, userid, username, date)
	}

	discordOnGuildMemberUpdate(oldMember, newMember)
	{
		// We only want to update the user if is real username or is highest role has chaned.
		if ((oldMember.highestRole != newMember.highestRole) || (oldMember.user.username != newMember.user.username))
		{
			// SETTING UP THE VARIABLES
			var type      = "discord"
			var role      = newMember.highestRole.name
			var userid    = newMember.user.id
			var username  = newMember.user.username
			var date      = Date.now()

			// LOGGING TO CONSOLE
			console.log(" D ".cyan + "UPDATED MEMBER".green + ":" + username.green)

			// LOGGING TO DATABASE
			this.logUser(type, role, userid, username, date)
		}
	}

	discordOnMessage(message)
	{
		// SETTING UP THE VARIABLES
		var type      = "discord"
		var messageId = message.id
		var userid    = message.author.id
		var channel   = message.channel.name
		var username  = message.member.displayName // We don't want the actual username of the message's author. He might have changed it for this message.
		var content   = message.cleanContent
		var date      = Date.now()

		// LOGGING TO CONSOLE
		console.log(" D ".cyan + ("#" + channel).green + ":" + username.green + " - " + content)

		// LOGGING TO DATABASE
		this.logMessage(type, messageId, userid, ("#" + channel), username, content, date)
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
		var type      = "twitch"
		var messageId = userstate["id"]
		var userid    = userstate["user-id"]
		var username  = userstate["display-name"] || userstate["username"]
		var date      = Date.now()

		// LOGGING TO CONSOLE
		console.log(" T ".cyan + channel.green + ":" + username.green + " - " + content)

		// LOGGING TO DATABASE
		this.logMessage(type, messageId, userid, channel, username, content, date)
	}

	twitchOnSubscription(channel, username, method, content, userstate)
	{
		// SETTING UP THE VARIABLES
		var userid    = userstate["user-id"]
		var username  = userstate["display-name"] || userstate["username"]
		var date      = Date.now()

		// LOGGING TO CONSOLE
		console.log(" S ".red + channel.green + ":" + username.green + " - " + method + " / " + content)
	}

}
