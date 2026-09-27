module.exports = (sequelize, Sequelize) => {
  const currency_convert = sequelize.define("MASTER_CURRENCY_CONVERT", {
    Currency_Convert_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Currency_Type: {
      type: Sequelize.STRING
    },
    rate: {
      type: Sequelize.DECIMAL(10, 5),
      require: true,
    },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
      allowNull: true
    },
    symbols: {
      type: Sequelize.STRING,
      allowNull: false
    },
    word_symbols: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isDeleted: {
      type: Sequelize.BOOLEAN(true, false),
      defaultValue: false
    }
  },

    {
      freezeTableName: true,
    });

  return currency_convert;
};