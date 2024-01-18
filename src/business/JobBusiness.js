const flatten = require("lodash/flatten");
const contractBusiness = require("./contractBusiness");
const balanceBusiness = require("./balanceBusiness");
const { sequelize, Job, Profile } = require("../models");
const { EntityNotFoundError } = require("../errors");

class JobBusiness {
  async getUnpaidJobs(profileId) {
    const activeContracts = await contractBusiness.getContracts(profileId, {
      include: "Jobs",
    });

    const activeJobs = activeContracts.map((contract) => contract.Jobs);
    const unpaidJobs = flatten(activeJobs)
      .filter((job) => job.paid !== true)
      .map((job) => {
        delete job.dataValues.ContractId;
        return job;
      });

    return unpaidJobs;
  }

  async payJob(clientProfile, jobId = null) {
    const job = await Job.findByPk(jobId);

    if (!job) throw new EntityNotFoundError("Job Not found");
    if (job.paid === true)
      throw new EntityNotFoundError("This job is already paid");

    const contract = await job.getContract();

    if (contract.isClientId(clientProfile.id)) {
      const dbTransaction = {
        transaction: await sequelize.transaction(),
      };

      try {
        const contractorProfile = await Profile.findByPk(contract.ContractorId);

        await balanceBusiness.transferMoney(
          clientProfile,
          contractorProfile,
          job.price,
          dbTransaction
        );

        job.paid = true;
        await job.save(dbTransaction);

        await dbTransaction.transaction.commit();
        return true;
      } catch (error) {
        await dbTransaction.transaction.rollback();
        throw Error("Transaction Failed");
      }
    }

    throw new EntityNotFoundError("Job Not found");
  }
}

const jobBusiness = new JobBusiness();
module.exports = jobBusiness;
