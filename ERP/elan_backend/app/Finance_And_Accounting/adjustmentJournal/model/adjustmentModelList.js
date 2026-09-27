module.exports = (sequelize, Sequelize) => {
    const adjustmentJournalList = sequelize.define('ADJUSTMENT_JOURNAL_ACCOUNT_LIST', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    party_type:{
        type:Sequelize.STRING
    },
    debit_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
    credit_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
        remarks: {
        type: Sequelize.STRING,
    },
    
    
    status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE'
    },
    },
    {
        freezeTableName: true,
    }
    );
    return adjustmentJournalList;
  };
  