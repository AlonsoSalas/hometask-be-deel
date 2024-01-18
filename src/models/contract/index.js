const { Sequelize, Model } = require("sequelize");
const getSchema = require("./schema");

class Contract extends Model {
  /**
   * Init the model class.
   * @param {object} sequelize Sequelize instance.
   */
  static init(sequelize) {
    return super.init(getSchema(Sequelize), {
      modelName: "Contract",
      sequelize,
    });
  }

  /**
   * Allow you associate this model with others models.
   * @param {object} models All the system models
   */
  static associate(models) {
    this.belongsTo(models.Profile, { as: "Contractor" });
    this.belongsTo(models.Profile, { as: "Client" });
    this.hasMany(models.Job);
  }

  belongsToThisProfile(profileId) {
    return this.ClientId === profileId || this.ContractorId === profileId;
  }

  isClientId(profileId) {
    return this.ClientId === profileId;
  }
}

module.exports = Contract;
