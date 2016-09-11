// TM/discord/lib/discord_bot_controller.js
// VERSION 2.01/11.09.2016
// AUTHOR: TiCubius

var bot = require("./discord_bot")

module.exports.getAuthorVoiceChannel = (e, callback) => {
  return e.message.author.getVoiceChannel(e.message.channel.guild)
}
module.exports.connectToVoiceChannel = (e, callback) => {
  this.getAuthorVoiceChannel(e).join()
  callback()
}
module.exports.leaveVoiceChannel = (e, callback) => {
  this.getAuthorVoiceChannel(e).leave()
}

module.exports.routes = (Client, e) => {
  var splitCommand = e.message.content.substring(1).split(" ")

  this.connectToVoiceChannel(e, () => {
    if (splitCommand[0] == "madd" ) { bot.addMusic (Client, e) }
    if (splitCommand[0] == "mplay") { bot.playMusic(Client, e) }
    if (splitCommand[0] == "mskip") { bot.skipMusic(Client, e) }
  })
  if (splitCommand[0] == "mstop") {
    bot.stopMusic(Client, e)
    bot.clearAll(Client, e)
    this.leaveVoiceChannel(e)
  }
}
