CREATE DATABASE milestone1db;
\c milestone1db
CREATE TABLE Business(
    business_id CHAR(22),
    -- The name of the business
    name VARCHAR(100) NOT NULL,
    -- The city the business is located in
    city VARCHAR(20) NOT NULL,
    -- The state the business is located in
    state CHAR(2) NOT NULL,
    PRIMARY KEY (business_id)
);
-- /Users/austinmarino/Desktop
\copy Business(business_id,name,state,city) FROM '<path>/WSU_CptS_451/milestone1_data/milestone1.csv' DELIMITER ',' CSV