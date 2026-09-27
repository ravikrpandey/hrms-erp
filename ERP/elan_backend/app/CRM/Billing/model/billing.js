module.exports = (sequelize, Sequelize) => {
    const billingData = sequelize.define(
      "CRM_PROPOSAL_BILLING_MST",
      {
        id: {
          type: Sequelize.INTEGER, 
          primaryKey: true,
          autoIncrement: true,
        },
        company_name:{
            type: Sequelize.STRING,
        },
        gst_no:{
            type: Sequelize.STRING,
        },
        complete_address:{
            type: Sequelize.TEXT,
        },
        status:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
      },
      {
        freezeTableName: true,
      }
    );
    return billingData;
  };