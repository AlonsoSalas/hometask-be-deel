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

  describe("payJob", () => {
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

      const result = await jobBusiness.payJob(clientProfile, jobId);

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

      await expect(jobBusiness.payJob(clientProfile, jobId)).rejects.toThrow(
        EntityNotFoundError
      );

      expect(Job.findByPk).toHaveBeenCalledWith(jobId);
    });

    it("should throw EntityNotFoundError if the job is already paid", async () => {
      const clientProfile = { id: 1 };
      const jobId = 3;
      const job = { id: 3, paid: true };

      Job.findByPk = jest.fn(() => Promise.resolve(job));

      await expect(jobBusiness.payJob(clientProfile, jobId)).rejects.toThrow(
        EntityNotFoundError
      );

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

      await expect(jobBusiness.payJob(clientProfile, jobId)).rejects.toThrow(
        EntityNotFoundError
      );

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
      balanceBusiness.transferMoney = jest.fn(() => Promise.reject(true));

      const commitMock = jest.fn();
      const rollbackMock = jest.fn();
      sequelize.transaction.mockResolvedValue({
        commit: commitMock,
        rollback: rollbackMock,
      });

      await expect(jobBusiness.payJob(clientProfile, jobId)).rejects.toThrow(
        Error
      );

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
