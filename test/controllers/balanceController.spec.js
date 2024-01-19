const balanceController = require("../../src/controllers/balanceController");
const balanceBusiness = require("../../src/business/balanceBusiness");
const { BadRequestError } = require("../../src/errors");

jest.mock("../../src/business/BalanceBusiness");

describe("BalanceController", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("depositBalance", () => {
    it("should respond with success message on successful deposit", async () => {
      const mockUserId = "123";
      const mockAmount = 100;
      const mockReq = {
        params: { userId: mockUserId },
        body: { amount: mockAmount },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await balanceController.depositBalance(mockReq, mockRes);

      expect(balanceBusiness.depositBalance).toHaveBeenCalledWith(
        mockUserId,
        mockAmount
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Deposit was successful.",
      });
    });

    it("should throw BadRequestError when amount is not sent", async () => {
      const mockUserId = "123";
      const mockReq = {
        params: { userId: mockUserId },
        body: {},
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        balanceController.depositBalance(mockReq, mockRes)
      ).rejects.toThrow(BadRequestError);
      expect(balanceBusiness.depositBalance).not.toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
});
