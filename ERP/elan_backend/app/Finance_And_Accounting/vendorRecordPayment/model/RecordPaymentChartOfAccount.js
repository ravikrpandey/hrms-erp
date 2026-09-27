module.exports = (sequelize, Sequelize) => {
    const vendorRecordPaymentAccount = sequelize.define('VENDOR_RECORD_PAYMENT_ACCOUNT', {
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
    return vendorRecordPaymentAccount;
};
  