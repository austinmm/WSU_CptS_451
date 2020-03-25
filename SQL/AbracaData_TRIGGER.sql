-- Whenever a user provides a tip for a business, the "num_tips" value for that business and the “tip_count” value for the user should be updated.
CREATE OR REPLACE FUNCTION tipAdded() RETURNS trigger AS
'
BEGIN
    UPDATE Business
    SET num_tips = num_tips + 1
    WHERE Business.business_id = New.business_id;
    UPDATE Yelper
    SET tip_count = tip_count + 1
    WHERE Yelper.user_id = New.user_id;
    RETURN NEW;
END
' LANGUAGE plpgsql;

CREATE TRIGGER new_tip
AFTER INSERT On Tip
FOR EACH ROW
EXECUTE PROCEDURE tipAdded();

-- When a customer checks-in a business, the "num_checkins" attribute value for that business should be updated.
CREATE OR REPLACE FUNCTION checkinAdded() RETURNS trigger AS
'
BEGIN
    UPDATE Business
    SET num_checkins = num_checkins + 1
    WHERE Business.business_id = New.business_id;
    RETURN NEW;
END
' LANGUAGE plpgsql;

CREATE TRIGGER new_checkin
AFTER INSERT On CheckIN
FOR EACH ROW
EXECUTE PROCEDURE checkinAdded();

-- When a user likes a tip, the "total_likes" attribute value for the user who wrote that tip should be updated.
CREATE OR REPLACE FUNCTION tipLiked() RETURNS trigger AS
'
BEGIN
    UPDATE Yelper
    SET total_likes = total_likes + 1
    WHERE Yelper.user_id = New.user_id;
    RETURN NEW;
END
' LANGUAGE plpgsql;

CREATE TRIGGER tip_liked
AFTER UPDATE OF like_count ON Tip
FOR EACH ROW
WHEN (OLD.like_count < NEW.like_count)
EXECUTE PROCEDURE tipLiked();
