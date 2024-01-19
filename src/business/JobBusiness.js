const flatten = require("lodash/flatten");
const contractBusiness = require("./contractBusiness");

class JobBusiness {
  async getUnpaidJobs({ profileId, as = null }) {
    const activeContracts = await contractBusiness.getContracts({
      profileId,
      population: {
        include: "Jobs",
      },
    });

    const activeJobs = activeContracts.map((contract) => contract.Jobs);
    const unpaidJobs = flatten(activeJobs)
      .filter((job) => job.paid !== true)
      .map((job) => {
        delete job.dataValues?.ContractId;
        return job;
      });

    return unpaidJobs;
  }
}

const jobBusiness = new JobBusiness();
module.exports = jobBusiness;
