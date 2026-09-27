const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const proposal_customisation_data = sequelize.define(
    "CRM_PROPOSAL_CUSTOMISATION_DATA",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      qty:{
        type: Sequelize.DECIMAL(30,0)
      },
      price_per_unit:{
        type: Sequelize.DECIMAL(30,0)
      },

      total_price:{
        type: Sequelize.DECIMAL(30,0)
      },
     
      customization_type:{
          type: Sequelize.STRING,
          allownull: true,
      },
      
      gst:{
        type: Sequelize.DECIMAL(30,0),
      },
    
      status:{
        type:Sequelize.BOOLEAN,
        defaultValue:true,
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
      custome_type:{
          type: Sequelize.STRING,
      },
      no_of_partician:{
          type: Sequelize.STRING,
      },
      totalDiscountAmount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalDiscountAmountPerQTY: {
        type: Sequelize.DECIMAL(20, 2),
      },
      },
    
    {
      freezeTableName: true,
    }
  );
  return proposal_customisation_data;
};