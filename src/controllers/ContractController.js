const ContractBusiness = require("../business/ContractBusiness");

class ContractController {
  async getContracts(req, res) {
    const { user } = req;
    const contracts = await ContractBusiness.getContracts(user);

    res.json({ contracts });
  }

  async getContract(req, res) {
    const { user } = req;
    const { contractId } = req.params;

    const contracts = await ContractBusiness.getContract(user, contractId);

    res.json({ contracts });
  }
}

const contractController = new ContractController();
module.exports = contractController;
