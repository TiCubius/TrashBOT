// TrashBOT - app/event.js
// VERSION: 2.10 [25/08/2017]
// AUTHOR: TiCubius <trashmates@protonmail.com>

// MODULES
const async    = require("async")
const request  = require("request")

// SETTINGS & DATABASE
const settings = require("../config/settings.js")
const sql      = require("../config/sql.js")
const database = require("./database.js")

module.exports = class Followers
{

	requestFollowers(offset)
	{
		if (!offset) {var offset = 0}
		request("https://api.twitch.tv/kraken/channels/" + settings.twitch.identity + "/follows/?client_id=" + settings.twitch.clientId + "&limit=100&offset=" + offset, (error, response, body) =>
		{
			// Failed to retrived the followers
			if (error || response.statusCode != "200")
			{
				return false
			}

			var parsed = JSON.parse(body).follows
			
			async.each(parsed, (follower) =>
			{
				database.query(sql.fetchUser, follower.user._id, (error, response) =>
				{
					if (!response.length || response[0].role == "Viewers")
					{
						if (error) {return false}
						else if (response.length)
						{
							database.query(sql.updateUser, ["twitch", "Follower", follower.user._id, follower.user.display_name || follower.user.name, follower.created_at, response[0].id])
						}
						else
						{
							database.query(sql.createUser, ["twitch", "Follower", follower.user._id, follower.user.display_name || follower.user.name, follower.created_at])
						}
					}
				})
			})
		})
	}

	requestAllFollowers()
	{
		request("https://api.twitch.tv/kraken/channels/" + settings.twitch.identity + "/follows/?client_id=" + settings.twitch.clientId + "&limit=1", (error, response, body) =>
		{
			// Failed to retrived the followers
			if (error || response.statusCode != "200")
			{
				return false
			}

			var followerCount = JSON.parse(body)._total
			if (followerCount > 1000) {followerCount = 1000} // Can't go above 1000. For reasons.

			for (var i = 0; i < followerCount; i+=100)
			{
				this.requestFollowers(i)
			}

		})
	}

	requestAllMembers()
	{
		request({url: "https://discordapp.com/api/guilds/" + settings.discord.serverID + "/members?limit=1000", headers: {Authorization: settings.discord.header}}, (error, response, body) =>
		{
			// Failed to retrived the members
			if (error || response.statusCode != "200")
			{
				return false
			}

			async.each(JSON.parse(body), (member, callback) =>
			{
				var role = (member.roles.indexOf("329764463790260224") == "-1")?"@everyone":"Viewers"
				database.query(sql.fetchUser, member.user.id, (error, response) =>
				{
					if (!response.length)
					{
						if (error) {return false}
						else if (response.length)
						{
							database.query(sql.updateUser, ["discord", role, member.user.id, member.user.username, member.joined_at, response[0].id])
						}
						else
						{
							database.query(sql.createUser, ["discord", role, member.user.id, member.user.username, member.joined_at])
						}
					}
				})
			})
		})
	}

}