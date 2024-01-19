const HttpProxy = require("../utils/HttpProxy");
const balanceBusiness = require("../business/balanceBusiness");
const { BadRequestError } = require("../errors");

class BalanceController {
  async depositBalance(req, res) {
    const { userId } = req.params;
    const { amount } = req.body;

    if (typeof amount === "undefined")
      throw new BadRequestError("amount must be sent");

    await balanceBusiness.depositBalance(userId, amount);

    return res.status(200).json({ message: "Deposit was successful." });
  }
}

const balanceController = HttpProxy(BalanceController);
module.exports = balanceController;
