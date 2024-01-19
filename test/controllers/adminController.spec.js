const adminController = require("../../src/controllers/adminController");
const adminBusiness = require("../../src/business/adminBusiness");

jest.mock("../../src/business/adminBusiness");

describe("AdminController", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getBestClients", () => {
    it("should respond with the best clients based on the specified time period and limit", async () => {
      const mockReq = {
        query: {
          start: "2022-01-01",
          end: "2022-12-31",
          limit: 5,
        },
      };
      const mockRes = {
        json: jest.fn(),
      };

      const mockedClients = [
        { name: "Harry Potter", paid: 1000 },
        { name: "Fernando Alonso", paid: 500 },
      ];

      adminBusiness.getBestClients.mockResolvedValueOnce(mockedClients);

      await adminController.getBestClients(mockReq, mockRes);

      expect(adminBusiness.getBestClients).toHaveBeenCalledWith(
        "2022-01-01",
        "2022-12-31",
        5
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockedClients);
    });
  });

  describe("getBestProfession", () => {
    it("should respond with the best profession based on the specified time range", async () => {
      const mockReq = {
        query: {
          start: "2022-01-01",
          end: "2022-12-31",
        },
      };
      const mockRes = {
        json: jest.fn(),
      };

      const mockedProfessions = [{ profession: "Programmer", earned: 2883 }];

      adminBusiness.getBestProfession.mockResolvedValueOnce(mockedProfessions);

      await adminController.getBestProfession(mockReq, mockRes);

      expect(adminBusiness.getBestProfession).toHaveBeenCalledWith(
        "2022-01-01",
        "2022-12-31"
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining(mockedProfessions[0])
      );
    });
  });
});
