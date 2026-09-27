module.exports = (sequelize, Sequelize) => {
    const cashRecieptAccount = sequelize.define('CASH_RECIEPT_ACCOUNT_LIST', {
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
    
    surcharge: {
        type: Sequelize.STRING,
    },
    surcharge_rate: {
        type: Sequelize.DECIMAL(20,2),
    },
    surcharge_amount: {
        type: Sequelize.DECIMAL(20,2),
    },
    cess: {
        type: Sequelize.STRING,
    },
    remarks: {
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
    },
    {
        freezeTableName: true,
    }
    );
    return cashRecieptAccount;
  };
  