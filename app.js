const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/db"); // Import your database configuration
const transactionRouter = require("./routes/transactions");
const cors = require("cors");
const fs = require("fs");
const Papa = require("papaparse");
const multer = require("multer");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
app.use("/api/transactions", transactionRouter);

// Route for uploading CSV file
app.post(
  "/api/transactions/uploadCSV",
  upload.single("file"),
  async (req, res) => {
    console.log(req.file);
    const filePath = req.file.path;

    try {
      // Read the uploaded CSV file
      const fileContent = fs.readFileSync(filePath, "utf8");

      // Parse CSV data
      const results = Papa.parse(fileContent, { header: true });
      const transactions = results.data;

      await db.query("BEGIN");

      const queryText = `
      INSERT INTO transactions (transaction_date, description, amount, currency)
      VALUES ($1, $2, $3, $4)
    `;

      for (const transaction of transactions) {
        // Convert transaction_date to PostgreSQL DATE type
        if (
          !transaction.Date ||
          !transaction.Amount ||
          !transaction.Description ||
          !transaction.Currency
        ) {
          console.warn("Skipping invalid transaction:", transaction);
          continue; // Skip this transaction and move to the next one
        }
        const transactionDate = transaction.Date.split("-").reverse().join("-"); // DD-MM-YYYY to YYYY-MM-DD

        // console.log(transactionDate);
        const amount = parseFloat(transaction.Amount);

        // Validate or transform other fields as necessary
        const { Description, Currency } = transaction;
        // console.log(Description);
        await db.query(queryText, [
          transactionDate,
          Description,
          amount,
          Currency,
        ]);
      }

      await db.query("COMMIT");
      res.status(200).json({ message: "CSV data uploaded successfully" });
    } catch (e) {
      await db.query("ROLLBACK");
      console.error("Error inserting CSV data:", e);
      res.status(500).json({ error: "Error inserting CSV data" });
    } finally {
      // Delete the file after parsing and database operations
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting CSV file:", unlinkErr);
      });
    }
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
