module.exports = (sequelize, Sequelize) => {
    const KpaObjective = sequelize.define(
      "HRMS_KPA_OBJECTIVE",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        objective_name: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING(2500),
        },
        objective_code: {
          type: Sequelize.STRING(50),
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
          defaultValue: "ACTIVE",
        },
        // financial_year_id: {
        //   type: Sequelize.INTEGER,
        //   allowNull: true,
        // },
        // department_id: {
        //   type: Sequelize.INTEGER,
        //   allowNull: true,
        // },
        isDeleted: {
          type: Sequelize.BOOLEAN(true, false),
          defaultValue: false,
        },
      },
      {
        freezeTableName: true,
      }
    );
    return KpaObjective;
};