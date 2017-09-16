// TrashBOT / bot.js
// VERSION: 2.15
// TiCubius <trashmates@protonmail.com>

// MODULES
const colors    = require("colors")
const tmiJS     = require("tmi.js")
const discordJS = require("discord.js")
const eventsJS  = require("./app/events.js")

// SETTINGS
const settings = require("./config/settings.js")

// CLIENTS
const discord = new discordJS.Client()
const twitch  = tmiJS.client(settings.twitch)
const events   = new eventsJS()

// CONNECTING
twitch.connect()
discord.login(settings.discord.token)

// WELCOME - clear console + message
console.log("\033c")
console.log(" TRASHMATES".magenta, "/", "TrashBOT".cyan, (settings.debug? "/ " + "DEBUG MODE".red:""))
console.log(" VERSION:".magenta, "2.15".cyan)
console.log(" AUTHOR:".magenta, "TiCubius <trashmates@protonmail.com>".cyan)
console.log(" ")

// EVENTS - discord
discord.on("ready",              ()        => {events.discordOnReady()})
discord.on("message",            (message) => {events.discordOnMessage(message)})
discord.on("messageReactionAdd", () => {})
discord.on("guildMemberUpdate",  () => {})

// EVENTS - twitch
twitch.on("message",      (channel, userstate, content, self)             => {events.twitchOnMessage(channel, userstate, content, self)})
twitch.on("subscription", (channel, username, method, content, userstate) => {events.twitchOnSubscription(channel, username, method, content, userstate)})
twitch.on("connected",    ()                                              => {events.twitchOnReady()})
 