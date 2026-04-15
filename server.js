const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'diwalidiwali',
  database: 'OLMS'
});
db.connect(err => {
  if (err) { console.error("DB connection failed:", err); throw err; }
  console.log("✓ Connected to MySQL - OLMS");
});

// ─── Helper ──────────────────────────────────────────────────────
const q = (sql, params=[]) => new Promise((res, rej) =>
  db.query(sql, params, (err, result) => err ? rej(err) : res(result))
);

// ─── MEMBERS ─────────────────────────────────────────────────────
// GET all members
app.get('/get', async (req, res) => {
  try { res.json(await q("SELECT * FROM MEMBER")); }
  catch(e) { res.status(500).send(e.message); }
});

// INSERT member
app.post('/add', async (req, res) => {
  const { name, email } = req.body;
  try {
    await q("INSERT INTO MEMBER (Name, Email, Membership_Date, Status) VALUES (?,?,CURDATE(),'Active')", [name, email]);
    res.send("Member added successfully");
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

// UPDATE member name
app.put('/update', async (req, res) => {
  const { id, name } = req.body;
  try {
    await q("UPDATE MEMBER SET Name=? WHERE Member_ID=?", [name, id]);
    res.send("Member updated successfully");
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

// DELETE member
app.delete('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await q("DELETE FROM MEMBER WHERE Member_ID=?", [id]);
    res.send("Member deleted successfully");
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

// ─── BOOKS ───────────────────────────────────────────────────────
// GET books
app.get('/books', async (req, res) => {
  try {
    res.json(await q(`
      SELECT B.*, C.Category_Name 
      FROM BOOK B 
      LEFT JOIN CATEGORY C ON B.Category_ID = C.Category_ID
    `));
  } catch(e) { res.status(500).send(e.message); }
});

// UPDATE book
app.put('/books/update', async (req, res) => {
  const { id, title, isbn, edition, year, category_id, publisher_id } = req.body;
  try {
    await q(
      "UPDATE BOOK SET Title=?, ISBN=?, Edition=?, Year=?, Category_ID=?, Publisher_ID=? WHERE Book_ID=?",
      [title, isbn, edition, year, category_id, publisher_id, id]
    );
    res.send("Book updated successfully");
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

// DELETE book
app.delete('/books/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await q("DELETE FROM BOOK WHERE Book_ID=?", [id]);
    res.send("Book deleted successfully");
  } catch(e) { res.status(500).send(e.message); }
});


// ─── AUTHORS ─────────────────────────────────────────────────────
// GET authors
app.get('/authors', async (req, res) => {
  try { res.json(await q("SELECT * FROM AUTHOR")); }
  catch(e) { res.status(500).send(e.message); }
});

// UPDATE author
app.put('/authors/update', async (req, res) => {
  const { id, name, country } = req.body;
  try {
    await q("UPDATE AUTHOR SET Name=?, Country=? WHERE Author_ID=?", [name, country, id]);
    res.send("Author updated successfully");
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

// DELETE author
app.delete('/authors/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await q("DELETE FROM AUTHOR WHERE Author_ID=?", [id]);
    res.send("Author deleted successfully");
  } catch(e) { res.status(500).send("Error: " + e.message); }
});


// ─── ISSUES ──────────────────────────────────────────────────────
app.get('/issues', async (req, res) => {
  try {
    res.json(await q(`
      SELECT I.*, M.Name AS Member_Name, B.Title AS Book_Title
      FROM ISSUE I
      LEFT JOIN MEMBER M ON I.Member_ID = M.Member_ID
      LEFT JOIN BOOK B ON I.Book_ID = B.Book_ID
      ORDER BY I.Issue_Date DESC
    `));
  } catch(e) { res.status(500).send(e.message); }
});

// POST issue
app.post('/issue', async (req, res) => {
  const { issue_id, member_id, book_id } = req.body;
  try {
    const member = await q("SELECT Status FROM MEMBER WHERE Member_ID=?", [member_id]);
    if (!member.length) return res.status(400).send("Error: Member not found");
    if (member[0].Status !== 'Active') return res.status(400).send("Error: Member is not Active");
    await q(
      "INSERT INTO ISSUE (Issue_ID, Issue_Date, Due_Date, Return_Date, Member_ID, Book_ID) VALUES (?,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 14 DAY),NULL,?,?)",
      [issue_id, member_id, book_id]
    );
    res.send("Book issued successfully");
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

// PUT return
app.put('/return', async (req, res) => {
  const { issue_id } = req.body;
  try {
    await q("UPDATE ISSUE SET Return_Date=CURDATE() WHERE Issue_ID=?", [issue_id]);
    res.send("Book returned successfully");
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

// ─── RESERVATIONS ────────────────────────────────────────────────
app.get('/reservations', async (req, res) => {
  try { res.json(await q("SELECT * FROM RESERVATION ORDER BY Reservation_Date DESC")); }
  catch(e) { res.status(500).send(e.message); }
});

app.put('/reservation', async (req, res) => {
  const { id, status } = req.body;
  try {
    await q("UPDATE RESERVATION SET Status=? WHERE Reservation_ID=?", [status, id]);
    res.send("Reservation updated");
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

// ─── FINES ───────────────────────────────────────────────────────
app.get('/fines', async (req, res) => {
  try {
    res.json(await q(`
      SELECT F.Fine_ID, F.Amount, F.Payment_Status, F.Issue_ID,
             M.Name AS Member_Name, B.Title AS Book_Title
      FROM FINE F
      LEFT JOIN ISSUE I ON F.Issue_ID = I.Issue_ID
      LEFT JOIN MEMBER M ON I.Member_ID = M.Member_ID
      LEFT JOIN BOOK B ON I.Book_ID = B.Book_ID
    `));
  } catch(e) { res.status(500).send(e.message); }
});

app.put('/fine/pay', async (req, res) => {
  const { id } = req.body;
  try {
    await q("UPDATE FINE SET Payment_Status='Paid' WHERE Fine_ID=?", [id]);
    res.send("Fine marked as paid");
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

// ─── VIEWS ───────────────────────────────────────────────────────
app.get('/view/active_members', async (req, res) => {
  try { res.json(await q("SELECT * FROM Active_Members")); }
  catch(e) { res.status(500).send(e.message); }
});

app.get('/view/book_issue_summary', async (req, res) => {
  try { res.json(await q("SELECT * FROM Book_Issue_Summary")); }
  catch(e) { res.status(500).send(e.message); }
});

app.get('/view/overdue_issues', async (req, res) => {
  try { res.json(await q("SELECT * FROM Overdue_Issues")); }
  catch(e) { res.status(500).send(e.message); }
});

app.get('/view/fine_summary', async (req, res) => {
  try { res.json(await q("SELECT * FROM Fine_Summary")); }
  catch(e) { res.status(500).send(e.message); }
});

// ─── STORED PROCEDURES ───────────────────────────────────────────
app.post('/proc/issue_book', async (req, res) => {
  const { issue_id, member_id, book_id } = req.body;
  try {
    const result = await q("CALL sp_issue_book(?,?,?)", [issue_id, member_id, book_id]);
    res.json(result[0]);
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

app.post('/proc/return_book', async (req, res) => {
  const { issue_id } = req.body;
  try {
    const result = await q("CALL sp_return_book(?)", [issue_id]);
    res.json(result[0]);
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

app.post('/proc/member_history', async (req, res) => {
  const { member_id } = req.body;
  try {
    const result = await q("CALL sp_member_history(?)", [member_id]);
    res.json(result[0]);
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

app.post('/proc/flag_overdue', async (req, res) => {
  try {
    const result = await q("CALL sp_flag_overdue_members()");
    res.json(result[0]);
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

app.post('/proc/fine_report', async (req, res) => {
  try {
    const result = await q("CALL sp_fine_report()");
    res.json(result[0]);
  } catch(e) { res.status(500).send("Error: " + e.message); }
});

app.listen(3000, () => console.log("🚀 OLMS Server running on http://localhost:3000"));
app.post('/add-book', async (req, res) => {
  const { id, title, isbn, edition, year, category_id, publisher_id } = req.body;
  try {
    await q(
      "INSERT INTO BOOK VALUES (?,?,?,?,?,?,?)",
      [id, title, isbn, edition, year, category_id, publisher_id]
    );
    res.send("Book added");
  } catch (e) {
    res.status(500).send(e.message);
  }
});
app.post('/add-author', async (req, res) => {
  const { id, name, country } = req.body;

  try {
    await q(
      "INSERT INTO AUTHOR VALUES (?,?,?)",
      [id, name, country]
    );
    res.send("Author added");
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});