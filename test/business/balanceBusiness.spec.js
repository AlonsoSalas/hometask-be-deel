const { PROFILE_TYPES } = require("../../src/utils/constants/models");
const {
  InsufficientBalanceError,
  AuthorizationError,
} = require("../../src/errors");
const { sequelize, Profile } = require("../../src/models");
const jobBusiness = require("../../src/business/jobBusiness");
const balanceBusiness = require("../../src/business/balanceBusiness");

jest.mock("../../src/models", () => ({
  sequelize: {
    transaction: jest.fn(),
  },
  Profile: {
    findByPk: jest.fn(),
  },
}));

jest.mock("../../src/business/jobBusiness", () => ({
  getUnpaidJobs: jest.fn(),
}));

describe("BalanceBusiness", () => {
  describe("deductBalance", () => {
    it("should deduct balance successfully", async () => {
      const mockedProfile = {
        id: 1,
        balance: 100,
        save: jest.fn(() => Promise.resolve()),
      };

      await balanceBusiness.deductBalance(mockedProfile, 30);

      expect(mockedProfile.save).toHaveBeenCalled();
      expect(mockedProfile.balance).toBe(70);
    });
  });

  describe("addBalance", () => {
    it("should add balance successfully", async () => {
      const mockedProfile = {
        id: 1,
        balance: 100,
        save: jest.fn(() => Promise.resolve()),
      };

      await balanceBusiness.addBalance(mockedProfile, 30);

      expect(mockedProfile.save).toHaveBeenCalled();
      expect(mockedProfile.balance).toBe(130);
    });
  });

  describe("transferMoney", () => {
    it("should call deductBalance and addBalance if client hasSufficientBalance", async () => {
      const clientProfile = {
        hasSufficientBalance: jest.fn(() => true),
      };
      const contractorProfile = {};

      balanceBusiness.deductBalance = jest.fn();
      balanceBusiness.addBalance = jest.fn();

      await balanceBusiness.transferMoney(clientProfile, contractorProfile, 50);

      expect(clientProfile.hasSufficientBalance).toHaveBeenCalledWith(50);
      expect(balanceBusiness.deductBalance).toHaveBeenCalledWith(
        clientProfile,
        50,
        undefined
      );
      expect(balanceBusiness.addBalance).toHaveBeenCalledWith(
        contractorProfile,
        50,
        undefined
      );
    });
    it("should throw error if client doesn't hasSufficientBalance", async () => {
      const clientProfile = {
        hasSufficientBalance: jest.fn(() => false),
      };
      const contractorProfile = {};

      await expect(
        balanceBusiness.transferMoney(clientProfile, contractorProfile, 50)
      ).rejects.toThrow(InsufficientBalanceError);
    });
  });

  describe("depositBalance", () => {
    it("should deposit balance successfully if conditions are met", async () => {
      const mockedProfile = { id: 1, balance: 100 };
      const mockedUnpaidJobs = [{ price: 50 }, { price: 30 }];

      Profile.findByPk.mockResolvedValue(mockedProfile);
      jobBusiness.getUnpaidJobs.mockResolvedValue(mockedUnpaidJobs);
      const commitMock = jest.fn();
      const rollbackMock = jest.fn();
      sequelize.transaction.mockResolvedValue({
        commit: commitMock,
        rollback: rollbackMock,
      });

      balanceBusiness.addBalance = jest.fn();
      await balanceBusiness.depositBalance(1, 15);

      expect(Profile.findByPk).toHaveBeenCalledWith(1);
      expect(jobBusiness.getUnpaidJobs).toHaveBeenCalledWith({
        profileId: mockedProfile.id,
        as: PROFILE_TYPES.CLIENT,
      });
      expect(commitMock).toHaveBeenCalled();
    });

    it("should return an error if amount exceed by 25% his total of jobs to pay", async () => {
      const mockedProfile = { id: 1, balance: 100 };
      const mockedUnpaidJobs = [{ price: 50 }, { price: 30 }];

      Profile.findByPk.mockResolvedValue(mockedProfile);
      jobBusiness.getUnpaidJobs.mockResolvedValue(mockedUnpaidJobs);
      const commitMock = jest.fn();
      const rollbackMock = jest.fn();
      sequelize.transaction.mockResolvedValue({
        commit: commitMock,
        rollback: rollbackMock,
      });

      balanceBusiness.addBalance = jest.fn();

      await expect(balanceBusiness.depositBalance(1, 100)).rejects.toThrow(
        AuthorizationError
      );
    });

    it("should call transaction rollback if add balance method fails", async () => {
      const mockedProfile = { id: 1, balance: 100 };
      const mockedUnpaidJobs = [{ price: 50 }, { price: 30 }];

      Profile.findByPk.mockResolvedValue(mockedProfile);
      jobBusiness.getUnpaidJobs.mockResolvedValue(mockedUnpaidJobs);
      const commitMock = jest.fn();
      const rollbackMock = jest.fn();
      sequelize.transaction.mockResolvedValue({
        commit: commitMock,
        rollback: rollbackMock,
      });

      balanceBusiness.addBalance = jest.fn(() => Promise.reject());

      await expect(balanceBusiness.depositBalance(1, 4)).rejects.toThrow(Error);
      expect(rollbackMock).toHaveBeenCalled();
    });
  });
});
