const balanceBusiness = require("../business/balanceBusiness");

class BalanceController {
  async depositMoney(req, res) {
    const { user } = req;
    const { userId } = req.params;
    const { amount } = req.body;

    await balanceBusiness.depositMoney(user, userId, amount);

    res.status(204).end();
  }
}

const balanceController = new BalanceController();
module.exports = balanceController;
