module.exports = (sequelize, Sequelize) => {
    const paymentAdviceAccount = sequelize.define('PAYMENT_ADVICE_ACCOUNT_LIST', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    debit_amount: {
        type: Sequelize.DECIMAL(20,0),
    },
    credit_amount: {
        type: Sequelize.DECIMAL(20,0),
    },
    narration: {
      type: Sequelize.STRING,
    },
    nature: {
      type: Sequelize.STRING,
    },
    current_rate: {
        type: Sequelize.DECIMAL(20,0),
    },
    tds_rate_amount: {
        type: Sequelize.DECIMAL(20,0),
    },
    amount_due:{
        type: Sequelize.DECIMAL(20,2), 
      },
    // surcharge: {
    //     type: Sequelize.STRING,
    // },
    // surcharge_rate: {
    //     type: Sequelize.DECIMAL(20,0),
    // },
    // surcharge_amount: {
    //     type: Sequelize.DECIMAL(20,0),
    // },
    // cess: {
    //     type: Sequelize.STRING,
    // },
    // cess_rate: {
    //     type: Sequelize.DECIMAL(20,0),
    // },
    // cess_amount: {
    //     type: Sequelize.DECIMAL(20,0),
    // },
    // gross_amount: {
    //     type: Sequelize.DECIMAL(20,0),
    // },
    party_type:{
        type:Sequelize.STRING
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
    return paymentAdviceAccount;
  };
  