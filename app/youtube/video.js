// --| DISCORD-BOT/youtube/video.js
// -| AUTHOR: TiCubius
// -| VERSION: 1.10 [17/04/2016]

var config 	= require('../../config/config.json');
var mysql 	= require('mysql');
var moment  = require('moment');
var youtube = require('youtube-node');

var YTVideo = function() {};
YTVideo.prototype.get = function(message, callback)
{

	var MySQL 	= mysql.createConnection({host: config.mysql.host, user: config.mysql.username, password: config.mysql.password, database: config.mysql.database});
	var regex = new RegExp(/^\[\[.*\]\]$/); // IS LOOKING FOR SOMETHING LIKE [[USERNAME]]
	var messageSplit = message.split(' ');

	// SETTING  'USERNAME' && 'TITLE' VARS
	if(messageSplit[1].match(regex))
	{
		var username = messageSplit[1].replace('[[', '').replace(']]', '')
		var title 	 = message.replace('/video:get [[' + username + ']]', '').substr(1);
	}
	else
	{
		var username = false;
		var title 	 = message.replace('/video:get', '').substr(1);
	}

	// CHANGING SQL DEPENDING ON [[USERNAME]]
	var query = (username) ? ("SELECT * FROM youtube_video WHERE title LIKE '%" + title + "%' AND username LIKE '%" + username + "%'") : ("SELECT * FROM youtube_video WHERE title LIKE '%" + title + "%'");

	// MYSQL REQUEST + DATA TREATMENT
	var data = {};
	MySQL.query(query, function(error, rows, fields)
	{
		if(!error && rows.length >= 1)
		{
			data = rows;
		}
	});

	// WE USE CALLBACKS :D
	MySQL.end(function(error){
		callback(data);
	});

};


YTVideo.prototype.add = function(message, username, callback)
{

	var regex = new RegExp(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/); // IS LOOKING FOR A YOUTUBE.COM / YOUTU.BE LINK
	id = (message.match(regex)) ? message.substring(message.indexOf("=") + 1) : null; // CHECKING LINK

	if(id)
	{
		var MySQL = mysql.createConnection({host: config.mysql.host, user: config.mysql.username, password: config.mysql.password, database: config.mysql.database});

		// CHECKING IF VIDEO IS ALREADY IN DB
		MySQL.query("SELECT * FROM youtube_video WHERE url=?", [message], function(error, rows, fields){
			if(!rows.length >=1)
			{
				var YouTube = new youtube();
				var data 	= {};

				YouTube.setKey(config.youtube.key);
				YouTube.getById(id, function(error, result){
					if(!error)
					{
						data = {
							title: result.items[0].snippet.title,
							username: result.items[0].snippet.channelTitle
						};
						MySQL.query("INSERT INTO youtube_video SET id=?, title=?, username=?, url=?, created_at=?, created_by=?", ['', result.items[0].snippet.title, result.items[0].snippet.channelTitle, message, moment().format("DD/MM/YYYY"), username], function(error)
						{
							MySQL.end(function(error)
							{
								callback(data, error);
							});	
						});
					}
				});
			}
			else
			{
				data = rows[0];
				MySQL.end(function(error)
				{
					callback(data, error);
				});					
			}
		});

	}

}

exports.YTVideo = YTVideo;