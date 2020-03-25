-- "num_tips" should be updated to the number of tips provided for that business.
UPDATE Business
SET num_tips = Tips.tip_count
    FROM (SELECT Tip.business_id, COUNT(Tip.business_id) AS tip_count FROM Tip GROUP BY (Tip.business_id)) AS Tips
WHERE Business.business_id = Tips.business_id;

-- "num_checkins" value for a business should be updated to the count of all check-in counts for that business.
UPDATE Business
SET num_checkins = CheckIns.checkin_count
    FROM (SELECT CheckIn.business_id, COUNT(CheckIn.business_id) AS checkin_count FROM CheckIn GROUP BY (CheckIn.business_id)) AS CheckIns
WHERE Business.business_id = CheckIns.business_id;

-- "total_likes" value for a user should be updated to the sum of all likes for the user’s tips.
UPDATE Yelper
SET total_likes = Tips.like_count
    FROM (SELECT Tip.user_id, SUM(Tip.like_count) AS like_count FROM Tip GROUP BY (Tip.user_id)) AS Tips
WHERE Yelper.user_id = Tips.user_id;

-- "tip_count" should be updated to the number of tips that the user provided for various businesses.
UPDATE Yelper
SET tip_count = Tips.tip_count
    FROM (SELECT Tip.user_id, COUNT(Tip.user_id) AS tip_count FROM Tip GROUP BY (Tip.user_id)) AS Tips
WHERE Yelper.user_id = Tips.user_id;
