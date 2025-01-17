const { MAX_DEPOSIT_PERCENTAGE } = require("../utils/constants/balanceLimits");
const { PROFILE_TYPES } = require("../utils/constants/models");
const {
  InsufficientBalanceError,
  AuthorizationError,
  EntityNotFoundError,
} = require("../errors");
const { sequelize, Profile, Job } = require("../models");
const jobBusiness = require("./jobBusiness");

/**
 * Business logic class for handling balance-related operations.
 */
class BalanceBusiness {
  /**
   * Deducts a specified amount from the balance of a profile.
   * @param {Profile} profile - The profile from which to deduct the balance.
   * @param {number} amount - The amount to deduct from the balance.
   * @param {object} transaction - The Sequelize transaction object.
   * @returns {Promise<void>} A promise that resolves when the balance is deducted.
   */
  async deductBalance(profile, amount, transaction) {
    profile.balance = profile.balance - amount;
    await profile.save(transaction);
  }

  /**
   * Adds a specified amount to the balance of a profile.
   * @param {Profile} profile - The profile to which to add the balance.
   * @param {number} amount - The amount to add to the balance.
   * @param {object} transaction - The Sequelize transaction object.
   * @returns {Promise<void>} A promise that resolves when the balance is added.
   */
  async addBalance(profile, amount, transaction) {
    profile.balance = profile.balance + amount;
    await profile.save(transaction);
  }

  /**
   * Transfers money from one profile to another.
   * @param {Profile} clientProfile - The profile from which to transfer money.
   * @param {Profile} contractorProfile - The profile to which to transfer money.
   * @param {number} amount - The amount to transfer.
   * @param {object} transaction - The Sequelize transaction object.
   * @throws {InsufficientBalanceError} If the client profile has insufficient balance.
   * @returns {Promise<void>} A promise that resolves when the money is transferred.
   */
  async transferMoney(clientProfile, contractorProfile, amount, transaction) {
    if (clientProfile.hasSufficientBalance(amount)) {
      await this.deductBalance(clientProfile, amount, transaction);
      await this.addBalance(contractorProfile, amount, transaction);
    } else {
      throw new InsufficientBalanceError("Insufficient Balance");
    }
  }

  /**
   * Deposits a specified amount to the balance of a client profile.
   * @param {string} userId - The ID of the client profile.
   * @param {number} amount - The amount to deposit.
   * @returns {Promise<void>} A promise that resolves when the amount is deposited.
   * @throws {EntityNotFoundError} If the client profile is not found.
   * @throws {AuthorizationError} If the deposit amount exceeds the maximum allowed.
   * @throws {Error} If the transaction fails.
   */
  async depositBalance(userId, amount) {
    const destinationProfile = await Profile.findByPk(userId);

    if (!destinationProfile)
      throw new EntityNotFoundError(`Profile Id ${userId} not found`);

    const unpaidJobs = await jobBusiness.getUnpaidJobs({
      profileId: destinationProfile.id,
      as: PROFILE_TYPES.CLIENT,
    });

    const totalToPay = unpaidJobs.reduce((sum, job) => sum + job.price, 0);

    if (amount > totalToPay * MAX_DEPOSIT_PERCENTAGE)
      throw new AuthorizationError(
        "Amount exceed the maximum you can deposit to this client"
      );

    const dbTransaction = {
      transaction: await sequelize.transaction(),
    };

    try {
      await this.addBalance(destinationProfile, amount, dbTransaction);

      await dbTransaction.transaction.commit();
    } catch (error) {
      await dbTransaction.transaction.rollback();
      throw new Error("Transaction Failed");
    }
  }

  /**
   * Executes the payment for a job, transferring money from the client to the contractor.
   * @param {Profile} clientProfile - The client profile initiating the payment.
   * @param {number} jobId - The ID of the job to be paid.
   * @returns {Promise<boolean>} A promise that resolves to true if the payment is successful.
   * @throws {EntityNotFoundError} If the job or contract is not found.
   * @throws {Error} If the transaction fails.
   */
  async executeJobPayment(clientProfile, jobId = null) {
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

        await this.transferMoney(
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
        throw error;
      }
    }

    throw new EntityNotFoundError("Job Not found");
  }
}

const balanceBusiness = new BalanceBusiness();
module.exports = balanceBusiness;
