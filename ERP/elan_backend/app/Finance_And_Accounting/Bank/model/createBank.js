module.exports = (sequelize, Sequelize) => {
  const createBank = sequelize.define('MASTER_BANK', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bank_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    swift_number: {
      type: Sequelize.STRING,
      allowNull: true
    },
    branch: {
      type: Sequelize.STRING,
      allowNull: true
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true
    },
    ifsc_code: {
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
  return createBank;
};
