const pool = require("./config.js");

const getUserIDs = (request, response) => {
	pool.query(
        `
        SELECT yelper.user_id
        FROM yelper
        WHERE yelper.user_name LIKE '${request.query.user_name + '%'}';
        `,
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

const getUser = (request, response) => {
	pool.query(
        `
        SELECT *
        FROM yelper
        WHERE yelper.user_id = '${request.query.user_id}';
        `,
		(error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows);
		}
	);
};

const getFriends = (request, response) => {
	pool.query(
        `
        SELECT yelper.user_name, total_likes, average_stars, yelping_since 
        FROM yelper
        WHERE yelper.user_id IN (
            SELECT DISTINCT friendship.friend_id FROM friendship where friendship.user_id='${request.query.user_id}'
        );
        `,
		(error, results) => {
			if (error) {
				throw error;
			}
			console.log(results);
			response.status(200).json(results.rows);
		}
	);
};

const getFriendsTips = (request, response) => {
	pool.query(
		`
		SELECT yelper.user_name, business.business_name, business.city, tip.tip_text, tip.date_created 
		FROM yelper INNER JOIN tip ON yelper.user_id=tip.user_id INNER JOIN business ON tip.business_id=tip.business_id
		WHERE tip.user_id IN (
			SELECT DISTINCT friendship.friend_id FROM friendship where friendship.user_id='${request.query.user_id}'
		);
        `,
		(error, results) => {
			if (error) {
				throw error;
			}
			console.log(results.rows);
			response.status(200).json(results.rows);
		}
	);
};

module.exports = {
	getUserIDs,
	getUser,
	getFriends,
	getFriendsTips
};
