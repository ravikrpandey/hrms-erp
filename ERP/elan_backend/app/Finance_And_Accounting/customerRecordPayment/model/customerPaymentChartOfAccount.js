module.exports = (sequelize, Sequelize) => {
    const customerRecordPaymentAccount = sequelize.define('CUSTOMER_RECORD_PAYMENT_ACCOUNT', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      payment_mode:{
        type: Sequelize.STRING,
      },
       amount:{
        type: Sequelize.STRING,
      },
      
      },
      {
        freezeTableName: true,
      }
    );
    return customerRecordPaymentAccount;
};
  