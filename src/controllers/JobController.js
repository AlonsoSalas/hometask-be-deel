const HttpProxy = require("../utils/HttpProxy");
const jobBusiness = require("../business/JobBusiness");

class JobController {
  async getUnpaidJobs(req, res) {
    const { profile } = req;
    const unpaidJobs = await jobBusiness.getUnpaidJobs(profile.id);

    res.json(unpaidJobs);
  }

  async payJob(req, res) {
    const { profile } = req;
    const { jobId } = req.params;

    await jobBusiness.payJob(profile, jobId);

    return res.status(200).json({ message: "Payment successful." });
  }
}

const jobController = HttpProxy(JobController);
module.exports = jobController;
