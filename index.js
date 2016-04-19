// --| DISCORD-BOT
// -| AUTHOR: TiCubius
// -| VERSION: 1.10 [17/04/2016]

// --| DEPENDENCIES
var discordClient	= require('discord.js');
var config 			= require('./config/config.json');
var YTVideo 		= require('./app/youtube/video.js').YTVideo;

var YouTube = new YTVideo();
var _BOT = new discordClient.Client();

_BOT.on("message", function(message){

	var recievedMessage = message.content.split(' ');
	if(recievedMessage[0] === '/video:get')
	{
		_BOT.deleteMessage(message);
		YouTube.get(message.content, function(videos){
			videos.forEach(function(video){
				_BOT.sendMessage(message, "[BOT][" + message.author + "] - REQUESTED VIDEO: " + video.title + " - " + video.username + " " + video.url);
			})
		});
	}
	else if(recievedMessage[0] === '/video:add')
	{
		_BOT.deleteMessage(message);
		YouTube.add(recievedMessage[1], message.author, function(video){
			_BOT.sendMessage(message, "[BOT][" + message.author + "] - VIDEO ADDED: " + video.title + " - " + video.username + " " + recievedMessage[1]);
		});		
	}
	else if (recievedMessage[0] === '/chat:clear' || recievedMessage[0] === '/clear:chat')
	{
		_BOT.getChannelLogs(message.channel, 100, function(error, messages){
			messages.forEach(function(message){
				_BOT.deleteMessage(message);
			});
		});
		_BOT.sendMessage(message, "[BOT][" + message.author + "] - Channel has been cleared.");		
	}

});
_BOT.login(config.discord.username, config.discord.password);