const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const createLeadDetails = sequelize.define(
    "CRM_CREATE_LEAD_MASTER_DETAILS",
    {
      id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      apply_scheme: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      promo_item: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      new_item: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      proposal_no:{
        type:Sequelize.TEXT,
      },
      
      promo_order_qty: {
        type: Sequelize.INTEGER
     
      },
      isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }

    },
    {
      freezeTableName: true,
    }
  );
  return createLeadDetails;
};