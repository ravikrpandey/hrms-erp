const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const addDo = sequelize.define(
    "CRM_ADD_DO_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      do_date: {
        type: Sequelize.DATEONLY
      },
      billing_address: {
        type: Sequelize.TEXT,
      },
      shipping_address: {
        type: Sequelize.TEXT
      },
      proposal_no: {
        type: Sequelize.STRING
      },
      order_number: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.STRING
      },
      terms_and_conditions: {
        type: Sequelize.STRING
      },
      upload_file: {
        type: Sequelize.STRING
      },
      dispatch_status: {
        type: Sequelize.ENUM("PENDING", "APPROVED"),
        defaultValue: "PENDING",
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      dispatch_status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED'),
        defaultValue: "PENDING",
      },
      branch_id: {
        type: Sequelize.INTEGER
      },
      state_id: {
        type: Sequelize.INTEGER
      }

    },

    {
      freezeTableName: true,
    }
  );
  return addDo;
};