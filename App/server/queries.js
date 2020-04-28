const pool = require("./config_n.js");

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
			//console.log(results);
			response.status(200).json(results.rows);
		}
	);
};

const getCatagories = (request, response) => {
	//console.log(request.query);
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
			//console.log(results);
			response.status(200).json(results.rows);
		}
	);
};

const getBusinesses = (request, response) => {
	queryString = `SELECT DISTINCT *
    from
        (SELECT DISTINCT *
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

	queryString += `) as allCatagories ORDER BY ${request.query.sortBy};`;
	//console.log(queryString);

	console.log("Making request");
	pool.query(queryString, (error, results) => {
		if (error) {
			throw error;
		}
		//console.log(results);
		response.status(200).json(results.rows);
	});
};

const getBusinessesWithDistance = (request, response) => {
	queryString = `SELECT DISTINCT *
    from
        (SELECT DISTINCT *, getDistance(business.longitude, business.latitude, yelper.longitude, yelper.latitude) as dist
        FROM
            business, yelper
        WHERE state='${request.query.state}' AND city='${request.query.city}' AND postal_code='${request.query.postal_code}' AND Yelper.user_id='${request.query.user_id}') as localBusinesses
    
    NATURAL JOIN (`;

	for (let catIndex in request.query.catagories) {
		if (catIndex > 0) {
			queryString += ` INTERSECT `;
		}

		queryString += ` select business_id
        from business_category
        where category = '${request.query.catagories[catIndex]}'`;
	}

	queryString += `) as allCatagories ORDER BY ${request.query.sortBy};`;
	console.log("Query string");
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
	//console.log(request.query);
	pool.query(
		`SELECT DISTINCT *
        FROM
            business
        WHERE state='${request.query.state}' AND city='${request.query.city}' AND postal_code='${request.query.postal_code}' AND business_name = '${request.query.business_name}';`,
		(error, results) => {
			if (error) {
				throw error;
			}
			//console.log(results);
			response.status(200).json(results.rows);
		}
	);
};

const getBusinessOpenCloseTime = (request, response) => {
	//console.log("Get business operating times..");
	//console.log(request.query);
	pool.query(
		`SELECT * from business_hours where business_id='${request.query.business_id}' AND day_of_week='${request.query.day_of_week}';`,
		(error, results) => {
			if (error) {
				console.log(error);
				throw error;
			}
			//console.log(results);
			response.status(200).json(results.rows);
		}
	);
};

const getBusinessCategories = (request, response) => {
	//console.log("Get business catagories..");
	pool.query(
		`SELECT DISTINCT category FROM business_category WHERE business_id='${request.query.business_id}';`,
		(error, results) => {
			if (error) {
				throw error;
			}
			//console.log(results);
			response.status(200).json(results.rows);
		}
	);
};

const getTips = (request, response) => {
	//console.log(request.query);
	pool.query(
		`SELECT * FROM tip, yelper where tip.business_id='${request.query.business_id}' AND tip.user_id = yelper.user_id ORDER BY date_created DESC;`,
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

const getTipsFromFriends = (request, response) => {
	const sql_query = `
		SELECT yelper.user_name, yelper.user_id, tip.like_count, tip.tip_text, tip.date_created 
		FROM friendship, yelper, tip, business
		WHERE friendship.user_id = '${request.query.user_id}'
			AND yelper.user_id = friendship.friend_id
			AND tip.user_id = friendship.friend_id
			AND business.business_id = tip.business_id
			AND business.business_id = '${request.query.business_id}'
		ORDER BY tip.date_created DESC;
	`;

	pool.query(sql_query, (error, results) => {
		if (error) {
			throw error;
		}

		response.status(200).json(results.rows);
	});
};

const postTip = (request, response) => {
	console.log("REQUEST QUERY");
	console.log(request.body);
	console.log(request.query);
	const queryString = `INSERT INTO Tip (user_id, business_id, tip_text) VALUES ('${request.body.user_id}','${request.body.business_id}', '${request.body.tip_text}');`;
	//console.log("QUERY STRING");
	//console.log(queryString);
	pool.query(queryString, (error, results) => {
		if (error) {
			throw error;
		}
		console.log(results.rows);
		response.status(200).json(results.rows);
	});
};

const likeTip = (request, response) => {
	//console.log("REQUEST QUERY");
	//console.log(request.body);
	const queryString = `UPDATE tip SET like_count = like_count + 1 WHERE user_id='${request.body.user_id}' AND business_id='${request.body.business_id}' AND like_count='${request.body.like_count}' AND tip_text='${request.body.tip_text}';`;
	//console.log("QUERY STRING");
	//console.log(queryString);
	pool.query(queryString, (error, results) => {
		if (error) {
			throw error;
		}
		//console.log(results.rows);
		response.status(200).json(results.rows);
	});
};

const postBusinessCheckin = (request, response) => {
	//console.log("REQUEST QUERY");
	//console.log(request.body);
	const queryString = `INSERT INTO checkin (business_id) VALUES ('${request.body.business_id}');`;
	//console.log("QUERY STRING");
	//console.log(queryString);
	pool.query(queryString, (error, results) => {
		if (error) {
			throw error;
		}
		//console.log(results.rows);
		response.status(200).json(results.rows);
	});
};

const getBusinessCheckins = (request, response) => {
	pool.query(
		`SELECT * FROM checkin where business_id='${request.query.business_id}'`,
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

const getDistance = (request, response) => {
	//console.log(request.query);

	pool.query(
		`SELECT getDistance(${request.query.long1},${request.query.lat1},${request.query.long2},${request.query.lat2});`,
		(error, results) => {
			if (error) {
				throw error;
			}
			//console.log(results.rows);
			response.status(200).json(results.rows);
		}
	);
};

module.exports = {
	getStates,
	getCities,
	getZipcodes,
	getCatagories,
	getBusinesses,
	getBusinessID,
	getBusinessOpenCloseTime,
	getBusinessCategories,
	getTips,
	getTipsFromFriends,
	postTip,
	getBusinessCheckins,
	postBusinessCheckin,
	likeTip,
	getDistance,
	getBusinessesWithDistance,
};
