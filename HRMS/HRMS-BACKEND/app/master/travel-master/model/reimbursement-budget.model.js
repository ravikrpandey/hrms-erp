module.exports = (sequelize, Sequelize) => {
  const MASTER_REIMBURSEMENT_BUDGET = sequelize.define(
    "MASTER_REIMBURSEMENT_BUDGET",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gradeIds: {
        type: Sequelize.JSON,
        nullable: false,
      },
      budget_limit: {
        type: Sequelize.DECIMAL(10, 2),
        nullable: false,
      }
    },

    {
      freezeTableName: true,
    }
  );
  return MASTER_REIMBURSEMENT_BUDGET;
};
