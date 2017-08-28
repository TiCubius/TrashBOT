// TrashBOT - app/event.js
// VERSION: 2.10 [25/08/2017]
// AUTHOR: TiCubius <trashmates@protonmail.com>

// MODULES
const colors   = require("colors")

// SETTINGS & DATABASE
const database = require("./database.js")
const sql      = require("../config/sql.js")

module.exports = class Events
{

	onModified(type, role, userid, username)
	{
		if (!type || !role || !userid || !username) {return false}

		// Checking if the userid exists.
		database.query(sql.fetchUser, [userid], (error, results) =>
		{
			if (error) {console.error("ERROR - onModified:fetchingUser".magenta, error); return false}

			// Yes, the userid is already registered
			if (results.length == 1)
			{
				var user = results[0]

				// We then modify the user
				database.query(sql.updateUser, [type, role, userid, username, new Date(), user.id], (error) =>
				{
					if (error) {console.error("ERROR - onModified:modifyingUser".magenta, error); return false}
				})
			}
			// Nope, we don't know this userid
			else
			{
				// So we add this user to the database
				database.query(sql.createUser, [type, role, userid, username, new Date()], (error, results) =>
				{
					if (error) {console.error("ERROR - onMessage:creatingUser".magenta, error); return false}
				})
			}
		})
	}

	onMessage(type, userid, username, channel, message, created_at)
	{
		if (type == "discord")
		{
			channel = "#" + channel
		}

		console.log(" M".magenta + " " + (new Date().toISOString()).green + " - " + type.magenta + channel.cyan + " - " + username.yellow + ": " + message)

		// Checking if the userid exists.
		database.query(sql.fetchUser, [userid], (error, results) =>
		{
			if (error) {console.error("ERROR - onMessage:fetchingUser".magenta, error); return false}

			// Yes, the userid is already registered
			if (results.length == 1)
			{
				var user = results[0]

				// We then add the message to the database
				database.query(sql.createMessage, [user.id, username, type, channel, message], (error) =>
				{
					if (error) {console.error("ERROR - onMessage:creatingMessage".magenta, error); return false}
				})
			}
			// Nope, we don't know this userid
			else
			{
				// So we add this user to the database
				database.query(sql.createUser, [type, "Viewers", userid, username, created_at], (error, results) =>
				{
					if (error) {console.error("ERROR - onMessage:creatingUser".magenta, error); return false}

					// And then add the message to the database
					database.query(sql.createMessage, [results.insertId, username, type, channel, message], (error) =>
					{
						if (error) {console.error("ERROR - onMessage:creatingMessage".magenta, error); return false}
					})
				})
			}
		})
	}

	onSubscription(type, userid, username, channel)
	{
		// Checking if the userid exists.
		database.query(sql.fetchUser, [userid], (error, results) =>
		{
			if (error) {console.error("ERROR - onMessage:fetchingUser".magenta, error); return false}

			// Yes, the userid is already registered
			if (results.length == 1)
			{
				var user = results[0]

				// We then add the message to the database
				database.query(sql.updateUser, [type, "Subscriber", userid, username, new Date(), user.id], (error, results) =>
				{
					if (error) {console.error("ERROR - onMessage:updatingUser".magenta, error); return false}
				})
			}
			// Nope, we don't know this userid
			else
			{
				// So we add this user to the database
				database.query(sql.createUser, [type, "Subscriber", userid, username, new Date()], (error, results) =>
				{
					if (error) {console.error("ERROR - onMessage:creatingUser".magenta, error); return false}
				})
			}
		})
	}

	onCommand(message, callback)
	{
		var command = message.split(" ")[0]

		// Checking if this is a command
		if (command[0] === "!")
		{
			// We check in the database
			database.query(sql.fetchCommand, [command], (error, response) =>
			{
				if (error) {console.error("ERROR - onCommand:checkingDatabase".magenta, error); return false}

				if (response.length) callback(true, response[0].return)
				else                 callback(false, "")
			})
		}
		else callback(false, "")
	}

}