class JobController {
  async getUnpaidJobs(req, res) {
    res.status(204).end();
  }
  async payJob(req, res) {
    res.status(204).end();
  }
}

const jobController = new JobController();
module.exports = jobController;
