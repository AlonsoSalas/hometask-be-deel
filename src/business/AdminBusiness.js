const uniq = require("lodash/uniq");
const groupBy = require("lodash/groupBy");
const orderBy = require("lodash/orderBy");
const mapValues = require("lodash/mapValues");
const sumBy = require("lodash/sumBy");
const { Op } = require("sequelize");
const { Job, Profile } = require("../models");

class AdminBusiness {
  async getBestClients(req, res) {
    return [];
  }

  async getBestProfession(start = null, end = null) {
    const whereClause = {};

    if (start && end) {
      whereClause.createdAt = {
        [Op.between]: [new Date(start), new Date(end)],
      };
    } else if (start) {
      whereClause.createdAt = { [Op.gte]: new Date(start) };
    } else if (end) {
      whereClause.createdAt = { [Op.lte]: new Date(end) };
    }

    const jobs = await Job.findAll({
      where: { paid: true, ...whereClause },
      include: "Contract",
    });

    const contractorIds = uniq(jobs.map((job) => job.Contract.ContractorId));

    const profiles = await Profile.findAll({
      attributes: ["id", "profession"],
      where: { id: { [Op.in]: contractorIds } },
    });

    const contractorProfessions = profiles.reduce((result, profile) => {
      result[profile.id] = profile.profession;
      return result;
    }, {});

    const groupedJobs = groupBy(
      jobs,
      (job) => contractorProfessions[job.Contract.ContractorId]
    );
    const summedJobs = mapValues(groupedJobs, (group) => sumBy(group, "price"));

    const sortedResult = orderBy(
      Object.entries(summedJobs),
      ["1"],
      ["desc"]
    ).reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {});

    return sortedResult;
  }
}

const adminBusiness = new AdminBusiness();
module.exports = adminBusiness;
