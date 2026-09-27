module.exports = (sequelize, Sequelize) => {
    const paymentAdvice = sequelize.define('PAYMENT_ADVICE', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      document_number:{
        type: Sequelize.STRING,
      },
      posting_date: {
        type: Sequelize.DATEONLY, 
      },
      transaction_date: {
        type: Sequelize.DATEONLY, 
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
      document_value:{
        type: Sequelize.DECIMAL(20,2), 
      },
      amount_paid_now:{
        type: Sequelize.DECIMAL(20,2), 
      },
      document_value:{
        type: Sequelize.DECIMAL(20,2), 
      }
      },
      {
        freezeTableName: true,
      }
    );
    return paymentAdvice;
  };
  