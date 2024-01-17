const { Router } = require("express");

const router = Router();

/*
 * Routes for contracts
 */
router.get("/contracts/:id", (req, res) => res.status(204).end());
router.get("/contracts", (req, res) => res.status(204).end());

module.exports = router;
