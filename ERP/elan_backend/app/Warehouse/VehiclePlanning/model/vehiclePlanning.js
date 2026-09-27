module.exports = (sequelize, Sequelize) => {
  const vehiclePlanningMst = sequelize.define(
    "WH_VH_PLANNING_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      planning_code: {
        type: Sequelize.STRING,
      },
     
      status: {
        type: Sequelize.ENUM("Approved", "Rejected", "Pending"),
        defaultValue: "Pending",
      },
    
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      vehicle_root_status: {
        type: Sequelize.ENUM("VIA", "DIRECT"),
        defaultValue: "DIRECT",
      },
      irn_status: {
        type: Sequelize.ENUM("Approved", "Rejected", "Pending"),
        defaultValue: "Pending",
      },
    },
    {
      freezeTableName: true,
      timestamps: true, 
    }
  );
  return vehiclePlanningMst;
};
