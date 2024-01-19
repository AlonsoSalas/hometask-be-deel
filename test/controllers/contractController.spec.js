const contractController = require("../../src/controllers/contractController");
const contractBusiness = require("../../src/business/contractBusiness");

jest.mock("../../src/business/ContractBusiness");

describe("ContractController", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getContracts", () => {
    it("should respond with contracts", async () => {
      const mockProfile = { id: 1 };
      const mockContracts = [{ id: 1, title: "Contract 1", status: "Active" }];

      contractBusiness.getContracts.mockResolvedValueOnce(mockContracts);

      const req = { profile: mockProfile };
      const res = {
        json: jest.fn(),
      };

      await contractController.getContracts(req, res);

      expect(res.json).toHaveBeenCalledWith(mockContracts);
      expect(contractBusiness.getContracts).toHaveBeenCalledWith({
        profileId: mockProfile.id,
      });
    });
  });

  describe("getContract", () => {
    it("should respond with a specific contract", async () => {
      const mockProfile = { id: 1 };
      const mockContractId = "123";
      const mockContract = { id: 123, title: "Contract 123", status: "Active" };

      contractBusiness.getContract.mockResolvedValueOnce(mockContract);

      const req = {
        profile: mockProfile,
        params: { contractId: mockContractId },
      };
      const res = {
        json: jest.fn(),
      };

      await contractController.getContract(req, res);

      expect(res.json).toHaveBeenCalledWith(mockContract);
      expect(contractBusiness.getContract).toHaveBeenCalledWith(
        mockProfile.id,
        mockContractId
      );
    });
  });
});
