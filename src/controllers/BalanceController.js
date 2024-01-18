const HttpProxy = require("../utils/HttpProxy");
const balanceBusiness = require("../business/balanceBusiness");

class BalanceController {
  async depositMoney(req, res) {
    const { profile } = req;
    const { userId } = req.params;
    const { amount } = req.body;

    await balanceBusiness.depositMoney(profile, userId, amount);

    res.status(204).end();
  }
}

const balanceController = HttpProxy(BalanceController);
module.exports = balanceController;
