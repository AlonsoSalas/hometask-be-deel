const { CONTRACT_STATUS } = require("../../utils/constants/models");

module.exports = (Sequelize) => ({
  terms: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM(Object.values(CONTRACT_STATUS)),
  },
});
