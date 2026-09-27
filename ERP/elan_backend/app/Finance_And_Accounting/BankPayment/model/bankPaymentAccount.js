module.exports = (sequelize, Sequelize) => {
    const bankPaymentAccount = sequelize.define('BANK_PAYMENT_ACCOUNT_LIST', {
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
    tds: {
      type: Sequelize.STRING,
    },
     remarks: {
      type: Sequelize.STRING,
    },
    tds_rate: {
        type: Sequelize.DECIMAL(20,2),
    },
    tds_rate_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
    surcharge: {
        type: Sequelize.STRING,
    },
    party_type:{
        type:Sequelize.STRING
    },
    surcharge_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
    cess: {
        type: Sequelize.STRING,
    },
    cess_rate: {
        type: Sequelize.DECIMAL(20,2),
    },
    cess_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
    gross_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
    status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE'
    },
    amount_due:{
        type: Sequelize.DECIMAL(20,2), 
      },
    },
    {
        freezeTableName: true,
    }
    );
    return bankPaymentAccount;
  };
  