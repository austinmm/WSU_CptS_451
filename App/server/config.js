const Pool = require("pg").Pool;
const pool = new Pool({
	user: "noahtaylor",
	host: "localhost",
	database: "cpts451_termproject",
	password: "none",
	port: 5432
});

module.exports = pool;
