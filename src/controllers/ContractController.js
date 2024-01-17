class ContractController {
  async getContracts(req, res) {
    res.status(204).end();
  }

  async getContract(req, res) {
    // const { id } = req.params;
    res.status(204).end();
  }
}

const contractController = new ContractController();
module.exports = contractController;
