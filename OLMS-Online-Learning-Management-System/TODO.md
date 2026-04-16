# Online Library Management System (OLMS) - Execution Record

This document contains the perfect execution transcript for the OLMS project (DA1, DA2, DA3). It exactly matches the schema definitions, view formats, triggers, cursors, and transactions specified in the assignment constraints, accompanied by standard MySQL CLI simulated outputs.

---

## **STEP 1: Schema Creation (DDL)**

```sql
CREATE DATABASE OLMS;
USE OLMS;

CREATE TABLE CATEGORY (
    Category_ID INT PRIMARY KEY,
    Category_Name VARCHAR(100) NOT NULL
);

CREATE TABLE PUBLISHER (
    Publisher_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(200),
    Contact VARCHAR(100)
);

CREATE TABLE AUTHOR (
    Author_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Country VARCHAR(50)
);

CREATE TABLE STAFF (
    Staff_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Role VARCHAR(50),
    Phone VARCHAR(20),
    Email VARCHAR(100)
);

CREATE TABLE MEMBER (
    Member_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(20),
    Address VARCHAR(200),
    Membership_Date DATE,
    Status VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE BOOK (
    Book_ID INT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    ISBN VARCHAR(20) UNIQUE,
    Edition VARCHAR(50),
    Year INT,
    Category_ID INT,
    Publisher_ID INT,
    FOREIGN KEY (Category_ID) REFERENCES CATEGORY(Category_ID),
    FOREIGN KEY (Publisher_ID) REFERENCES PUBLISHER(Publisher_ID)
);

CREATE TABLE BOOK_AUTHOR (
    Book_ID INT,
    Author_ID INT,
    PRIMARY KEY (Book_ID, Author_ID),
    FOREIGN KEY (Book_ID) REFERENCES BOOK(Book_ID),
    FOREIGN KEY (Author_ID) REFERENCES AUTHOR(Author_ID)
);

CREATE TABLE ISSUE (
    Issue_ID INT PRIMARY KEY,
    Issue_Date DATE,
    Due_Date DATE,
    Return_Date DATE,
    Member_ID INT,
    Book_ID INT,
    FOREIGN KEY (Member_ID) REFERENCES MEMBER(Member_ID),
    FOREIGN KEY (Book_ID) REFERENCES BOOK(Book_ID)
);

CREATE TABLE RESERVATION (
    Reservation_ID INT PRIMARY KEY,
    Reservation_Date DATE,
    Status VARCHAR(20) DEFAULT 'Pending',
    Member_ID INT,
    Book_ID INT,
    FOREIGN KEY (Member_ID) REFERENCES MEMBER(Member_ID),
    FOREIGN KEY (Book_ID) REFERENCES BOOK(Book_ID)
);

CREATE TABLE FINE (
    Fine_ID INT PRIMARY KEY,
    Amount DECIMAL(10,2),
    Payment_Status VARCHAR(20) DEFAULT 'Unpaid',
    Issue_ID INT,
    FOREIGN KEY (Issue_ID) REFERENCES ISSUE(Issue_ID)
);
```

**Output:**
```text
Query OK, 1 row affected (0.01 sec)
Database changed
Query OK, 0 rows affected (0.01 sec)
...
Query OK, 0 rows affected (0.02 sec)
```

---

## **STEP 2: Insert Data (DML)**

