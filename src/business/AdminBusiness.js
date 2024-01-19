const uniq = require("lodash/uniq");
const { Op } = require("sequelize");
const { Job, Profile } = require("../models");
const {
  generateDateRangeWhereClause,
} = require("../utils/helpers/queryHelper");

/**
 * Business logic class for handling admin-related operations.
 */
class AdminBusiness {
  /**
   * Retrieves the best clients based on their paid jobs within a specified date range.
   * @param {Date} start - Start date of the date range.
   * @param {Date} end - End date of the date range.
   * @param {number} limit - Maximum number of clients to retrieve (default is 2).
   * @returns {Array} An array of clients with their accumulated paid amounts.
   */
  async getBestClients(start = null, end = null, limit = 2) {
    const whereClause = generateDateRangeWhereClause(start, end);

    const jobs = await Job.findAll({
      where: { paid: true, ...whereClause },
      include: "Contract",
    });

    const clientIds = uniq(jobs.map((job) => job.Contract.ClientId));

    const profiles = await Profile.findAll({
      attributes: ["id", "firstName", "lastName"],
      where: { id: { [Op.in]: uniq(clientIds) } },
    });

    const jobsWithProfile = jobs.map((job) => {
      const profile = profiles.find(
        (profile) => profile.id === job.Contract.ClientId
      );
      return {
        id: profile.id,
        fullName: `${profile.firstName} ${profile.lastName}`,
        price: job.price,
      };
    });

    const clients = jobsWithProfile
      .reduce((clientsWithJobsAcum, { id, fullName, price }) => {
        const existingEntry = clientsWithJobsAcum.find(
          (entry) => entry.id === id
        );
        if (existingEntry) {
          existingEntry.paid += price;
        } else {
          clientsWithJobsAcum.push({ id, fullName, paid: price });
        }
        return clientsWithJobsAcum;
      }, [])
      .sort((a, b) => b.paid - a.paid);

    return clients.slice(0, limit);
  }

  /**
   * Retrieves the best professions based on their earned amounts within a specified date range.
   * @param {Date} start - Start date of the date range.
   * @param {Date} end - End date of the date range.
   * @returns {Array} An array of professions with their accumulated earned amounts.
   */
  async getBestProfession(start = null, end = null) {
    const whereClause = generateDateRangeWhereClause(start, end);

    const jobs = await Job.findAll({
      where: { paid: true, ...whereClause },
      include: "Contract",
    });

    const contractorIds = uniq(jobs.map((job) => job.Contract.ContractorId));

    const profiles = await Profile.findAll({
      attributes: ["id", "profession"],
      where: { id: { [Op.in]: contractorIds } },
    });

    const jobsProfession = jobs.map((job) => {
      const profile = profiles.find(
        (profile) => profile.id === job.Contract.ContractorId
      );
      return {
        profession: profile.profession,
        price: job.price,
      };
    });

    const fundsByProfession = Object.values(
      jobsProfession
        .reduce((result, { profession, price }) => {
          const existingEntry = result.find(
            (entry) => entry.profession === profession
          );
          if (existingEntry) {
            existingEntry.earned += price;
          } else {
            result.push({ profession, earned: price });
          }
          return result;
        }, [])
        .sort((a, b) => b.earned - a.earned)
    );

    return fundsByProfession;
  }
}

const adminBusiness = new AdminBusiness();
module.exports = adminBusiness;
