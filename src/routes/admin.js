const { Router } = require("express");
const AdminController = require("../controllers/AdminController");

const router = Router();

/*
 * Routes for admin
 */

router.get("/admin/best-clients", AdminController.getBestClients);
router.get("/admin/best-profession", AdminController.getBestProfession);

module.exports = router;
