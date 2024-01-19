const { PROFILE_TYPES } = require("../../src/utils/constants/models");
const {
  InsufficientBalanceError,
  AuthorizationError,
  EntityNotFoundError,
} = require("../../src/errors");
const { sequelize, Profile, Job } = require("../../src/models");
const jobBusiness = require("../../src/business/jobBusiness");
const balanceBusiness = require("../../src/business/balanceBusiness");

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

  describe("executeJobPayment", () => {
    it("should pay a job successfully", async () => {
      const clientProfile = { id: 1 };
      const jobId = 1;
      const job = {
        id: 1,
        getContract: jest.fn(() =>
          Promise.resolve({ isClientId: jest.fn(() => true), ContractorId: 2 })
        ),
        save: jest.fn(),
      };
      const contractorProfile = { id: 2 };

      const commitMock = jest.fn();
      const rollbackMock = jest.fn();
      sequelize.transaction.mockResolvedValue({
        commit: commitMock,
        rollback: rollbackMock,
      });

      Job.findByPk = jest.fn(() => Promise.resolve(job));
      Profile.findByPk = jest.fn(() => Promise.resolve(contractorProfile));
      balanceBusiness.transferMoney = jest.fn(() => Promise.resolve(true));

      const result = await balanceBusiness.executeJobPayment(
        clientProfile,
        jobId
      );

      expect(result).toBe(true);
      expect(Job.findByPk).toHaveBeenCalledWith(jobId);
      expect(job.getContract).toHaveBeenCalledWith();
      expect(Profile.findByPk).toHaveBeenCalledWith(2);
      expect(balanceBusiness.transferMoney).toHaveBeenCalledWith(
        clientProfile,
        contractorProfile,
        job.price,
        expect.any(Object)
      );
      expect(job.save).toHaveBeenCalledWith(expect.any(Object));
      expect(sequelize.transaction).toHaveBeenCalledWith();
      expect(commitMock).toHaveBeenCalledWith();
    });

    it("should throw EntityNotFoundError if the job is not found", async () => {
      const clientProfile = { id: 1 };
      const jobId = 2;

      Job.findByPk = jest.fn(() => Promise.resolve(null));

      await expect(
        balanceBusiness.executeJobPayment(clientProfile, jobId)
      ).rejects.toThrow(EntityNotFoundError);

      expect(Job.findByPk).toHaveBeenCalledWith(jobId);
    });

    it("should throw EntityNotFoundError if the job is already paid", async () => {
      const clientProfile = { id: 1 };
      const jobId = 3;
      const job = { id: 3, paid: true };

      Job.findByPk = jest.fn(() => Promise.resolve(job));

      await expect(
        balanceBusiness.executeJobPayment(clientProfile, jobId)
      ).rejects.toThrow(EntityNotFoundError);

      expect(Job.findByPk).toHaveBeenCalledWith(jobId);
    });

    it("should throw EntityNotFoundError if the contract does not belong to the client", async () => {
      const clientProfile = { id: 1 };
      const jobId = 4;
      const job = {
        id: 4,
        getContract: jest.fn(() =>
          Promise.resolve({ isClientId: jest.fn(() => false) })
        ),
      };

      Job.findByPk = jest.fn(() => Promise.resolve(job));

      await expect(
        balanceBusiness.executeJobPayment(clientProfile, jobId)
      ).rejects.toThrow(EntityNotFoundError);

      expect(Job.findByPk).toHaveBeenCalledWith(jobId);
      expect(job.getContract).toHaveBeenCalledWith();
    });

    it("should throw Error if the transaction fails", async () => {
      const clientProfile = { id: 1 };
      const jobId = 5;
      const job = {
        id: 5,
        getContract: jest.fn(() =>
          Promise.resolve({ isClientId: jest.fn(() => true), ContractorId: 2 })
        ),
        save: jest.fn(),
      };
      const contractorProfile = { id: 2 };

      Job.findByPk = jest.fn(() => Promise.resolve(job));
      Profile.findByPk = jest.fn(() => Promise.resolve(contractorProfile));
      balanceBusiness.transferMoney = jest.fn(() =>
        Promise.reject(new Error())
      );

      const commitMock = jest.fn();
      const rollbackMock = jest.fn();
      sequelize.transaction.mockResolvedValue({
        commit: commitMock,
        rollback: rollbackMock,
      });

      await expect(
        balanceBusiness.executeJobPayment(clientProfile, jobId)
      ).rejects.toThrow(Error);

      expect(Job.findByPk).toHaveBeenCalledWith(jobId);
      expect(job.getContract).toHaveBeenCalledWith();
      expect(Profile.findByPk).toHaveBeenCalledWith(2);
      expect(balanceBusiness.transferMoney).toHaveBeenCalledWith(
        clientProfile,
        contractorProfile,
        job.price,
        expect.any(Object)
      );
      expect(rollbackMock).toHaveBeenCalledWith();
    });
  });
});
