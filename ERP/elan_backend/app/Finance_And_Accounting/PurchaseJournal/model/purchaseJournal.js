const { DECIMAL } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const purchaseJournal = sequelize.define('PURCHASE_JOURNAL', {
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
      party_type: {
        type: Sequelize.STRING, 
      },
      notes: {
        type: Sequelize.STRING,
      },
      reference_number:{
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
      document_type:{
        type: Sequelize.STRING,
      }, 

      taxable: {
        type: Sequelize.DECIMAL(20,2),                   
      },
      cgst: {
        type: Sequelize.DECIMAL(20,2), 
      }, 
      currency_rate: {
        type: Sequelize.DECIMAL(20,5), 
      },
      sgst: {
        type: Sequelize.DECIMAL(20,2), 
      },
      igst: {
        type: Sequelize.DECIMAL(20,2), 
      },
      gstTotal: {
        type: Sequelize.DECIMAL(20,2), 
      },
       gross: {
        type: Sequelize.DECIMAL(20,2), 
      },
       net: {
        type: Sequelize.DECIMAL(20,2), 
      },
      tdsAmt: {
        type: Sequelize.DECIMAL(20,2), 
      },
       rcmLiability: {
        type: Sequelize.DECIMAL(20,2), 
      },
      less_amount:{
        type:Sequelize.DECIMAL(20,4)
      }
 
      },
      {
        freezeTableName: true,
      }
    );
    return purchaseJournal;
};
  