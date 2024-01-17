const { Sequelize, Model } = require("sequelize");
const getSchema = require("./schema");

class Job extends Model {
  /**
   * Init the model class.
   * @param {object} sequelize Sequelize instance.
   */
  static init(sequelize) {
    return super.init(getSchema(Sequelize), {
      modelName: "Job",
      sequelize,
    });
  }

  /**
   * Allow you associate this model with others models.
   * @param {object} models All the system models
   */
  static associate(models) {
    this.belongsTo(models.Contract);
  }
}

module.exports = Job;
