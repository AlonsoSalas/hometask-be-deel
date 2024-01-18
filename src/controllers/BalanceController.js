const HttpProxy = require("../utils/HttpProxy");
const balanceBusiness = require("../business/balanceBusiness");

class BalanceController {
  async depositBalance(req, res) {
    const { userId } = req.params;
    const { amount } = req.body;

    await balanceBusiness.depositBalance(userId, amount);

    return res.status(200).json({ message: "Deposit was successful." });
  }
}

const balanceController = HttpProxy(BalanceController);
module.exports = balanceController;
