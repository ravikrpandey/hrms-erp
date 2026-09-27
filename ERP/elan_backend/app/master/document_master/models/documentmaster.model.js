
const DataTypes  = require("sequelize");
const Sequelize  = require("sequelize");


module.exports = (sequelize, Sequelize) => {
    const DocumentMaster = sequelize.define("MASTER_DOCUMENT", {
        document_master_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        folder_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        employee_photo: {
            type:Sequelize.JSON,
            allowNull: true,
        },
        file_name: {
            type: Sequelize.JSON,
            allowNull: true
        },
        file_category: {
            type: Sequelize.JSON,
            allowNull: true
        },
        author: {
            type: Sequelize.STRING,
            allowNull: true
        },
        version: {
            type: Sequelize.STRING,
            allowNull: true
        },
        file_description: {
            type: Sequelize.STRING,
            allowNull: true
        }, 
        employee_id: {
            type: Sequelize.INTEGER,
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
  
    return DocumentMaster;
  };