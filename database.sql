USE OLMS;
DELIMITER //

CREATE TRIGGER trg_simple_fine
AFTER UPDATE ON ISSUE
FOR EACH ROW
BEGIN
    DECLARE days_late INT;

    IF NEW.Return_Date IS NOT NULL 
       AND OLD.Return_Date IS NULL 
       AND DATEDIFF(NEW.Return_Date, NEW.Due_Date) > 0 THEN

        SET days_late = DATEDIFF(NEW.Return_Date, NEW.Due_Date);

        INSERT INTO FINE (Amount, Payment_Status, Issue_ID)
        VALUES (days_late * 5.00, 'Unpaid', NEW.Issue_ID);

    END IF;
END //

DELIMITER ;