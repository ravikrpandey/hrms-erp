module.exports = (sequelize, Sequelize) => {
    const cashPayment = sequelize.define('CASH_PAYMENT', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      posting_date: {
        type: Sequelize.DATEONLY, 
      },
      document_number: {
        type: Sequelize.STRING, 
      },
      transaction_date: {
        type: Sequelize.DATEONLY, 
      },
      voucher_type:{
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.STRING,
      },
      cheque_ref_no: {
        type: Sequelize.STRING, 
      },
      cheque_ref_date: {
        type: Sequelize.DATEONLY, 
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
      manage_advance: {
        type: Sequelize.STRING, 
      },
      party_type: {
        type: Sequelize.STRING, 
      },
      document_type: {
        type: Sequelize.STRING, 
      },
      others:{
        type: Sequelize.STRING, 
      },
      reference_number:{
        type: Sequelize.STRING, 
      },
      document_value:{
        type: Sequelize.DECIMAL(20,2), 
      },
       currency_rate:{
        type: Sequelize.DECIMAL(20,2), 
      },
      },
      {
        freezeTableName: true,
      }
    );
    return cashPayment;
  };
  