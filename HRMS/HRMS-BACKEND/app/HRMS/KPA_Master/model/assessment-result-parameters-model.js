module.exports = (sequelize, Sequelize) => {
  const model = sequelize.define(
    "HRMS_ASSESSMENT_RESULT_MST",
      {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
              type: Sequelize.STRING,
        },
        value: {
              type: Sequelize.INTEGER,
        },
        minGrade: {
            type: Sequelize.INTEGER,
        },
        maxGrade: {
            type: Sequelize.INTEGER,
        },
        description: {
            type: Sequelize.STRING(1000),
        },
        category: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
    },
    {
      freezeTableName: true,
    }
  );
  return model;
};
