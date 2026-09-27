const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const proposalAddtionalCharges = sequelize.define(
    "CRM_PROPOSAL_ADDTIONAL_LIST_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      charge_name:{
        type:Sequelize.STRING
      },
      amount:{
        type: Sequelize.INTEGER
      },
      tax_rate:{
        type:Sequelize.INTEGER
      },
      description:{
        type:Sequelize.STRING
      },
      hsn_code_id:{
        type:Sequelize.STRING
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
  return proposalAddtionalCharges;
};