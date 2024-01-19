const { Op } = require("sequelize");
const { Contract } = require("../models");
const { EntityNotFoundError } = require("../errors");
const { CONTRACT_STATUS, PROFILE_TYPES } = require("../utils/constants/models");

/**
 * Business logic class for handling contract-related operations.
 */
class ContractBusiness {
  /**
   * Retrieves contracts based on specified criteria.
   * @param {Object} options - Options for retrieving contracts.
   * @param {number} options.profileId - The ID of the profile associated with the contracts.
   * @param {string|null} options.as - The role of the profile (CLIENT or CONTRACTOR).
   * @param {Object} options.population - Sequelize association options for eager loading.
   * @returns {Promise<Array<Contract>>} A promise that resolves to an array of contracts.
   */
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

  /**
   * Retrieves a contract based on the profile ID and contract ID.
   * @param {number} profileId - The ID of the profile associated with the contract.
   * @param {number} contractId - The ID of the contract to retrieve.
   * @returns {Promise<Contract>} A promise that resolves to the requested contract.
   * @throws {EntityNotFoundError} If the contract is not found or doesn't belong to the profile.
   */
  async getContract(profileId, contractId) {
    const contract = await Contract.findByPk(contractId);

    if (contract && contract.belongsToThisProfile(profileId)) return contract;
    throw new EntityNotFoundError("contract not found");
  }
}

const contractBusiness = new ContractBusiness();
module.exports = contractBusiness;
