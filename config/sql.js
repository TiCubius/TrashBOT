// TrashBOT - config/sql.js
// VERSION: 2.10 [25/08/2017]
// AUTHOR: TiCubius <trashmates@protonmail.com>

const sql =
{
	"fetchUser":    "SELECT * FROM Users WHERE ? IN (userid);",
	"fetchCommand": "SELECT * FROM Commands WHERE command = ? ORDER BY RAND() LIMIT 1;",

	"createUser":    "INSERT INTO Users SET type=?, role=?, userid=?, username=?, created_at=?;",
	"createMessage": "INSERT INTO Messages SET userid=?, username=?, type=?, channel=?, content=?;",

	"updateUser": "UPDATE Users SET type=?, role=?, userid=?, username=?, updated_at=? WHERE id=?;"
}

module.exports = sql
