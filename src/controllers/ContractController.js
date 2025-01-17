const HttpProxy = require("../utils/httpProxy");
const contractBusiness = require("../business/contractBusiness");

class ContractController {
  async getContracts(req, res) {
    const { profile } = req;
    const contracts = await contractBusiness.getContracts({
      profileId: profile.id,
    });

    res.json(contracts);
  }

  async getContract(req, res) {
    const { profile } = req;
    const { contractId } = req.params;

    const contract = await contractBusiness.getContract(profile.id, contractId);

    res.json(contract);
  }
}

const contractController = HttpProxy(ContractController);
module.exports = contractController;
