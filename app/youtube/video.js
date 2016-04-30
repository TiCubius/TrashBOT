// --| DISCORD-BOT/youtube/video.js
// -| AUTHOR: TiCubius
// -| VERSION: 1.11 [17/04/2016]

var config 	= require('../../config/config.json');
var mysql 	= require('mysql');
var moment  = require('moment');
var youtube = require('youtube-node');

var YouTubeVideo = function() {};
YouTubeVideo.prototype.get = function(videoTitle, videoAuthor, callback)
{
	var MySQL 	= mysql.createConnection({host: config.mysql.host, user: config.mysql.username, password: config.mysql.password, database: config.mysql.database});

	// CHANGING SQL DEPENDING ON [[USERNAME]]
	var query = (videoAuthor) ? ("SELECT * FROM youtube_video WHERE video_title LIKE '%" + videoTitle + "%' AND video_author LIKE '%" + videoAuthor + "%'") : ("SELECT * FROM youtube_video WHERE video_title LIKE '%" + videoTitle + "%'");

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
}

YouTubeVideo.prototype.add = function(videoID, discordUsername, callback)
{

	var data;
	var MySQL = mysql.createConnection({host: config.mysql.host, user: config.mysql.username, password: config.mysql.password, database: config.mysql.database});
	MySQL.query("SELECT * FROM youtube_video WHERE video_id=?", [videoID], function(errors, rows, fields)
	{
		if(!errors && !(rows.length)) // IF NO ERRORS && NO ENTRY IN DB
		{
			var YouTubeAPI = new youtube();

			YouTubeAPI.setKey(config.youtube.key);
			YouTubeAPI.getById(videoID, function(error, result)
			{

				data = {
					'title': result.items[0].snippet.title,
					'author': result.items[0].snippet.channelTitle,
					'url': 'https://www.youtube.com/watch?v=' + videoID
				}
				MySQL.query("INSERT INTO youtube_video SET id=?, video_id=?, video_title=?, video_author=?, created_at=?, created_by=?", ['', videoID, data.title, data.author, moment().format("DD/MM/YYYY"), discordUsername], function(errors){
					MySQL.end(function(error)
					{
						callback(data);
					});	
				});
			});
		}
		else if(!errors && rows.length)
		{
			var data = {
				'title': rows[0].video_title,
				'author': rows[0].video_author,
				'url': 'https://www.youtube.com/watch?v=' + rows[0].video_id
			};
		}
		else
		{
			console.log(errors);
		}
	});

}


exports.YouTubeVideo = YouTubeVideo;
