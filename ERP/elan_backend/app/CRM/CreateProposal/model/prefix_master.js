const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const prefix_mst = sequelize.define(
    "PREFIX_MASTER",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      prefix_name:{
        type: Sequelize.STRING,
      },
     
      prefix_description:{
        type: Sequelize.STRING,
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
  return prefix_mst;
};