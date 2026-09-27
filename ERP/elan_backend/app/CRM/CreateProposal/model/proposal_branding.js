const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const proposal_branding = sequelize.define(
    "CRM_PROPOSAL_BRANDING",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      qty: {
        type: Sequelize.INTEGER,
        defaultValue: true,
      },

      branding_description: {
        type: Sequelize.STRING,

      },
      branding_amt: {
        type: Sequelize.DECIMAL(20, 2),

      },
      branding_sides: {
        type: Sequelize.JSON,

      },
      proposal_no:{
        type:Sequelize.TEXT,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      after_discount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      discount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      discountType:{
          type: Sequelize.STRING,
          allownull: true,
      },
      with_gst: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalDiscountAmount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalDiscountAmountPerQTY: {
        type: Sequelize.DECIMAL(20, 2),
      },
       gst:{
        type: Sequelize.DECIMAL(30,0),
      },
    },
    {
      freezeTableName: true,
    }
  );
  return proposal_branding;
};