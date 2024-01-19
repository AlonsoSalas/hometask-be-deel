const adminBusiness = require("../../src/business/adminBusiness");
const { Job, Profile } = require("../../src/models");
const {
  generateDateRangeWhereClause,
} = require("../../src/utils/helpers/queryHelper");

jest.mock("../../src/models", () => ({
  Job: {
    findAll: jest.fn(),
  },
  Profile: {
    findAll: jest.fn(),
  },
}));

jest.mock("../../src/utils/helpers/queryHelper", () => ({
  generateDateRangeWhereClause: jest.fn(),
}));

describe("adminBusiness", () => {
  describe("getBestClients", () => {
    it("should return the best clients with the highest paid amount", async () => {
      const mockedJobs = [
        { price: 100, Contract: { ClientId: 1 } },
        { price: 150, Contract: { ClientId: 2 } },
      ];

      const mockedProfiles = [
        { id: 1, firstName: "John", lastName: "Doe" },
        { id: 2, firstName: "Jane", lastName: "Smith" },
      ];

      Job.findAll.mockResolvedValue(mockedJobs);
      Profile.findAll.mockResolvedValue(mockedProfiles);

      generateDateRangeWhereClause.mockReturnValue({});

      const result = await adminBusiness.getBestClients();

      expect(Job.findAll).toHaveBeenCalled();
      expect(Profile.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 2, fullName: "Jane Smith", paid: 150 },
        { id: 1, fullName: "John Doe", paid: 100 },
      ]);
    });
  });

  describe("getBestProfession", () => {
    it("should return the best profession with the highest earned amount", async () => {
      const mockedJobs = [
        { price: 200, Contract: { ContractorId: 1 } },
        { price: 300, Contract: { ContractorId: 2 } },
      ];

      const mockedProfiles = [
        { id: 1, profession: "Programmer" },
        { id: 2, profession: "Designer" },
      ];

      Job.findAll.mockResolvedValue(mockedJobs);
      Profile.findAll.mockResolvedValue(mockedProfiles);

      generateDateRangeWhereClause.mockReturnValue({});

      const result = await adminBusiness.getBestProfession();

      expect(Job.findAll).toHaveBeenCalled();
      expect(Profile.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { profession: "Designer", earned: 300 },
        { profession: "Programmer", earned: 200 },
      ]);
    });
  });
});
