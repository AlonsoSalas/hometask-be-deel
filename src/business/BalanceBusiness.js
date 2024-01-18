const { MAX_DEPOSIT_PERCENTAGE } = require("../constants/balanceLimits");
const { PROFILE_TYPES } = require("../constants/models");
const {
  InsufficientBalanceError,
  AuthorizationError,
  EntityNotFoundError,
} = require("../errors");
const { sequelize, Profile } = require("../models");
const jobBusiness = require("./JobBusiness");

class BalanceBusiness {
  async deductBalance(profile, amount, transaction) {
    profile.balance = profile.balance - amount;
    await profile.save(transaction);
  }

  async addBalance(profile, amount, transaction) {
    profile.balance = profile.balance + amount;
    await profile.save(transaction);
  }

  async transferMoney(clientProfile, contractorProfile, amount, transaction) {
    if (clientProfile.hasSufficientBalance(amount)) {
      await this.deductBalance(clientProfile, amount, transaction);
      await this.addBalance(contractorProfile, amount, transaction);
    } else {
      throw new InsufficientBalanceError("Insufficient Balance");
    }
  }

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
      throw Error("Transaction Failed");
    }
  }
}

const balanceBusiness = new BalanceBusiness();
module.exports = balanceBusiness;
