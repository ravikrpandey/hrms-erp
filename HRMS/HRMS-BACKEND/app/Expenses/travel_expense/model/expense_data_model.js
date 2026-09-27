module.exports = (sequelize, Sequelize) => {
  const expense_request_data = sequelize.define(
    "EXPENSE_REQUEST_DATA",
    {
      id: { 
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      expense_name: {
        type: Sequelize.STRING,
      },
      bill_no: {
        type: Sequelize.STRING,
      },
      expense_description: {
        type: Sequelize.STRING, // ✅ New field added
      },
      expense_date: {
        type: Sequelize.DATEONLY, // ✅ no arguments allowed
        get() {
          const rawValue = this.getDataValue("expense_date");
          if (!rawValue) return null;

          const date = new Date(rawValue);
          const day = ("0" + date.getDate()).slice(-2);
          const month = ("0" + (date.getMonth() + 1)).slice(-2);
          const year = date.getFullYear();
          return `${year}-${month}-${day}`;
        },
      },

      expense_remarks: {
        type: Sequelize.STRING,
      },
      exp_amount: {
        type: Sequelize.DECIMAL(12, 2),
      },
      travel_range: {
        type: Sequelize.DECIMAL(12, 2),
      },
      expense_document: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE", "ALLOCATED"),
        defaultValue: "ACTIVE",
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return expense_request_data;
};
