module.exports = (sequelize, Sequelize) => {
    const currency_convert = sequelize.define("MASTER_CURRENCY_CONVERT", {
              Currency_Convert_id:{
                type:Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
              },
              Currency_Type:{
                type:Sequelize.STRING
              },
              default_status: {
                type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
                defaultValue: "INACTIVE",
              },
              symbols: {
                type: Sequelize.STRING,
                allowNull: false
              },
              word_symbols: {
                type: Sequelize.STRING,
                allowNull: false
              },
              currency_unit: {
                type: Sequelize.STRING,
                allowNull: false
              },
              currency_fraction: {
                type: Sequelize.STRING,
                allowNull: false
              },
              rate: {
                type: Sequelize.DECIMAL(10, 5),
                require: true,
            },
    },
    
    {
      freezeTableName: true,
    });
  
    return currency_convert;
  };