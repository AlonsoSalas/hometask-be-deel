const { Router } = require("express");

const router = Router();

/*
 * Routes for admin
 */

router.get("/admin/best-clients", (req, res) => res.status(204).end());
router.get("/admin/best-profession", (req, res) => res.status(204).end());

module.exports = router;
