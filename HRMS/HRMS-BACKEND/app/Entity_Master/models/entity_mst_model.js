module.exports = (sequelize, Sequelize) => {
  const entityMaster = sequelize.define(
    "ENTITY_MASTER",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      entity_name: {
        type: Sequelize.STRING,
      },
      tax_registration_number: {
        type: Sequelize.STRING,
      },
      registered_office: {
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },
      signature_logo: {
        type: Sequelize.STRING,
      },
      smtp_server_address: {
        type: Sequelize.STRING,
      },
      smtp_port_number: {
        type: Sequelize.STRING,
      },
      smtp_username: {
        type: Sequelize.STRING,
      },
      smtp_password: {
        type: Sequelize.STRING,
      },
      employee_code_prefix: {
        type: Sequelize.STRING,
      },
      currency_id: {
        type: Sequelize.STRING,
      },
      pf_number: { type: Sequelize.STRING },
      esic_number: { type: Sequelize.STRING },
      tan_number: { type: Sequelize.STRING },
      pan_number: { type: Sequelize.STRING },
      lin_number: { type: Sequelize.STRING },
      gst_number: { type: Sequelize.STRING },
      registration_certificate_number: { type: Sequelize.STRING },
      zip_code: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      employer_name: {
        type: Sequelize.STRING,
      },
      company_branch: {
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
  return entityMaster;
};
