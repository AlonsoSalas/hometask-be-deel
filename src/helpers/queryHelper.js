const { Op } = require("sequelize");

const generateDateRangeWhereClause = (start, end) => {
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

  return whereClause;
};

module.exports = {
  generateDateRangeWhereClause,
};
