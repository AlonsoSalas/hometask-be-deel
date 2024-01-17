const AdminBusiness = require("../business/AdminBusiness");

class AdminController {
  async getBestClients(req, res) {
    const { user } = req;
    const bestClients = await AdminBusiness.getBestClients(user);

    res.json({ clients: bestClients });
  }

  async getBestProfession(req, res) {
    const { user } = req;
    const bestProfession = await AdminBusiness.getBestProfession(user);

    res.json({ bestProfession });
  }
}

const adminController = new AdminController();
module.exports = adminController;
