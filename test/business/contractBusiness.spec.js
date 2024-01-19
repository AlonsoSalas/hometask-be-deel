const { Op } = require("sequelize");
const { Contract } = require("../../src/models");
const { EntityNotFoundError } = require("../../src/errors");
const {
  CONTRACT_STATUS,
  PROFILE_TYPES,
} = require("../../src/utils/constants/models");

jest.mock("../../src/models");

const contractBusiness = require("../../src/business/contractBusiness");

describe("ContractBusiness", () => {
  describe("getContracts", () => {
    it("should get contracts for a client", async () => {
      const profileId = 1;
      const contracts = [{ id: 1, status: CONTRACT_STATUS.IN_PROGRESS }];

      Contract.findAll = jest.fn(() => Promise.resolve(contracts));

      const result = await contractBusiness.getContracts({
        profileId,
        as: PROFILE_TYPES.CLIENT,
      });

      expect(result).toEqual(contracts);
      expect(Contract.findAll).toHaveBeenCalledWith({
        where: {
          status: {
            [Op.not]: CONTRACT_STATUS.TERMINATED,
          },
          ClientId: profileId,
        },
      });
    });

    it("should get contracts for a contractor", async () => {
      const profileId = 1;
      const contracts = [{ id: 2, status: CONTRACT_STATUS.IN_PROGRESS }];

      Contract.findAll = jest.fn(() => Promise.resolve(contracts));

      const result = await contractBusiness.getContracts({
        profileId,
        as: PROFILE_TYPES.CONTRACTOR,
      });

      expect(result).toEqual(contracts);
      expect(Contract.findAll).toHaveBeenCalledWith({
        where: {
          status: {
            [Op.not]: CONTRACT_STATUS.TERMINATED,
          },
          ContractorId: profileId,
        },
      });
    });

    it("should get contracts for either client or contractor", async () => {
      const profileId = 1;
      const contracts = [{ id: 3, status: CONTRACT_STATUS.IN_PROGRESS }];

      Contract.findAll = jest.fn(() => Promise.resolve(contracts));

      const result = await contractBusiness.getContracts({ profileId });

      expect(result).toEqual(contracts);
      expect(Contract.findAll).toHaveBeenCalledWith({
        where: {
          status: {
            [Op.not]: CONTRACT_STATUS.TERMINATED,
          },
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        },
      });
    });
  });

  describe("getContract", () => {
    it("should get a specific contract for a profile", async () => {
      const profileId = 1;
      const contractId = 1;
      const contract = {
        id: 1,
        status: CONTRACT_STATUS.IN_PROGRESS,
        belongsToThisProfile: jest.fn(() => true),
      };

      Contract.findByPk = jest.fn(() => Promise.resolve(contract));

      const result = await contractBusiness.getContract(profileId, contractId);

      expect(result).toEqual(contract);
      expect(Contract.findByPk).toHaveBeenCalledWith(contractId);
      expect(contract.belongsToThisProfile).toHaveBeenCalledWith(profileId);
    });

    it("should throw EntityNotFoundError if the contract doesn't belong to the profile", async () => {
      const profileId = 1;
      const contractId = 2;
      const contract = {
        id: 2,
        status: "Active",
        belongsToThisProfile: jest.fn(() => false),
      };

      Contract.findByPk = jest.fn(() => Promise.resolve(contract));

      await expect(
        contractBusiness.getContract(profileId, contractId)
      ).rejects.toThrow(EntityNotFoundError);

      expect(Contract.findByPk).toHaveBeenCalledWith(contractId);
      expect(contract.belongsToThisProfile).toHaveBeenCalledWith(profileId);
    });

    it("should throw EntityNotFoundError if the contract is not found", async () => {
      const profileId = 1;
      const contractId = 3;

      Contract.findByPk = jest.fn(() => Promise.resolve(null));

      await expect(
        contractBusiness.getContract(profileId, contractId)
      ).rejects.toThrow(EntityNotFoundError);

      expect(Contract.findByPk).toHaveBeenCalledWith(contractId);
    });
  });
});
