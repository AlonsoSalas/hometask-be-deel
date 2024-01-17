const { Router } = require("express");
const BalanceController = require("../controllers/BalanceController");

const router = Router();

/*
 * Routes for balances
 */
router.post("/balances/deposit/:userId", BalanceController.depositBalance);

module.exports = router;
