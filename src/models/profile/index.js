const { Sequelize, Model } = require("sequelize");
const getSchema = require("./schema");

class Profile extends Model {
  /**
   * Init the model class.
   * @param {object} sequelize Sequelize instance.
   */
  static init(sequelize) {
    return super.init(getSchema(Sequelize), {
      modelName: "Profile",
      sequelize,
    });
  }

  /**
   * Allow you associate this model with others models.
   * @param {object} models All the system models
   */
  static associate(models) {
    this.hasMany(models.Contract, {
      as: "Contractor",
      foreignKey: "ContractorId",
    });
    this.hasMany(models.Contract, { as: "Client", foreignKey: "ClientId" });
  }

  hasSufficientBalance(amount) {
    return this.balance >= amount;
  }
}

module.exports = Profile;
