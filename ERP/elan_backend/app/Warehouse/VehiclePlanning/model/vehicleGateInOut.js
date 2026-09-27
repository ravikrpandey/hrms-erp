module.exports = (sequelize, Sequelize) => {
  const vehicleGateInOutword = sequelize.define(
    "WH_VH_PLANNING_GATEIN_OUT",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      gate_inward_status: {
        type: Sequelize.ENUM("Approved", "Rejected", "Pending"),
        defaultValue: "Pending",
      },
      gate_pass_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        defaultValue: null
      },
      gate_inward_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      gate_outward_status: {
        type: Sequelize.ENUM("Approved", "Rejected", "Pending"),
        defaultValue: "Pending",
      },
      gate_outward_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      pickList_status: {
        type: Sequelize.ENUM("Approved", "Pending"),
        defaultValue: "Pending",
      },
      packing_list_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        defaultValue: null
      },
      packing_list_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      LR_status: {
        type: Sequelize.ENUM("Approved", "Pending"),
        defaultValue: "Pending",
      },
      LR_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        defaultValue: null
      },
      lr_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      vehicle_number: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      driver_name: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      driver_contact: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      vehicle_driver_remark: {
        type: Sequelize.STRING,
        defaultValue: null
      }
    },
    {
      freezeTableName: true,
      timestamps: true, 
    }
  );
  return vehicleGateInOutword;
};