const { Router } = require("express");

const router = Router();

/*
 * Routes for balances
 */
router.post("/balances/deposit/:userId", (req, res) => res.status(204).end());

module.exports = router;
