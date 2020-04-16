CREATE TABLE Yelper(
    -- Unique primary key
    user_id CHAR(22),
    -- The name of the user
    user_name VARCHAR(50) NOT NULL,
    -- Null means the user has not reviewed any businesses
    average_stars REAL CHECK (average_stars<=5.0 AND average_stars>=1.0),
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
    longitude DECIMAL(13,6), --NOT NULL,
    -- The latitude of the user's location
    latitude DECIMAL(13,6), --NOT NULL,
    -- The total number of likes for the user’s tips
    total_likes INT DEFAULT 0 NOT NULL CHECK (total_likes>=0),
    -- The number of tips that user wrote for various businesses
    tip_count INT DEFAULT 0 NOT NULL CHECK (tip_count>=0),
    PRIMARY KEY (user_id)
);

CREATE TABLE Friendship(
    -- Unique primary key
    user_id CHAR(22),
    -- Unique primary key
    friend_id CHAR(22),
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (friend_id) REFERENCES Yelper(user_id) ON DELETE CASCADE
);

CREATE TABLE Business(
    business_id CHAR(22),
    business_name VARCHAR(100) NOT NULL,
    -- The number of stars the business has, if null then the business doesn't have any yet
    stars REAL CHECK (stars>=0.0 AND stars<=5.0) NOT NULL,
    -- The address of the business
    address VARCHAR(100) NOT NULL,
    -- The city the business is located in
    city VARCHAR(40) NOT NULL,
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
    -- The number of reviews written about the business
    review_count INT DEFAULT 0 NOT NULL CHECK (review_count>=0),
    -- The number of total check-ins to the business
    num_checkins INT DEFAULT 0 NOT NULL CHECK (num_checkins>=0),
    -- The number of tips provided for the business
    num_tips INT DEFAULT 0 NOT NULL CHECK (num_tips>=0),
    PRIMARY KEY (business_id)
);

CREATE TABLE Business_Hours(
    business_id CHAR(22),
    -- This is the name of the day of the week (i.e. monday, tuesday, ...)
    day_of_week VARCHAR(10),
    -- time [ (p) ] with time zone (aliases: timetz) -> time of day, including time zone
    opens_at timetz NOT NULL,
    -- time [ (p) ] with time zone (aliases: timetz)-> time of day, including time zone
    closes_at timetz NOT NULL,
    PRIMARY KEY (day_of_week, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id) ON DELETE CASCADE
);

CREATE TABLE Business_Category(
    business_id CHAR(22),
    -- The category assigned to the business
    category VARCHAR(50),
    PRIMARY KEY (category, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id) ON DELETE CASCADE
);

CREATE TABLE Business_Attribute(
    business_id CHAR(22),
    -- The category assigned to the business
    property VARCHAR(50),
    val VARCHAR(50) NOT NULL,
    PRIMARY KEY (property, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id) ON DELETE CASCADE
);

CREATE TABLE CheckIn(
    business_id CHAR(22),
    -- The category assigned to the business
    checkin_date timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (checkin_date, business_id),
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
    tip_text TEXT NOT NULL,
    PRIMARY KEY (user_id, business_id, date_created),
    FOREIGN KEY (user_id) REFERENCES Yelper(user_id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES Business(business_id) ON DELETE CASCADE
);
