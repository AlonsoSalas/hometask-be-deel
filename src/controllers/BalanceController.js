class BalanceController {
  async depositBalance(req, res) {
    res.status(204).end();
  }
}

const balanceController = new BalanceController();
module.exports = balanceController;
