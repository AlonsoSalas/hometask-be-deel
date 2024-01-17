const { Router } = require("express");
const ContractController = require("../controllers/ContractController");

const router = Router();

/*
 * Routes for contracts
 */
router.get("/contracts/:contractId", ContractController.getContract);
router.get("/contracts", ContractController.getContracts);

module.exports = router;
