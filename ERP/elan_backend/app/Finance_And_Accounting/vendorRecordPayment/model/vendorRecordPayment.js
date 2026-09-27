module.exports = (sequelize, Sequelize) => {
    const vendorRecordPayment = sequelize.define('VENDOR_RECORD_PAYMENT', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true     
      },
      documentNo:{
        type: Sequelize.STRING,
      },
      document_type:{
        type: Sequelize.STRING,
      }, 
      payment_type:{
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATEONLY, 
      },
      
      payment_method: {
        type: Sequelize.STRING,
      },
      recieved_amount: {
        type: Sequelize.DECIMAL(20,2), 
      },
      total_amount:{
        type: Sequelize.DECIMAL(20,2), 
      },
      amount_due:{
        type: Sequelize.DECIMAL(20,2), 
      },
      record_amount: {
        type: Sequelize.DECIMAL(20,2), 
      },
     
      tds_amount: {
        type: Sequelize.DECIMAL(20,2), 
      },
      net_amount: {
        type: Sequelize.DECIMAL(20,2), 
      },
      others: {
        type: Sequelize.STRING, 
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
      isDeleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
      },
      },
      {
        freezeTableName: true,
      }
    );
    return vendorRecordPayment;
};
  