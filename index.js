// --| DISCORD-BOT
// -| AUTHOR: TiCubius
// -| VERSION: 1.11 [17/04/2016]

// --| DEPENDENCIES
var colors						= require('colors');
var discordClient				= require('discord.js');
var moment 						= require('moment');
var config 						= require('./config/config.json');
var YouTubeVideo 				= require('./app/youtube/video.js').YouTubeVideo;

// --| VARIABLES, CLIENTS AND REGEX
var _BOT 						= new discordClient.Client();
var YouTubeVideo 				= new YouTubeVideo();
var REGEX_IsAYouTubeLink 		= new RegExp(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
var REGEX_IsVideoAuthorDefined 	= new RegExp(/^\[\[.*\]\]$/);

console.log('Discord-BOT v1.11, an usless bot for discord, built in NodeJS.'.blue)
console.log('');
console.log('Discord: connecting to server'.green);

_BOT.on("message", function(message){
	console.log('['.blue + moment().format("DD/MM/YYYY | HH:MM:SS").blue + ']['.blue + message.author.username.blue + '] '.blue + message.content);
	
	var messageArray = message.content.split(' ');
	if(messageArray[0].match(REGEX_IsAYouTubeLink))
	{
		_BOT.deleteMessage(message);
		var id = messageArray[0].substring(messageArray[0].indexOf("=") + 1); // YT VIDEO ID
		YouTubeVideo.add(id, message.author.username, function(data)
		{
			_BOT.sendMessage(message, '[BOT][' + message.author + '] - ADDING NEW VIDEO: ' + data.title + ' - by: ' + data.author + ' { ' + data.url + ' }');
		});
	}
	if(messageArray[0] === '/get')
	{
		_BOT.deleteMessage(message);

		var videoAuthor = (messageArray[1].match(REGEX_IsVideoAuthorDefined)) ? messageArray[1].replace('[[', '').replace(']]', '') : null;
		var videoTitle 	= (videoAuthor) ? message.content.replace('/get [[' + videoAuthor + ']]', '') : message.content.replace('/get ', '');

		YouTubeVideo.get(videoTitle, videoAuthor, function(videos){
			if(videos.length >= 1)
			{
				videos.forEach(function(video){
					_BOT.sendMessage(message, "[BOT][" + message.author + "] - REQUESTED VIDEO: " + video.video_title + " - " + video.video_author + " { https://www.youtube.com/watch?v=" + video.video_id + ' }');
				});
			}
			else
			{
				_BOT.sendMessage(message, "[BOT][" + message.author + "] - NO VIDEO FOUND");
			}
		});
	}
	if(messageArray[0] === '/clear:chat' || messageArray[0] === '/chat:clear' || messageArray[0] === '/clear')
	{
		_BOT.deleteMessage(message);
		_BOT.getChannelLogs(message.channel, 100, function(error, messages){
			messages.forEach(function(message){
				_BOT.deleteMessage(message);
			});
		});
		_BOT.sendMessage(message, "[BOT][" + message.author + "] - Channel has been cleared.");			
	}
	if(messageArray[0] === '/help')
	{

		_BOT.deleteMessage(message);
		_BOT.sendMessage(message, '[BOT][' + message.author + '] - Howdy ! I\'m @!trashBOT.');
		_BOT.sendMessage(message, '[BOT][' + message.author + '] - Send a "https://youtube.com/watch?v=" link to add a new video to the database');
		_BOT.sendMessage(message, '[BOT][' + message.author + '] - Send "/get [[USERNAME]]" to get a video from the database from this username');
		_BOT.sendMessage(message, '[BOT][' + message.author + '] - Send "/get title of the video" to get a video from the database'); 
		_BOT.sendMessage(message, '[BOT][' + message.author + '] - Send "/get [[USERNAME]] title of the video" to get a video from the database with this title and from this username');
		_BOT.sendMessage(message, '[BOT][' + message.author + '] - Send "/clear:chat" or "/chat:clear" or "/clear" to clear this channel');
		_BOT.sendMessage(message, '[BOT][' + message.author + '] - Send "/help" to see this again.');
		
	}

});
_BOT.login(config.discord.username, config.discord.password);
console.log('Discord: connected'.green);
console.log('');