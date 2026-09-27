module.exports = (sequelize, Sequelize) => {
  const createPostingPeriodMonthList = sequelize.define('MASTER_POSTING_PERIOD_MONTH_LIST', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    month: {
      type: Sequelize.STRING,
      allowNull: true
    },
 
    status: {
      type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    },
    {
      freezeTableName: true,
    }
  );
  return createPostingPeriodMonthList;
};
