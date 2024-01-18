const { Op } = require("sequelize");
const { Contract } = require("../models");
const { EntityNotFoundError } = require("../errors");
const { CONTRACT_STATUS, PROFILE_TYPES } = require("../constants/models");

class ContractBusiness {
  async getContracts({ profileId, as = null, population = {} }) {
    const whereClause =
      as === PROFILE_TYPES.CLIENT
        ? { ClientId: profileId }
        : as === PROFILE_TYPES.CONTRACTOR
        ? { ContractorId: profileId }
        : {
            [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
          };

    const contracts = await Contract.findAll({
      where: {
        status: {
          [Op.not]: CONTRACT_STATUS.TERMINATED,
        },
        ...whereClause,
      },
      ...population,
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
