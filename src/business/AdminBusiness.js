class AdminBusiness {
  async getBestClients(req, res) {
    return [];
  }

  async getBestProfession(req, res) {
    return {};
  }
}

const adminBusiness = new AdminBusiness();
module.exports = adminBusiness;
