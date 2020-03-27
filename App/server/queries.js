const pool = require("./config.js");

const getStates = (request, response) => {
	pool.query(
		"SELECT distinct state From business order by state;",
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

const getCities = (request, response) => {
	pool.query(
		`SELECT distinct city from business where state='${request.query.state}' order by city;`,
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

const getZipcodes = (request, response) => {
	pool.query(
		`SELECT distinct postal_code from business where state='${request.query.state}' AND city='${request.query.city}' order by postal_code;`,
		(error, results) => {
			if (error) {
				throw error;
			}
			console.log(results);
			response.status(200).json(results.rows);
		}
	);
};

const getCatagories = (request, response) => {
	console.log(request.query);
	pool.query(
		`SELECT DISTINCT category
        FROM
            (business NATURAL JOIN business_category)
        WHERE state='${request.query.state}' AND city='${request.query.city}' AND postal_code='${request.query.postal_code}'
        ORDER BY category;`,
		(error, results) => {
			if (error) {
				throw error;
			}
			console.log(results);
			response.status(200).json(results.rows);
		}
	);
};

const getBusinesses = (request, response) => {
	queryString = `SELECT *
    from
        (SELECT *
        FROM
            business
        WHERE state='${request.query.state}' AND city='${request.query.city}' AND postal_code='${request.query.postal_code}') as localBusinesses
    
    NATURAL JOIN (`;

	for (let catIndex in request.query.catagories) {
		if (catIndex > 0) {
			queryString += ` INTERSECT `;
		}

		queryString += ` select business_id
        from business_category
        where category = '${request.query.catagories[catIndex]}'`;
	}

	queryString += `) as allCatagories;`;
	console.log(queryString);

	console.log("Making request");
	pool.query(queryString, (error, results) => {
		if (error) {
			throw error;
		}
		console.log(results);
		response.status(200).json(results.rows);
	});
};

const getBusinessID = (request, response) => {
	console.log("Get business ID..");
	console.log(request.query);
	pool.query(
		`SELECT DISTINCT business_id
        FROM
            business
        WHERE state='${request.query.state}' AND city='${request.query.city}' AND postal_code='${request.query.postal_code}' AND business_name = '${request.query.business_name}';`,
		(error, results) => {
			if (error) {
				throw error;
			}
			console.log(results);
			response.status(200).json(results.rows);
		}
	);
};

const getTips = (request, response) => {
	console.log(request.query);
	pool.query(
		`SELECT tip_text FROM tip where business_id='${request.query.business_id}';`,
		(error, results) => {
			if (error) {
				throw error;
			}
			console.log(results.rows);
			response.status(200).json(results.rows);
		}
	);
};

const postTip = (request, response) => {
	console.log("REQUEST QUERY");
	console.log(request.body);
	const queryString = `INSERT INTO Tip (user_id, business_id, tip_text) VALUES ('${request.body.user_id}','${request.body.business_id}', '${request.body.tip_text}');`;
	console.log("QUERY STRING");
	console.log(queryString);
	pool.query(queryString, (error, results) => {
		if (error) {
			throw error;
		}
		console.log(results.rows);
		response.status(200).json(results.rows);
	});
};

module.exports = {
	getStates,
	getCities,
	getZipcodes,
	getCatagories,
	getBusinesses,
	getBusinessID,
	getTips,
	postTip
};
