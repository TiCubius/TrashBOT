var discord			= require('discord.js');
var mysql			= require('mysql');
var YouTube 		= require('youtube-node');
var config			= require('./cfg/config.json');
var achievements 	= require('./cfg/achievements.json');
var achievementsNb  = 6;

var bot = new discord.Client();
var youTube = new YouTube();
youTube.setKey(config.youtube.key);
var mysqlConnect = mysql.createConnection({host: config.mysql.host, user: config.mysql.username, password: config.mysql.password, database: config.mysql.database});
console.log("[DISCORD-BOT] - LOADED!");

bot.on("message", function(message){
	debug(message);
	var command = message.content.split(" ");

	if(message.content === "/get:achievements" || message.content === "/get:success")
	{
		getRandomAchievement(message, achievements, 3)
	}

	if(message.content === "/clear:chat")
	{
		clearChat(message);
	}

	if(command[0] === "/video:youtube")
	{
		if(command[1] === "add")
		{
			videoYoutubeAdd(message, command[2]);
		}
		if(command[1] === "get")
		{
			videoYoutubeGet(message, message.content.replace('/video:youtube get', '').substr(1));
		}
	}
});
bot.login(config.discord.username, config.discord.password);
mysqlConnect.connect();

function debug(message)
{
	console.log('RECIEVED: [' + message.author.username + '] - ' + message.content);	
}

function getRandomAchievement(message, achievements, number)
{
	var given = [];
	var random = null;

	for(var i = 1; i <= number; i++)
	{
		while (given.indexOf(random) > -1 || random == null)
		{
			random = Math.floor(Math.random() * achievementsNb);
		}
		bot.sendMessage(message.channel, achievements[random].name + ": " + achievements[random].description);
		given.push(random);
	}
}

function clearChat(message)
{
	bot.getChannelLogs(message.channel, 100, function(error, messages){
		messages.forEach(function(message){
			bot.deleteMessage(message);
		});
	});
	bot.sendMessage(message, "[BOT][" + message.author + "] - Channel has been cleared.");
}

function videoYoutubeAdd(message, url)
{

	youTube.getById(url.substring(url.indexOf("=") + 1), function(error, result)
	{
		if(error)
		{
			console.log(error);
		}
		else
		{
			console.log(result.items[0].snippet);
			mysqlConnect.query("INSERT INTO youtube_video SET id=?, title=?, username=?, url=?, created_at=?, created_by=?", ['', result.items[0].snippet.title, result.items[0].snippet.channelTitle, url, '', message.author.username]);
		}
	});

}

function videoYoutubeGet(message, search)
{
	mysqlConnect.query("SELECT * FROM youtube_video WHERE title LIKE '%" + search + "%'", function(error, rows, fields){

		if(!error && rows.length >= 1)
		{
			bot.sendMessage(message, "[BOT][VIDEO:YOUTUBE/GET] - " + rows[0].url);
			return true;
		}

		bot.sendMessage(message, "[BOT] - Sorry... No video was found with those parameters :c");

	});
}