module.exports = (sequelize, Sequelize) => {
  const NpsScheme = sequelize.define("PAYROLL_NPS_SCHEME", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    schemeName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    employeeContribution: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    employerContribution: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    IsMinimum: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    minimumAmount: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    Iscapping: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    cappingAmount: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    employerContributionInCtc: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
  });

  return NpsScheme;
};
