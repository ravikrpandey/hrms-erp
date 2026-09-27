module.exports = (sequelize, Sequelize) => {
const masterMonth = sequelize.define('MASTER_MONTH_LIST', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  month_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // account_type_id: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // },
  // currency: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // },
},
        {
            freezeTableName: true
        });
    return masterMonth
}