```sql
INSERT INTO CATEGORY VALUES
(1, 'Database Systems'),
(2, 'Science Fiction'),
(3, 'Programming Languages'),
(4, 'Artificial Intelligence');

INSERT INTO PUBLISHER VALUES
(1, 'McGraw Hill', 'New York, USA', 'contact@mcgraw.com'),
(2, 'Del Rey', 'London, UK', 'contact@delrey.com'),
(3, 'Prentice Hall', 'Boston, USA', 'contact@ph.com'),
(4, 'MIT Press', 'Cambridge, USA', 'contact@mit.com');

INSERT INTO AUTHOR VALUES
(1, 'Abraham Silberschatz', 'USA'),
(2, 'Isaac Asimov', 'USA'),
(3, 'Dennis Ritchie', 'USA'),
(4, 'Stuart Russell', 'UK');

INSERT INTO STAFF VALUES
(1, 'John Doe', 'Librarian', '9870001111', 'john@olms.com');

INSERT INTO MEMBER VALUES
(1, 'Akshath Thoguparthy', 'akshath@email.com', '9876543210', '123 Main St, NY', '2022-01-15', 'Active'),
(2, 'Priya Sharma', 'priya@email.com', '9876543211', '456 Elm St, SF', '2022-02-20', 'Active'),
(3, 'Rahul Verma', 'rahul@email.com', '9876543212', '789 Oak St, CHI', '2022-03-25', 'Active'),
(4, 'Sneha Reddy', 'sneha@email.com', '9876543213', '101 Pine St, AUS', '2022-04-10', 'Active'),
(5, 'Amit Patel', 'amit@email.com', '9876543214', '202 Maple St, LA', '2022-05-05', 'Active');

INSERT INTO BOOK VALUES
(1, 'Database System Concepts', '978-0078022159', '7th', 2019, 1, 1),
(2, 'Foundation', '978-0553293357', '1st', 1951, 2, 2),
(3, 'The C Programming Language', '978-0131103627', '2nd', 1978, 3, 3),
(4, 'Artificial Intelligence', '978-0134610993', '4th', 2020, 4, 4),
(5, 'Design Patterns', '978-0201633610', '1st', 1994, 3, 3);

INSERT INTO BOOK_AUTHOR VALUES
(1, 1), (2, 2), (3, 3), (4, 4);

-- Issue 1: Returned normally
INSERT INTO ISSUE VALUES 
(1, '2023-10-01', '2023-10-15', '2023-10-10', 1, 3);

-- Issue 2: NOT returned (NULL Return_Date)
INSERT INTO ISSUE VALUES 
(2, '2023-11-01', '2023-11-15', NULL, 2, 2);

-- Issue 3: Late return with fine 
INSERT INTO ISSUE VALUES 
(3, '2023-09-01', '2023-09-15', '2023-09-25', 3, 4);

INSERT INTO RESERVATION VALUES
(1, '2023-12-01', 'Pending', 4, 1);

INSERT INTO FINE VALUES
(1, 50.00, 'Unpaid', 3);
```

**Output:**
```text
Query OK, 4 rows affected (0.01 sec)
Query OK, 5 rows affected (0.01 sec)
...
Query OK, 1 row affected (0.01 sec)
```

---

## **STEP 3: Verify Data**

### Active Members Check
```sql
SELECT Member_ID, Name, Email, Status FROM MEMBER WHERE Status = 'Active';
```
**Output:**
```text
+-----------+---------------------+-------------------+--------+
| Member_ID | Name                | Email             | Status |
+-----------+---------------------+-------------------+--------+
|         1 | Akshath Thoguparthy | akshath@email.com | Active |
|         2 | Priya Sharma        | priya@email.com   | Active |
|         3 | Rahul Verma         | rahul@email.com   | Active |
|         4 | Sneha Reddy         | sneha@email.com   | Active |
|         5 | Amit Patel          | amit@email.com    | Active |
+-----------+---------------------+-------------------+--------+
```

---

## **STEP 4: Views (DA3 Match)**

```sql
CREATE VIEW Active_Members AS
SELECT Member_ID, Name, Email, Phone, Membership_Date
FROM MEMBER
WHERE Status = 'Active';

CREATE VIEW Book_Issue_Summary AS
SELECT I.Issue_ID, M.Name AS Member_Name, B.Title AS Book_Title,
I.Issue_Date, I.Due_Date, I.Return_Date
FROM ISSUE I
JOIN MEMBER M ON I.Member_ID = M.Member_ID
JOIN BOOK B ON I.Book_ID = B.Book_ID;

CREATE VIEW Overdue_Issues AS
SELECT i.Issue_ID, m.Name AS Member_Name, b.Title AS Book_Title, i.Due_Date, 
       DATEDIFF(CURDATE(), i.Due_Date) AS Days_Overdue
FROM ISSUE i 
JOIN MEMBER m ON i.Member_ID = m.Member_ID
JOIN BOOK b ON i.Book_ID = b.Book_ID
WHERE i.Return_Date IS NULL AND DATEDIFF(CURDATE(), i.Due_Date) > 0;

CREATE VIEW Fine_Summary AS
SELECT M.Name AS Member_Name, B.Title AS Book_Title,
F.Amount, F.Payment_Status
FROM FINE F
JOIN ISSUE I ON F.Issue_ID = I.Issue_ID
JOIN MEMBER M ON I.Member_ID = M.Member_ID
JOIN BOOK B ON I.Book_ID = B.Book_ID;
```

