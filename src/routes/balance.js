const { Router } = require("express");
const balanceController = require("../controllers/balanceController");

const router = Router();

/*
 * Routes for balances
 */
router.post("/balances/deposit/:userId", balanceController.depositBalance);

module.exports = router;
