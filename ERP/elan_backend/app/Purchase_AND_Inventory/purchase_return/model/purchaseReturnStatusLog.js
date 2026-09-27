module.exports = (sequelize, Sequelize) => {
  const PurchaseReturnStatusLog = sequelize.define(
    "PURCHASE_RETURN_STATUS_LOGS",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      purchase_return_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    },
  );

  return PurchaseReturnStatusLog;
};
