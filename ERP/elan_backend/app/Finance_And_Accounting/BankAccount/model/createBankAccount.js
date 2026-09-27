module.exports = (sequelize, Sequelize) => {
  const createBankAccount = sequelize.define('MASTER_BANK_ACCOUNT', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    account_name: {
      type: Sequelize.STRING,
      allowNull: false
    },

    mapped_company_gl_account: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_type: {
      type: Sequelize.STRING,
      allowNull: true
    },

    bank_account_no: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bank_ifsc_code: {
      type: Sequelize.STRING,
      allowNull: true
    },

    party_type: {
      type: Sequelize.STRING,
      allowNull: true
    },


    is_default_account: {
      type: Sequelize.STRING,
      allowNull: true
    },

    is_company_account: {
      type: Sequelize.STRING,
      allowNull: true
    },

    default_account_status:{
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue:'N'
    },



    iban: {
      type: Sequelize.STRING,
      allowNull: true
    },

    branch: {
      type: Sequelize.STRING,
      allowNull: true
    },


 
    status: {
      type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },

      isDeleted: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "0",
      },
    },
    {
      freezeTableName: true,
    }
  );
  return createBankAccount;
};