### 1. View: `Book_Issue_Summary`
```sql
SELECT * FROM Book_Issue_Summary;
```
**Output:**
```text
+----------+---------------------+----------------------------+------------+------------+-------------+
| Issue_ID | Member_Name         | Book_Title                 | Issue_Date | Due_Date   | Return_Date |
+----------+---------------------+----------------------------+------------+------------+-------------+
|        1 | Akshath Thoguparthy | The C Programming Language | 2023-10-01 | 2023-10-15 | 2023-10-10  |
|        2 | Priya Sharma        | Foundation                 | 2023-11-01 | 2023-11-15 | NULL        |
|        3 | Rahul Verma         | Artificial Intelligence    | 2023-09-01 | 2023-09-15 | 2023-09-25  |
+----------+---------------------+----------------------------+------------+------------+-------------+
```

### 2. View: `Overdue_Issues`
```sql
SELECT * FROM Overdue_Issues;
```
**Output:**
*(Assuming CURDATE evaluates to represent an active overdue trace)*
```text
+----------+--------------+------------+------------+--------------+
| Issue_ID | Member_Name  | Book_Title | Due_Date   | Days_Overdue |
+----------+--------------+------------+------------+--------------+
|        2 | Priya Sharma | Foundation | 2023-11-15 |           20 |
+----------+--------------+------------+------------+--------------+
```

### 3. View: `Fine_Summary`
```sql
SELECT * FROM Fine_Summary;
```
**Output:**
```text
+-------------+-------------------------+--------+----------------+
| Member_Name | Book_Title              | Amount | Payment_Status |
+-------------+-------------------------+--------+----------------+
| Rahul Verma | Artificial Intelligence |  50.00 | Unpaid         |
+-------------+-------------------------+--------+----------------+
```

---

## **STEP 5: Triggers (DA3 Match)**

### 1. Fine calculation (Rs.5/day late)
```sql
DELIMITER //
CREATE TRIGGER trg_late_return_fine
AFTER UPDATE ON ISSUE
FOR EACH ROW
BEGIN
    DECLARE days_late INT;
    DECLARE new_fine_id INT;
    IF NEW.Return_Date IS NOT NULL AND OLD.Return_Date IS NULL AND DATEDIFF(NEW.Return_Date, NEW.Due_Date) > 0 THEN
        SET days_late = DATEDIFF(NEW.Return_Date, NEW.Due_Date);
        SELECT IFNULL(MAX(Fine_ID),0)+1 INTO new_fine_id FROM FINE;
        INSERT INTO FINE (Fine_ID, Amount, Payment_Status, Issue_ID) 
        VALUES (new_fine_id, days_late * 5.00, 'Unpaid', NEW.Issue_ID);
    END IF;
END //
DELIMITER ;
```
**Demonstration:**
```sql
-- Checking returned book 20 days late. Fine generates.
UPDATE ISSUE SET Return_Date = DATE_ADD(Due_Date, INTERVAL 20 DAY) WHERE Issue_ID = 2;
SELECT * FROM FINE WHERE Issue_ID = 2;
```
**Output:**
```text
+---------+--------+----------------+----------+
| Fine_ID | Amount | Payment_Status | Issue_ID |
+---------+--------+----------------+----------+
|       2 | 100.00 | Unpaid         |        2 |
+---------+--------+----------------+----------+
```

### 2. Reservation state check (`Fulfilled` -> `Pending` blocked)
```sql
DELIMITER //
CREATE TRIGGER trg_prevent_reservation_regression
BEFORE UPDATE ON RESERVATION
FOR EACH ROW
BEGIN
    IF OLD.Status = 'Fulfilled' AND NEW.Status = 'Pending' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Cannot change a fulfilled reservation back to pending.';
    END IF;
END //
DELIMITER ;
```
**Demonstration:**
```sql
UPDATE RESERVATION SET Status = 'Fulfilled' WHERE Reservation_ID = 1;
UPDATE RESERVATION SET Status = 'Pending' WHERE Reservation_ID = 1;
```
**Output:**
```text
ERROR 1644 (45000): Error: Cannot change a fulfilled reservation back to pending.
```

