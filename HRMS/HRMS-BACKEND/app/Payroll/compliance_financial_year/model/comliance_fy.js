module.exports = (sequelize, Sequelize) => {
  const comliance_fy = sequelize.define("PAYROLL_COMPLIANCE_FY_LIMITS",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      epf_individual_limit: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      epf_aggregate_cap: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      epf_remarks: {   // ✅ EPF remarks
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      nps_individual_limit: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      nps_aggregate_cap: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      nps_remarks: {   // ✅ NPS remarks
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      saf_individual_limit: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      saf_aggregate_cap: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      saf_remarks: {   // ✅ SAF remarks
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return comliance_fy;
};
  