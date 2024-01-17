module.exports = (Sequelize) => ({
  terms: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM("new", "in_progress", "terminated"),
  },
});