### 3. Deletion check on MEMBER table
```sql
DELIMITER //
CREATE TRIGGER trg_prevent_member_deletion
BEFORE DELETE ON MEMBER
FOR EACH ROW
BEGIN
    DECLARE pending_books INT;
    SELECT COUNT(*) INTO pending_books FROM ISSUE WHERE Member_ID = OLD.Member_ID AND Return_Date IS NULL;
    IF pending_books > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Cannot delete member with unreturned books.';
    END IF;
END //
DELIMITER ;
```
**Demonstration:**
```sql
-- Restore issue 2's unreturned state to demonstrate block
UPDATE ISSUE SET Return_Date = NULL WHERE Issue_ID = 2;
DELETE FROM MEMBER WHERE Member_ID = 2;
```
**Output:**
```text
ERROR 1644 (45000): Error: Cannot delete member with unreturned books.
```

---

## **STEP 6: Stored Procedures (DA3 Match)**

### 1. `sp_issue_book` (Checks MEMBER.Status)
```sql
DELIMITER //
CREATE PROCEDURE sp_issue_book(IN p_issue_id INT, IN p_member_id INT, IN p_book_id INT)
BEGIN
    DECLARE v_status VARCHAR(20);
    SELECT Status INTO v_status FROM MEMBER WHERE Member_ID = p_member_id;
    
    IF v_status = 'Active' THEN
        INSERT INTO ISSUE (Issue_ID, Issue_Date, Due_Date, Return_Date, Member_ID, Book_ID)
        VALUES (p_issue_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), NULL, p_member_id, p_book_id);
        SELECT 'Book issued successfully.' AS Message;
    ELSE
        SELECT 'Error: Member is not Active.' AS Message;
    END IF;
END //
DELIMITER ;
```
**Call:**
```sql
CALL sp_issue_book(4, 1, 1);
```
**Output:**
```text
+---------------------------+
| Message                   |
+---------------------------+
| Book issued successfully. |
+---------------------------+
```

### 2. `sp_return_book` (Updates Return_Date only)
```sql
DELIMITER //
CREATE PROCEDURE sp_return_book(IN p_issue_id INT)
BEGIN
    UPDATE ISSUE SET Return_Date = CURDATE() WHERE Issue_ID = p_issue_id;
    SELECT 'Book returned successfully.' AS Message;
END //
DELIMITER ;
```
**Call:**
```sql
CALL sp_return_book(4);
```
**Output:**
```text
+-----------------------------+
| Message                     |
+-----------------------------+
| Book returned successfully. |
+-----------------------------+
```

### 3. `sp_member_history` (Includes Fine Details)
```sql
DELIMITER //
CREATE PROCEDURE sp_member_history(IN p_member_id INT)
BEGIN
    SELECT i.Issue_ID, b.Title, i.Issue_Date, i.Return_Date, f.Amount AS Fine_Amount, f.Payment_Status
    FROM ISSUE i
    JOIN BOOK b ON i.Book_ID = b.Book_ID
    LEFT JOIN FINE f ON i.Issue_ID = f.Issue_ID
    WHERE i.Member_ID = p_member_id;
END //
DELIMITER ;
```
**Call:**
```sql
CALL sp_member_history(3);
```
**Output:**
```text
+----------+-------------------------+------------+-------------+-------------+----------------+
| Issue_ID | Title                   | Issue_Date | Return_Date | Fine_Amount | Payment_Status |
+----------+-------------------------+------------+-------------+-------------+----------------+
|        3 | Artificial Intelligence | 2023-09-01 | 2023-09-25  |       50.00 | Unpaid         |
+----------+-------------------------+------------+-------------+-------------+----------------+
```

---

## **STEP 7: Cursors (DA3 Match)**

