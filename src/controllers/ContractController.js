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

    const contracts = await contractBusiness.getContract(user, contractId);

    res.json({ contracts });
  }
}

const contractController = new ContractController();
module.exports = contractController;
