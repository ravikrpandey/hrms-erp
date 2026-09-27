module.exports = (sequelize, Sequelize) => {
    const bankPayment = sequelize.define('BANK_PAYMENT', {
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
       document_type: {
        type: Sequelize.STRING, 
      },
       party_type: {
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
      reference_number:{
        type: Sequelize.STRING, 
      },
      payment_advice_number:{
        type: Sequelize.STRING, 
      },
      cheque_ref_no: {
        type: Sequelize.STRING, 
      },
      cheque_ref_date: {
        type: Sequelize.DATEONLY, 
      },
      document_value:{
        type: Sequelize.DECIMAL(20,2), 
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
        type:Sequelize.STRING
      },
      payment_advice_ids:{
        type:Sequelize.STRING
      } ,
      
      currency_rate:{
        type:Sequelize.DECIMAL(20,5)
      }
      },
      {
        freezeTableName: true,
      }
    );
    return bankPayment;
  };
  