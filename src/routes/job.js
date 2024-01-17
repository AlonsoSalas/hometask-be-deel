const { Router } = require("express");
const JobController = require("../controllers/JobController");

const router = Router();

/*
 * Routes for jobs
 */
router.get("/jobs/unpaid", JobController.getUnpaidJobs);
router.post("/jobs/:job_id/pay", JobController.payJob);

module.exports = router;
