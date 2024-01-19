const HttpProxy = require("../utils/httpProxy");
const jobBusiness = require("../business/jobBusiness");
const balanceBusiness = require("../business/balanceBusiness");

class JobController {
  async getUnpaidJobs(req, res) {
    const { profile } = req;
    const unpaidJobs = await jobBusiness.getUnpaidJobs({
      profileId: profile.id,
    });

    res.json(unpaidJobs);
  }

  async payJob(req, res) {
    const { profile } = req;
    const { jobId } = req.params;

    await balanceBusiness.executeJobPayment(profile, jobId);

    return res.status(200).json({ message: "Payment successful." });
  }
}

const jobController = HttpProxy(JobController);
module.exports = jobController;
