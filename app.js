const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/db"); // Import your database configuration
const transactionRouter = require("./routes/transactions");
const cors = require("cors");
const fs = require("fs");
const Papa = require("papaparse");
const multer = require("multer");
// const fetchFromAPI = require("./utils/currencyConverter");

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
    // console.log(req.file);
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

      let curr1ToCurr2 = {};

      // const url = `https://currency-converter18.p.rapidapi.com/api/v1/convert?from=USD&to=INR&amount=1`;
      // const options = {
      //   method: "GET",
      //   headers: {
      //     "x-rapidapi-key":
      //       "a407d4a0f9msh65830e58be2441ap163368jsnd55aa9e7f2d9",
      //     "x-rapidapi-host": "currency-converter18.p.rapidapi.com",
      //   },
      // };

      // try {
      //   const response = await fetch(url, options);
      //   const result = await response.text();
      //   console.log(result);
      //   usdToInr=result
      // } catch (error) {
      //   console.error(error);
      // }

      try {
        const response = await fetch(
          "https://v6.exchangerate-api.com/v6/68b1d8f37a5118c0fa817d43/latest/INR"
        );
        const result = await response.json();

        curr1ToCurr2 = result.conversion_rates;
        const curr = "USD";
        const converted = curr1ToCurr2[curr];
        // console.log(converted);
      } catch (error) {
        console.error(error);
      }

      // console.log(curr1ToCurr2.USD);

      let countOfEmptyFields = 0;
      for (const transaction of transactions) {
        // Convert transaction_date to PostgreSQL DATE type
        if (
          !transaction.Date ||
          !transaction.Amount ||
          !transaction.Description ||
          !transaction.Currency
        ) {
          console.warn("Skipping invalid transaction:", transaction);
          countOfEmptyFields += 1;
          if (countOfEmptyFields > 1) {
            throw new Error("Validation failed.");
          }
          continue; // Skip this transaction and move to the next one
        }

        const transactionDate = transaction.Date.split("-").reverse().join("-"); // DD-MM-YYYY to YYYY-MM-DD

        // console.log(transactionDate);
        if (countOfEmptyFields >= 1) {
          throw new Error("Validation failed.");
        }
        const amount = parseInt(transaction.Amount);
        // const convertedAmount = fetchFromAPI();
        // console.log(amount);

        // const convertedAmount = usdToInr;

        // amount = parseFloat(amount);

        // Validate or transform other fields as necessary
        const { Description, Currency } = transaction;
        // console.log(Description);
        const convertedAmount = curr1ToCurr2[Currency];
        // console.log(amount, amount / convertedAmount);
        await db.query(queryText, [
          transactionDate,
          Description,
          amount,
          Currency,
        ]);
      }

      console.log(countOfEmptyFields);
      if (countOfEmptyFields <= 1) {
        await db.query("COMMIT");
      }
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
