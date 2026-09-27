const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const proposal_branding_scheme = sequelize.define(
    "CRM_PROPOSAL_BRANDING_SCHEME",
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
        type: Sequelize.INTEGER,

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
      }
    },
    {
      freezeTableName: true,
    }
  );
  return proposal_branding_scheme;
};