const { Op } = require("sequelize");

const generateDateRangeWhereClause = (start, end) => {
  const whereClause = {};

  if (start && end) {
    whereClause.paymentDate = {
      [Op.between]: [start, end],
    };
  } else if (start) {
    whereClause.paymentDate = { [Op.gte]: start };
  } else if (end) {
    whereClause.paymentDate = { [Op.lte]: end };
  }

  return whereClause;
};

module.exports = {
  generateDateRangeWhereClause,
};
