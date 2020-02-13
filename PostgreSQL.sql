CREATE TABLE User(
    -- Unique primary key
    user_id CHAR(22),
    -- The name of the user
    name VARCHAR(30) NOT NULL,
    -- Null means the user has not reviewed any businesses
    average_stars REAL CHECK (average_stars>=1.0),
    -- The date the user created their yelp account
    yelping_since DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- The number of fans the user has
    fans INTEGER DEFAULT 0 CHECK (fans>=0),
    -- The number of users who found this user's tips 'cool'
    cool INTEGER DEFAULT 0 CHECK (cool>=0),
    -- The number of users who found this user's tips 'useful'
    useful INTEGER DEFAULT 0 CHECK (useful>=0),
    -- The number of users who found this user's tips 'funny'
    funny INTEGER DEFAULT 0 CHECK (funny>=0),
    -- The longitude of the user's location
    longitude DECIMAL(13,6) NOT NULL,
    -- The latitude of the user's location
    latitude DECIMAL(13,6) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE Business(
    business_id CHAR(22),
    name VARCHAR(100) NOT NULL,
    -- The number of stars the business has, if null then the business doesn't have any yet
    stars REAL CHECK (stars>=1.0 AND stars<=4.0),
    -- The address of the business
    address CHAR(30) NOT NULL,
    -- The city the business is located in
    city VARCHAR(30) NOT NULL,
    -- The postal code the business is located in
    postal_code CHAR(5) NOT NULL,
    -- The state the business is located in
    state CHAR(2) NOT NULL,
    -- The longitude of the business's location
    longitude DECIMAL(13,6) NOT NULL,
    -- The latitude of the business's location
    latitude DECIMAL(13,6) NOT NULL,
    -- A Boolean to represent if the business is open or not
    is_open BOOLEAN DEFAULT FALSE NOT NULL,
    PRIMARY KEY (business_id)
);

CREATE TABLE Business_Hours(
    business_id CHAR(22),
    -- This is the name of the day of the week (i.e. monday, tuesday, ...)
    day CHAR(10) NOT NULL,
    -- time [ (p) ] with time zone (aliases: timetz) -> time of day, including time zone 
    opens_at timetz NOT NULL,
    -- time [ (p) ] with time zone (aliases: timetz)-> time of day, including time zone
    closes_at timetz NOT NULL,
    PRIMARY KEY (day, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id) ON DELETE CASCADE
);

CREATE TABLE Business_Category(
    business_id CHAR(22),
    -- The category assigned to the business
    category VARCHAR(30) NOT NULL,
    PRIMARY KEY (category, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id) ON DELETE CASCADE
);

CREATE TABLE Tip(
    user_id CHAR(22),
    business_id CHAR(22),
    -- timestamp [ (p) ] with time zone	(aliases: timestamptz) ->	date and time, including time zone
    date_created timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- The number of likes the tip has recieved by users
    like_count INTEGER DEFAULT 0 NOT NULL,
    -- The content of the message
    message TEXT NOT NULL, 
    PRIMARY KEY (user_id, business_id, date_created),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES Business(business_id) ON DELETE CASCADE
);