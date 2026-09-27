module.exports = (sequelize, Sequelize) => {
  const proposalPayment = sequelize.define(
    "CRM_PROPOSAL_PAYMENT_MST",
    {
      id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true,
      },
      total_received: {
        type: Sequelize.INTEGER,
      },
      payment_mode:{
        type: Sequelize.STRING,
      },
      reference_number:{
        type: Sequelize.STRING,
      },
      bank_name:{
        type: Sequelize.STRING,
      },
      amount:{
        type: Sequelize.FLOAT,
      },
      remark:{
        type: Sequelize.STRING,
      },
      payment_status:{
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      status:{
        type: Sequelize.ENUM('ACTIVE',"INACTIVE"),
        defaultValue: 'ACTIVE'
      }
    },
    {
      freezeTableName: true,
    }
  );
  return proposalPayment;
};