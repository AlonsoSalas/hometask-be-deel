const { Router } = require("express");
const contractController = require("../controllers/contractController");

const router = Router();

/*
 * Routes for contracts
 */
router.get("/contracts/:contractId", contractController.getContract);
router.get("/contracts", contractController.getContracts);

module.exports = router;
