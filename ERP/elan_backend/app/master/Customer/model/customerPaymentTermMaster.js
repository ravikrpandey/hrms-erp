module.exports = (sequelize, Sequelize) => {
    const customerPaymentTermMaster = sequelize.define(
      "CUSTOMER_PAYMENT_TERM_MST",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        term_name: {
            type: Sequelize.STRING,
            comment: 'Advance Payment, 30 Days, 45 Days'
        },
        credit_days:{
          type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
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
    return customerPaymentTermMaster;
  };