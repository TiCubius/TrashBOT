// TrashBOT / app/database.js
// VERSION: 2.15
// TiCubius <trashmates@protonmail.com>

// MODULES
const mysql = require("mysql")

// SETTINGS
const settings = require("../config/settings")

// CLIENT
const db = mysql.createConnection(settings.database)

db.connect()
module.exports = db