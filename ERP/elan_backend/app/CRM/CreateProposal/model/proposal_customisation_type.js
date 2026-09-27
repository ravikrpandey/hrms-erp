const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const proposal_customisation_type = sequelize.define(
    "CRM_PROPOSAL_CUSTOMISATION_TYPE",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    qty : {
      type:Sequelize.INTEGER,
      defaultValue:true,
    },
    order_qty : {
      type:Sequelize.INTEGER,
    },
    remaining_qty : {
      type:Sequelize.INTEGER,
    },
    select_scheme : {
      type:Sequelize.JSON,
    },
    total_in_gst:{
      type: Sequelize.DECIMAL(30,0),
    },
    // total_out_gst:{
    //   type: Sequelize.DECIMAL(30,0),
    // },
    grand_in_total:{
      type: Sequelize.DECIMAL(30,0)
    },
    grand_out_total:{
      type: Sequelize.DECIMAL(30,0)
    },
    substract_total:{
      type:Sequelize.BOOLEAN,
    },
    add_total:{
      type:Sequelize.BOOLEAN,
      defaultValue: true
    },
    proposal_no:{
      type:Sequelize.TEXT,
    },
    // customer_type:{
    //   type: Sequelize.ENUM("EXISTING", "NEW"),
    //         defaultValue: "NEW",
    // },
    remarks:{
      type: Sequelize.TEXT
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
  return proposal_customisation_type;
};