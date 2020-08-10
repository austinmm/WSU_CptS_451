CREATE OR REPLACE FUNCTION getDistance(long1 FLOAT, lat1 FLOAT, long2 FLOAT, lat2 FLOAT) RETURNS FLOAT AS $$
    SELECT 3961* 2 * asin(sqrt((sin(radians((lat2 - lat1) / 2))) ^ 2 + cos(radians(lat1)) * cos(radians(lat2)) * (sin(radians((long2 - long1) / 2))) ^ 2))
$$ LANGUAGE SQL;

