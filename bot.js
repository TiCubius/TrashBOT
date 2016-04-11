var async 			= require('async');
var discord			= require('discord.js');
var config			= require('./cfg/config.json');
var achievements 	= require('./cfg/achievements.json');
var achievementsNb  = 6;

var bot = new discord.Client();
console.log("[DISCORD-BOT] - LOADED!");

bot.on("message", function(message){
	debug(message);

	if(message.content === "/get:achievements" || message.content === "/get:success")
	{
		getRandomAchievement(message, achievements, 3)
	}

	if(message.content === "/clear:chat")
	{
		clearChat(message);
	}
});
bot.login(config.discord.username, config.discord.password);

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