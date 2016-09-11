// TM/discord/app.js
// VERSION 2.01/11.09.2016
// AUTHOR: TiCubius

var routes = require('./lib/routes')
var Discordie = require('discordie')

var Client = new Discordie({autoReconnect: true})
routes(Client)
