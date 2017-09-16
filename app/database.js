// TrashBOT / app/database.js
// VERSION: 2.15
// TiCubius <trashmates@protonmail.com>

const mysql = require("mysql")
const settings = require("../config/settings")

const db = mysql.createConnection(settings.database)

db.connect()
module.exports = db