module.exports = (sequelize, Sequelize) => {
    const purchaseJournalAccount = sequelize.define('PURCHASE_JOURNAL_ACCOUNT_LIST', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    debit_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
    credit_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
    qty: {
      type: Sequelize.INTEGER,
    },
    rate: {
        type: Sequelize.DECIMAL(20,2),
    },
    gst_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
    narration: {
        type: Sequelize.STRING,
    },
    remarks: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE'
    },
    tds_rate_amount:{
        type: Sequelize.DECIMAL(20,2),
    }
    },
    {
        freezeTableName: true,
    }
    );
    return purchaseJournalAccount;
  };
  