const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/db"); // Import your database configuration
const transactionRouter = require("./routes/transactions");
const cors = require("cors");

// const fetchFromAPI = require("./utils/currencyConverter");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
