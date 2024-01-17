class AdminController {
  async getBestClients(req, res) {
    res.status(204).end();
  }

  async getBestProfession(req, res) {
    res.status(204).end();
  }
}

const adminController = new AdminController();
module.exports = adminController;
