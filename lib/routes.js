// TM/discord/lib/routes.js
// VERSION 2.01/11.09.2016
// AUTHOR: TiCubius

var discordToken = "YOUR_DISCORD_TOKEN_HERE"
var botController = require('./discord_bot_controller')

module.exports = (Client) => {

  Client.connect({token: discordToken})
  Client.Dispatcher.on("GATEWAY_READY", e => {
    console.log("## TM/discord BOT loaded and connected to Discord's API.")
    console.log("## VERSION: 2.01/02.09.2016")
    console.log("## AUTHOR: TiCubius")
  })

  Client.Dispatcher.on("MESSAGE_CREATE", e => {
    console.log("<" + e.message.author.username + "> " + e.message.content)

    if (e.message.content.startsWith("!"))
    {
      botController.routes(Client, e)
    }
  })
}
