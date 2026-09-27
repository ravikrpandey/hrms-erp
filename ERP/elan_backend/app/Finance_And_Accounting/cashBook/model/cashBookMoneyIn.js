module.exports = (sequelize, Sequelize) => {
const createCashBookMoneyIn = sequelize.define('CASH_BOOK_MONEY_IN', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: true
  },

  // opening_balance: {
  //   type: Sequelize.FLOAT,
  //   allowNull: true,
  // },

  amount: {
    type: Sequelize.DECIMAL(20,2),
    allowNull: true,
  },

  reference: {
    type: Sequelize.STRING,
    allowNull: true
  },

  form_type: {
    type: Sequelize.STRING,
    allowNull: true
  },
 
  status: {
    type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  },

  // parent_account: {
  //   type: Sequelize.INTEGER,
  //   allowNull: true
  // },

  description: {
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
    return createCashBookMoneyIn
}
