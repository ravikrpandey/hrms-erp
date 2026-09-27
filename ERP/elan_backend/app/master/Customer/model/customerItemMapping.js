module.exports = (sequelize, Sequelize) => {
    const customerItemMapping = sequelize.define(
      "CUSTOMER_ITEM_MAPPING",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },       
        item_name: {
          type: Sequelize.STRING
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE", 'BLACKLISTED'),
          defaultValue: "ACTIVE",
        },
        is_Deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      },
  
      {
        freezeTableName: true,
      }
    );
    return customerItemMapping;
  };