const adminBusiness = require("../business/adminBusiness");

class AdminController {
  async getBestClients(req, res) {
    const { user } = req;
    const bestClients = await adminBusiness.getBestClients(user);

    res.json({ clients: bestClients });
  }

  async getBestProfession(req, res) {
    const { user } = req;
    const bestProfession = await adminBusiness.getBestProfession(user);

    res.json({ bestProfession });
  }
}

const adminController = new AdminController();
module.exports = adminController;
