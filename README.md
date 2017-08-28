## TiCubius/TRASHBOT [VERSION: 2.10]
A discord bot, built in NodeJS thanks to discord.js

# What ?
This is a simple bot, that saves all the messages posted in a Discord server and a Twitch chat.
Every Twitch chatters/followers (up to 1000) and Discord members (up to 1000) will be registered in the database.

# How-to ?
You need to :
- Use the tables.sql to create the correct structure.
- Copy config/settings.example.js to config/settings.js
- Fill in the config/settings.js
- Launch the script the first time with the last 2 lines of bot.js uncommented (wait ~1 minute)
- Restart the script with the last 2 lines commented.