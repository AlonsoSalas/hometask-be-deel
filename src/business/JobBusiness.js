const flatten = require("lodash/flatten");
const contractBusiness = require("./contractBusiness");

/**
 * Business logic class for handling job-related operations.
 */
class JobBusiness {
  /**
   * Retrieves unpaid jobs for a given profile based on active contracts.
   * @param {Object} options - Options for retrieving unpaid jobs.
   * @param {number} options.profileId - The ID of the profile associated with the jobs.
   * @param {string|null} options.as - The role of the profile (CLIENT or CONTRACTOR).
   * @returns {Promise<Array>} A promise that resolves to an array of unpaid jobs.
   */
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
