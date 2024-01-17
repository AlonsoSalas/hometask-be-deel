const jobBusiness = require("../business/JobBusiness");

class JobController {
  async getUnpaidJobs(req, res) {
    const { user } = req;
    const unpaidJobs = await jobBusiness.getUnpaidJobs(user);

    res.json({ jobs: unpaidJobs });
  }

  async payJob(req, res) {
    const { user } = req;
    const { jobId } = req.params;

    await jobBusiness.payJob(user, jobId);

    res.status(204).end();
  }
}

const jobController = new JobController();
module.exports = jobController;
