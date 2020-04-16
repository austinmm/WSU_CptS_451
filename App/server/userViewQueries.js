const pool = require("./config.js");

const getUserIDs = (request, response) => {
	const sql_query = `
		SELECT yelper.user_id
		FROM yelper
		WHERE yelper.user_name LIKE '${request.query.user_name + '%'}';
	`;
	console.log(sql_query);
	pool.query(
        sql_query,
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

const getUser = (request, response) => {
	const sql_query = `
		SELECT *
		FROM yelper
		WHERE yelper.user_id = '${request.query.user_id}';
	`;
	console.log(sql_query);
	pool.query(
        sql_query,
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

const updateUserLocation = (request, response) => {
	const sql_query = `
		UPDATE yelper
		SET longitude = ${request.query.long}, latitude = ${request.query.lat}
		WHERE user_id = '${request.query.user_id}';
	`;
	console.log(sql_query);
	pool.query(
        sql_query,
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json('');
		}
	);
};

const getFriends = (request, response) => {
	const sql_query = `
		SELECT * 
        FROM yelper
        WHERE yelper.user_id IN (
            SELECT DISTINCT friendship.friend_id FROM friendship where friendship.user_id='${request.query.user_id}'
		)
		ORDER BY yelper.user_name ASC;
	`;
	console.log(sql_query);
	pool.query(
        sql_query,
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

const getFriendsTips = (request, response) => {
	const sql_query = `
		SELECT yelper.user_name, business.business_name, business.city, tip.tip_text, tip.date_created 
		FROM friendship, yelper, tip, business
		WHERE friendship.user_id = '${request.query.user_id}'
			AND yelper.user_id = friendship.friend_id
			AND tip.user_id = friendship.user_id
			AND business.business_id = tip.business_id
		ORDER BY tip.date_created DESC;
	`;
	console.log(sql_query);
	pool.query(
		sql_query,
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

module.exports = {
	getUserIDs,
	getUser,
	updateUserLocation,
	getFriends,
	getFriendsTips
};
