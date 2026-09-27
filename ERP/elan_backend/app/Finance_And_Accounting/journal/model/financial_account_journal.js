module.exports = (sequelize, Sequelize) => {
  const financialAccountingJournal = sequelize.define(
    "FINANCIAL_AND_ACCOUNT_JOURNAL",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true,
      },
      posting_date: {
        type: Sequelize.DATEONLY, 
          allowNull: true
      },
      parent_journal_no: {
        type: Sequelize.STRING,
         defaultValue: null
      },
      journal_no: {
        type: Sequelize.STRING,
      },
      transaction_date: {
        type: Sequelize.DATEONLY,
        
          allowNull: true
      },
      notes: {
        type: Sequelize.STRING,
      },
      reference: {
        type: Sequelize.STRING,
      },
      reference_date: {
        type: Sequelize.DATEONLY,
        
          allowNull: true
      },
      bank_clearance_date: {
        type: Sequelize.DATEONLY,
        
          allowNull: true
      },
      currency_rate: {
        type: Sequelize.DECIMAL(20,2),
      },
      total_of_debit: {
        type: Sequelize.DECIMAL(20,2),
      },
      total_of_credit: {
        type: Sequelize.DECIMAL(20,2),
      },
      
      journal_status:{
        type: Sequelize.ENUM("PENDING", "APPROVED",'Other'),
        defaultValue: "PENDING",
      },
      party_type:{
        type: Sequelize.STRING,
         allowNull:true
      },
       
      bill_number:{
        type:Sequelize.STRING
      },
      financial_posting:{
        type:Sequelize.STRING
      },
      remaining:{
        type: Sequelize.DECIMAL(20,2),
        allowNull:true,
      },
      status:{
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
    },
    isDeleted:{
      type: Sequelize.BOOLEAN(true, false),
      defaultValue: false
  },
    isReversal:{
      type: Sequelize.BOOLEAN(true, false),
      defaultValue: false
  },
  journal_book_status:{
    type: Sequelize.ENUM("quick_entry", "Journal","Other","REVERSAL Entry"),
    defaultValue: "Journal",
  },
  party_type:{
    type:Sequelize.STRING
  },
  record_payment:{
    type: Sequelize.DECIMAL(20,2),
  },
  amount_due:{
    type: Sequelize.DECIMAL(20,2),
  },
  total_purchase:{
    type: Sequelize.DECIMAL(20,2),
  },
  document_type:{
    type: Sequelize.STRING
  },
    },

    {
      freezeTableName: true,
    }
  );
  return financialAccountingJournal;
};
