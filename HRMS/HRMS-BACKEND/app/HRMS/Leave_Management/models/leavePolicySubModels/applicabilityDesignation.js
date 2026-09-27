module.exports = (sequelize, Sequelize) => {
    const hrmsLocationMaster = sequelize.define("HRMS_APPLICABILITY_DESIGNATION", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        isDeleted: {
          type: Sequelize.BOOLEAN(false,true),
          defaultValue: false,
        }
      }, {
        freezeTableName: true
    });
    return hrmsLocationMaster;
};