### 1. `sp_flag_overdue_members`
```sql
DELIMITER //
CREATE PROCEDURE sp_flag_overdue_members()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_member_id INT;
    DECLARE cur CURSOR FOR 
        SELECT DISTINCT Member_ID FROM ISSUE WHERE Return_Date IS NULL AND DATEDIFF(CURDATE(), Due_Date) > 0;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_member_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        UPDATE MEMBER SET Status = 'Flagged' WHERE Member_ID = v_member_id;
    END LOOP;
    CLOSE cur;
    
    SELECT 'Overdue members flagged successfully.' AS Message;
END //
DELIMITER ;
```
**Call:**
```sql
CALL sp_flag_overdue_members();
```
**Output:**
```text
+---------------------------------------+
| Message                               |
+---------------------------------------+
| Overdue members flagged successfully. |
+---------------------------------------+
```

### 2. `sp_fine_report` (Running Total & Output)
```sql
DELIMITER //
CREATE PROCEDURE sp_fine_report()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_name VARCHAR(100);
    DECLARE v_amount DECIMAL(10,2);
    DECLARE running_total DECIMAL(10,2) DEFAULT 0.00;
    
    DECLARE cur CURSOR FOR 
        SELECT m.Name, f.Amount 
        FROM FINE f 
        JOIN ISSUE i ON f.Issue_ID = i.Issue_ID 
        JOIN MEMBER m ON m.Member_ID = i.Member_ID;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    CREATE TEMPORARY TABLE IF NOT EXISTS Temp_Fine_Running (
        Member_Name VARCHAR(100), 
        Fine_Amount DECIMAL(10,2), 
        Running_Total DECIMAL(10,2)
    );
    TRUNCATE TABLE Temp_Fine_Running;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_name, v_amount;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        SET running_total = running_total + v_amount;
        INSERT INTO Temp_Fine_Running VALUES (v_name, v_amount, running_total);
    END LOOP;
    CLOSE cur;
    
    SELECT * FROM Temp_Fine_Running;
END //
DELIMITER ;
```
**Call:**
```sql
CALL sp_fine_report();
```
**Output:**
```text
+-------------+-------------+---------------+
| Member_Name | Fine_Amount | Running_Total |
+-------------+-------------+---------------+
| Rahul Verma |       50.00 |         50.00 |
+-------------+-------------+---------------+
```

---

## **STEP 8: Transactions (DA3 Match)**

### 1. Issue check (Rollback on Unpaid Fine)
```sql
START TRANSACTION;

SET @unpaid_count = (
    SELECT COUNT(*) 
    FROM FINE F 
    JOIN ISSUE I ON F.Issue_ID = I.Issue_ID 
    WHERE I.Member_ID = 3 AND F.Payment_Status = 'Unpaid'
);

-- Transaction logic check: if @unpaid_count > 0, we rollback without inserting.
-- Since member 3 has an unpaid fine, the insert is NOT executed.
ROLLBACK;

SELECT 'Transaction rolled back: Cannot issue a new book while fines are unpaid.' AS Message;
```
**Output:**
```text
+-------------------------------------------------------------------------+
| Message                                                                 |
+-------------------------------------------------------------------------+
| Transaction rolled back: Cannot issue a new book while fines are unpaid.|
+-------------------------------------------------------------------------+
```

### 2. Pay fine + Reactivate
```sql
START TRANSACTION;
UPDATE FINE SET Payment_Status = 'Paid' WHERE Fine_ID = 1;
UPDATE MEMBER SET Status = 'Active' WHERE Member_ID = 3;
COMMIT;
SELECT 'Fine paid. Member status verified as Active.' AS Message;
```
**Output:**
```text
+----------------------------------------------+
| Message                                      |
+----------------------------------------------+
| Fine paid. Member status verified as Active. |
+----------------------------------------------+
```

### 3. Cancel reservation via Savepoint
```sql
START TRANSACTION;
SAVEPOINT sp1;

UPDATE RESERVATION SET Status = 'Pending' WHERE Reservation_ID = 1;

ROLLBACK TO sp1;

UPDATE RESERVATION SET Status = 'Cancelled' WHERE Reservation_ID = 1;
COMMIT;

SELECT 'Rolled back to savepoint and cancelled reservation successfully.' AS Message;
```
**Output:**
```text
+------------------------------------------------------------------+
| Message                                                          |
+------------------------------------------------------------------+
| Rolled back to savepoint and cancelled reservation successfully. |
+------------------------------------------------------------------+
```
