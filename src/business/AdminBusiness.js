const uniq = require("lodash/uniq");
const { Op } = require("sequelize");
const { Job, Profile } = require("../models");
const { generateDateRangeWhereClause } = require("../helpers/queryHelper");

class AdminBusiness {
  async getBestClients(start = null, end = null) {
    const whereClause = generateDateRangeWhereClause(start, end);

    const jobs = await Job.findAll({
      where: { paid: true, ...whereClause },
      include: "Contract",
    });

    const clientIds = uniq(jobs.map((job) => job.Contract.ClientId));

    const profiles = await Profile.findAll({
      attributes: ["id", "firstName", "lastName"],
      where: { id: { [Op.in]: clientIds } },
    });

    const sortedResult = Object.values(
      jobs
        .map((job) => {
          const profile = profiles.find(
            (profile) => profile.id === job.Contract.ClientId
          );
          return {
            id: profile.id,
            fullName: `${profile.firstName} ${profile.lastName}`,
            price: job.price,
          };
        })
        .reduce((result, { id, fullName, price }) => {
          result[id] = result[id] || { id, fullName, paid: 0 };
          result[id].paid += price;
          return result;
        }, {})
    ).sort((a, b) => b.paid - a.paid);

    return sortedResult;
  }

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

    const sortedResult = jobs
      .map((job) => ({
        profession: profiles.find(
          (profile) => profile.id === job.Contract.ContractorId
        ).profession,
        price: job.price,
      }))
      .reduce((result, { profession, price }) => {
        result[profession] = (result[profession] || 0) + price;
        return result;
      }, {});

    return sortedResult;
  }
}

const adminBusiness = new AdminBusiness();
module.exports = adminBusiness;
