const BalanceBusiness = require("../business/BalanceBusiness");

class BalanceController {
  async depositMoney(req, res) {
    const { user } = req;
    const { userId } = req.params;
    const { amount } = req.body;

    await BalanceBusiness.depositMoney(user, userId, amount);

    res.status(204).end();
  }
}

const balanceController = new BalanceController();
module.exports = balanceController;
