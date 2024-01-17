class JobBusiness {
  async getUnpaidJobs(user) {
    return [];
  }
  async payJob(user, jobId) {
    return true;
  }
}

const jobBusiness = new JobBusiness();
module.exports = jobBusiness;
