const { Op } = require("sequelize");
const { Contract } = require("../models");
const { EntityNotFoundError } = require("../errors");
const { CONTRACT_STATUS } = require("../constants/models");

class ContractBusiness {
  async getContracts(profileId) {
    const contracts = await Contract.findAll({
      where: {
        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        status: {
          [Op.not]: CONTRACT_STATUS.TERMINATED,
        },
      },
    });

    return contracts;
  }

  async getContract(profileId, contractId) {
    const contract = await Contract.findByPk(contractId);

    if (contract && contract.belongsToThisProfile(profileId)) return contract;
    else throw new EntityNotFoundError("contract not found");
  }
}

const contractBusiness = new ContractBusiness();
module.exports = contractBusiness;
