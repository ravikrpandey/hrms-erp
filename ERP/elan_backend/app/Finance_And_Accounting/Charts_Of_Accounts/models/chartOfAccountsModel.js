module.exports = (sequelize, Sequelize) => {
const createChartOfAccounts = sequelize.define('CHART_OF_ACCOUNTS', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  account_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  root_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  marks_cash_account:{
    type: Sequelize.STRING,
  },
  // account_type_id: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // },
  // account_group: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // },
  account_code: {
    type: Sequelize.STRING,
    allowNull: false
  },

  // opening_balance: {
  //   type: Sequelize.FLOAT,
  //   allowNull: true,
  // },

  debit_balance: {
    type: Sequelize.DECIMAL(20,2),
    allowNull: true,
  },

  credit_balance: {
    type: Sequelize.DECIMAL(20,2),
    allowNull: true,
  },

  balance: {
    type: Sequelize.DECIMAL(20,2),
    allowNull: true,
  },

  report_type: {
    type: Sequelize.STRING,
    allowNull: true
  },
  balance_must_be: {
    type: Sequelize.STRING,
    allowNull: true
  },
  status_type: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  },

root_type_status: {
type: Sequelize.STRING,
allowNull: true
},

  is_group: {
    type: Sequelize.ENUM('yes','no'),
    defaultValue: 'no'
  },

is_fixed:{
type:Sequelize.ENUM('yes', 'no'),
defaultValue: 'no'
},

  parent_account: {
    type: Sequelize.INTEGER,
    allowNull: true
  },

  remarks: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  isDeleted: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '0'
  }

},
        {
            freezeTableName: true
        });
    return createChartOfAccounts
}
