const HttpProxy = require("../utils/HttpProxy");
const adminBusiness = require("../business/adminBusiness");

class AdminController {
  async getBestClients(req, res) {
    const bestClients = await adminBusiness.getBestClients(user);

    res.json({ clients: bestClients });
  }

  async getBestProfession(req, res) {
    const { start, end } = req.query;

    const bestProfessions = await adminBusiness.getBestProfession(start, end);

    res.json({ bestProfession: Object.keys(bestProfessions)[0] });
  }
}

const adminController = HttpProxy(AdminController);
module.exports = adminController;
