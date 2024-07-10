const express = require("express");
const {
  addTransaction,
  editTransaction,
  deleteTransaction,
  getPaginatedTransactions,
  getSingleTransaction,
} = require("../controllers/transactions");
const router = express.Router();

router.route("/addTransaction").post(addTransaction);
router.route("/editTransactions/:id").put(editTransaction);
router.route("/deleteTransaction/:id").delete(deleteTransaction);
router.route("/getPaginatedTransactions").get(getPaginatedTransactions);
router.route("/getSingleTransaction/:id").get(getSingleTransaction);

module.exports = router;
