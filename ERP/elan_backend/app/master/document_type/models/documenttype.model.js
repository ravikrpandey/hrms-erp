
const DataTypes  = require("sequelize");
const Sequelize  = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const DocumentTypeMaster = sequelize.define("MASTER_DOCUMENT_TYPE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        document_name: {
            type: Sequelize.STRING,
            allowNull: true,
        }, 
        status: {
            type: Sequelize.ENUM("ACTIVE" , "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull :true
          },      
    },
    
    {
      freezeTableName: true,
    });
  
    return DocumentTypeMaster;
  };