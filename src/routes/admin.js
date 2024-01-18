const { Router } = require("express");
const adminController = require("../controllers/adminController");

const router = Router();

/*
 * Routes for admin
 */

router.get("/admin/best-clients", adminController.getBestClients);
router.get("/admin/best-profession", adminController.getBestProfession);

module.exports = router;
