module.exports = (sequelize, Sequelize) => {
    const vehiclePlanningTransporterAgreement = sequelize.define(
      "WH_VH_PLANNING_TRANS_AGREEMENT",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
          defaultValue: "ACTIVE",
        },
      },
      {
        freezeTableName: true,
        timestamps: true, 
      }
    );
  
    return vehiclePlanningTransporterAgreement;
  };
  