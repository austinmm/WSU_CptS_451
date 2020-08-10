const Pool = require("pg").Pool;
const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "CptS451_TermProject",
	password: "v4sNzfzyE2qLcb6mqo7v7BXT",
	port: 5432
});

module.exports = pool;
