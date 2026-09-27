module.exports = (sequelize, Sequelize) => {
    const DesignationAllocation = sequelize.define(
      "LMS_DESIGNATION_ALLOCATION",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        assign_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        entity_id: {
        type: Sequelize.JSON
      },
        designation_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        freezeTableName: true,
      }
    );
  
    return DesignationAllocation;
  };
  