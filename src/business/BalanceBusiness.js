const { InsufficientBalanceError } = require("../errors");

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
      throw new InsufficientBalanceError("Insufficient Balance"); // Insufficient balance
    }
  }
  async depositMoney(user, userId, amount) {
    return 100;
  }
}

const balanceBusiness = new BalanceBusiness();
module.exports = balanceBusiness;
