const { Router } = require("express");

const router = Router();

/*
 * Routes for jobs
 */
router.get("/jobs/unpaid", (req, res) => res.status(204).end());
router.post("/jobs/:job_id/pay", (req, res) => res.status(204).end());

module.exports = router;
