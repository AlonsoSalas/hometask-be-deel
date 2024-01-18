const { Router } = require("express");
const jobController = require("../controllers/jobController");

const router = Router();

/*
 * Routes for jobs
 */
router.get("/jobs/unpaid", jobController.getUnpaidJobs);
router.post("/jobs/:jobId/pay", jobController.payJob);

module.exports = router;
