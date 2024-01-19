const jobController = require("../../src/controllers/jobController");
const jobBusiness = require("../../src/business/jobBusiness");
const balanceBusiness = require("../../src/business/balanceBusiness");

jest.mock("../../src/business/jobBusiness");
jest.mock("../../src/business/balanceBusiness");

describe("JobController", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getUnpaidJobs", () => {
    it("should respond with unpaid jobs", async () => {
      const mockProfile = { id: 1 };
      const mockUnpaidJobs = [{ id: 1, description: "Job 1", price: 100 }];

      jobBusiness.getUnpaidJobs.mockResolvedValueOnce(mockUnpaidJobs);

      const req = { profile: mockProfile };
      const res = {
        json: jest.fn(),
      };

      await jobController.getUnpaidJobs(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUnpaidJobs);
      expect(jobBusiness.getUnpaidJobs).toHaveBeenCalledWith({
        profileId: mockProfile.id,
      });
    });
  });

  describe("payJob", () => {
    it("should respond with payment successful message", async () => {
      const mockProfile = { id: 1 };
      const mockJobId = "123";

      balanceBusiness.executeJobPayment.mockResolvedValueOnce(true);

      const req = { profile: mockProfile, params: { jobId: mockJobId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await jobController.payJob(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Payment successful." });
      expect(balanceBusiness.executeJobPayment).toHaveBeenCalledWith(
        mockProfile,
        mockJobId
      );
    });
  });
});
