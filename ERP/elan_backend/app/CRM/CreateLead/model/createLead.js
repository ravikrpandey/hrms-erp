const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const createLead = sequelize.define(
    "CRM_CREATE_LEAD_MST",
    {
      id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true,
      },
      company_name: {
        type: Sequelize.STRING,
      },
      lead_owner: {
        type: Sequelize.STRING,
      }, 
      contact_person_name: {
        type: Sequelize.STRING,
      },
      contact_number: {
        type: Sequelize.STRING,
      },
      mail_id:{
        type: Sequelize.STRING,
      },
      address:{
        type: Sequelize.STRING,
      },
      lead_created_date: {
        type: Sequelize.DATEONLY,
      },
      follow_up_date: {
        type: Sequelize.DATEONLY,
      },
      upload_image:{
        type: Sequelize.STRING(500),
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      dynamic_fields: {
        type: Sequelize.JSON,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return createLead;
};