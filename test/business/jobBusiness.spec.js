const { sequelize, Job, Profile } = require("../../src/models");
const { EntityNotFoundError } = require("../../src/errors");
const balanceBusiness = require("../../src/business/balanceBusiness");
const contractBusiness = require("../../src/business/contractBusiness");
const jobBusiness = require("../../src/business/jobBusiness");

jest.mock("../../src/models", () => ({
  sequelize: {
    transaction: jest.fn(),
  },
  Profile: {
    findByPk: jest.fn(),
  },
  Job: {
    findByPk: jest.fn(),
  },
}));
jest.mock("../../src/business/balanceBusiness");
jest.mock("../../src/business/contractBusiness");

describe("JobBusiness", () => {
  describe("getUnpaidJobs", () => {
    it("should get unpaid jobs for a profile", async () => {
      const profileId = 1;
      const activeContracts = [
        {
          id: 1,
          Jobs: [
            { id: 1, paid: false },
            { id: 2, paid: true },
          ],
        },
        { id: 2, Jobs: [{ id: 3, paid: false }] },
      ];

      contractBusiness.getContracts = jest.fn(() =>
        Promise.resolve(activeContracts)
      );

      const result = await jobBusiness.getUnpaidJobs({ profileId });

      expect(result).toEqual([
        { id: 1, paid: false },
        { id: 3, paid: false },
      ]);
      expect(contractBusiness.getContracts).toHaveBeenCalledWith({
        profileId,
        population: { include: "Jobs" },
      });
    });
  });
});
