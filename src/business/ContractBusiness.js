class ContractBusiness {
  async getContracts(user) {
    return [];
  }

  async getContract(user, contractId) {
    return {};
  }
}

const contractBusiness = new ContractBusiness();
module.exports = contractBusiness;
