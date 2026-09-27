module.exports = (sequelize, Sequelize) => {
    const TechnicalAssessment = sequelize.define(
      "ESS_TECHNICAL_ASSESSMENT",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
          defaultValue: "ACTIVE",
        },
        final_rating: {
          type: Sequelize.STRING,
        },
        technical_average_rating: {
          type: Sequelize.DECIMAL(10, 2),
        },
        isDeleted: {
          type: Sequelize.BOOLEAN(true, false),
          defaultValue: false,
        },
        self_remark: {
          type: Sequelize.STRING(2500),
        },
        self_attachment: {
          type: Sequelize.STRING,
        },
      },

      {
        freezeTableName: true,
      }
    );
    return TechnicalAssessment;
};
