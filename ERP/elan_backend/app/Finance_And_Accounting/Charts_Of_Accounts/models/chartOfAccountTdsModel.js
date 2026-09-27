module.exports = (sequelize, Sequelize) => {
    const chartOfAccountTdsList = sequelize.define('CHART_OF_ACCOUNT_TDS_LIST', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },  
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
       
    },
            {
                freezeTableName: true
            });
        return chartOfAccountTdsList
    }
    