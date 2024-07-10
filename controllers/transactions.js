// transactionController.js

const db = require("../config/db");

// Controller function to add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { transaction_date, description, amount, currency } = req.body;
    console.log(typeof transaction_date,transaction_date);
    // Insert query to add a new transaction
    const query = `
      INSERT INTO transactions (transaction_date, description, amount, currency)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`;

    // Execute the query with parameters 
    const result = await db.query(query, [
      transaction_date,
      description,
      amount,
      currency,
    ]);

    // Respond with the inserted transaction data
    res.status(201).json(result.rows[0]); // Assuming you want to return the inserted row
  } catch (err) {
    console.error("Error adding transaction:", err);
    res.status(500).json({ error: "Failed to add transaction" });
  }
};

// Controller function to edit a transaction
const editTransaction = async (req, res) => {
  try {
    const { id } = req.params; // Extract transaction ID from URL parameters
    console.log(id);
    const { transaction_date, description, amount, currency } = req.body;

    // Update query to edit an existing transaction
    const query = `
      UPDATE transactions
      SET transaction_date = $1, description = $2, amount = $3, currency = $4
      WHERE id = $5
      RETURNING *;`;

    // Execute the query with parameters
    const result = await db.query(query, [
      transaction_date,
      description,
      amount,
      currency,
      id,
    ]);

    // Check if a transaction was updated
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the updated transaction data
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (err) {
    console.error("Error editing transaction:", err);
    res.status(500).json({ error: "Failed to edit transaction" });
  }
};

// Controller function to delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params; // Extract transaction ID from URL parameters
    

    // Delete query to remove a transaction by ID
    // const query = `
    //   DELETE FROM transactions
    //   WHERE id = $1
    //   RETURNING *;`;

    // Execute the query with the transaction ID
    const result = await db.query(`
      DELETE FROM transactions
      WHERE id = ${id}
      RETURNING *;`);

    // Check if a transaction was deleted
    if (result.rows.length > 0) {
      res.json({
        message: "Transaction deleted successfully",
        transaction: result.rows[0],
      }); // Return the deleted transaction data
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

// Controller function to get paginated transactions
const getPaginatedTransactions = async (req, res) => {
  try {
    const { page = 1 } = req.query; // Get the page number from query parameters, default to 1
    const transactionsPerPage = process.env.PAGINATION_SIZE;
    const offset = (page - 1) * transactionsPerPage;
    // console.log(page);

    // Query to fetch transactions with pagination
    const query = `
      SELECT *
      FROM transactions
      ORDER BY transaction_date DESC
      LIMIT $1 OFFSET $2;`;

    // Execute the query with limit and offset
    const result = await db.query(query, [transactionsPerPage, offset]);

    // Check if there are rows returned from the query
    if (result.rows.length > 0) {
      res.json(result.rows); // Return the transactions data
    } else {
      res.status(404).json({ error: "No transactions found" });
    }
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

const getSingleTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM transactions WHERE id = $1";
    const result = await db.query(query, [id]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (err) {
    console.error("Error fetching transaction:", err);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
};

module.exports = {
  addTransaction,
  editTransaction,
  deleteTransaction,
  getPaginatedTransactions,
  getSingleTransaction,
};
