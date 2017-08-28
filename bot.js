// TrashBOT - bot.js
// VERSION: 2.10 [25/08/2017]
// AUTHOR: TiCubius <trashmates@protonmail.com>

// MODULES
const fs        = require("fs")
const tmijs     = require("tmi.js")
const discordjs = require("discord.js")

// SETTINGS & DATABASE
const settings = require("./config/settings.js")

// OTHER VARIABLES
var limit = 0

// CLIENTS
const discord = new discordjs.Client()
const twitch  = tmijs.client(settings.twitch)

// APP MODULES
const EventsJS    = require("./app/events.js")
const FollowersJS = require("./app/followers.js")
const Events      = new EventsJS()
const Followers   = new FollowersJS()

// WELCOME MESSAGE
console.log(" ** TM - TrashBOT")
console.log(" * VERSION - 2.10 [21/08/2017]")
console.log(" * AUTHOR  - TiCubius <trashmates@protonmail.com>")
console.log(" ** TM - Loaded")
console.log(" ")

// DISCORD:EVENTS
discord.on("message", (message) =>
{
	// LOG USER+MSG TO DATABASE
	// NOTE: Discord gives us account creation date.
	Events.onMessage("discord", message.author.id, message.author.username, message.channel.name, message.content, message.author.createdAt)

	// CHECK COMMANDS
	Events.onCommand(message.content, (isCommand, response) =>
	{
		if (isCommand && limit < 10)
		{
			limit++
			message.reply(response)
		}
	})
})

discord.on("ready", () =>
{
	// We need to clear the welcome message's reactions.
	// And add the "OK" reaction.

	discord.guilds
		.get(settings.discord.serverID).channels
		.find("name", "bienvenue")
		.fetchMessage(settings.discord.messageID)
		.then((message) =>
		{
			message.clearReactions()
			setTimeout(() => message.react("🆗"), 50)
		})
		.catch(console.error)
})

discord.on("messageReactionAdd", (reaction, user) =>
{
	// We don't want to do anything if user is the bot.
	if (discord.user.id == user.id) {return false}

	// We don't want to do anything unless it's the right message.
	if (reaction.message.id == settings.discord.messageID)
	{
		var server = discord.guilds.get(settings.discord.serverID)

		server.fetchMember(user).then((member) =>
		{
			// We search for the "VIEWERS" role
			// And then we add it to the member's role.
			member.addRole(server.roles.find("name", "Viewers"))

			// We clear the welcome message's reactions.
			reaction.message.clearReactions()

			// And add the "OK" reaction back
			setTimeout(() => reaction.message.react("🆗"), 50)
		})
		.catch(console.error)
	}

})

discord.on("guildMemberUpdate", (oldMember, newMember) =>
{
	// We only want to update him if he changed his username
	if ((oldMember.nickname != newMember.nickname) || (oldMember.highestRole.name != newMember.highestRole.name))
	{
		Events.onModified("discord", newMember.highestRole.name, newMember.id, (newMember.nickname || newMember.user.username))
	}
})


// TWITCH:EVENTS
twitch.on("message", (channel, userstate, message, self) =>
{
	// We do not want to log the message if it was sent from our tmi.js script
	// Apparently, it does not give us any user-id.
	// Meh. Not a problem.

	if (!self)
	{
		// LOG USER+MSG TO DATABASE
		// NOTE: Twitch doesn't give us account creation date.
		Events.onMessage("twitch", userstate["user-id"], (userstate["display-name"] || userstate["username"]), channel, message, new Date())

		// CHECK COMMANDS
		Events.onCommand(message, (isCommand, response) =>
		{
			if (isCommand && limit < 10)
			{
				limit++
				twitch.say("#trashmates", response)
			}
		})
	}
})

twitch.on("subscription", (channel, username, method, message, userstate) =>
{
	Event.onSubscription("twitch", userstate["user-id"], (userstate["display-name"] || userstate["username"]), channel)
})

// LOOPS - 1 MIN
setInterval(() => 
{
	// Reset command limits
	limit = 0

	// Request Twitch Followers
	Followers.requestFollowers()

}, 60000)

// CONNECT!
twitch.connect()
discord.login(settings.discord.token)

// FIRST TIME SETUP ()
// Uncomment the next 2 lines: 
// Followers.requestAllFollowers()
// Followers.requestAllMembers()