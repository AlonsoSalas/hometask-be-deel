const HttpProxy = require("../utils/HttpProxy");
const contractBusiness = require("../business/contractBusiness");

class ContractController {
  async getContracts(req, res) {
    const { user } = req;
    const contracts = await contractBusiness.getContracts(user);

    res.json({ contracts });
  }

  async getContract(req, res) {
    const { user } = req;
    const { contractId } = req.params;

    const contract = await contractBusiness.getContract(user, contractId);

    res.json({ contract });
  }
}

const contractController = HttpProxy(ContractController);
module.exports = contractController;
