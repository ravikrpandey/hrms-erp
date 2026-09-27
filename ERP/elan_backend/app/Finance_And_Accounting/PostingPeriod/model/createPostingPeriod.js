module.exports = (sequelize, Sequelize) => {
  const createPostingPeriod = sequelize.define('MASTER_POSTING_PERIOD', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    period_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    // start_date: {
    //   type: Sequelize.DATEONLY, 
    //     allowNull: true
    // },
    // end_date: {
    //   type: Sequelize.DATEONLY, 
    //     allowNull: true
    // },

  from_month: {
    type: Sequelize.STRING,
    allowNull: true
  },
  
  to_month: {
    type: Sequelize.STRING,
    allowNull: true
  },

    status: {
      type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },

      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return createPostingPeriod;
};
