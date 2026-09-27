const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const proposal_scheme_data = sequelize.define(
    "CRM_PROPOSAL_SCHEME_DATA",
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
          type: Sequelize.ENUM('IN','OUT'),
      },
      gst:{
        type: Sequelize.DECIMAL(30,0),
      },
    
      status:{
        type:Sequelize.BOOLEAN,
        defaultValue:true,
      }
    },
    
    {
      freezeTableName: true,
    }
  );
  return proposal_scheme_data;
};