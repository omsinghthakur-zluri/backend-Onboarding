// server.js

const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/db"); // Import your database configuration

dotenv.config();

const app = express();

app.use(express.json());

// Example route to test database connection
// Assuming you have already initialized db as a database connection

app.get("/", async (req, res) => {
  try {
    const query = "SELECT amount FROM transactions"; // SQL query to select 'amount' from 'table1'
    const result = await db.query(query); // Execute the query using db.query()

    // Check if there are rows returned from the query
    if (result.rows.length > 0) {
      res.json({ message: result.rows[0].amount }); // Return the first 'amount' from the query result
    } else {
      res.json({ message: "No records found" }); // Handle case where no records are found
    }
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
