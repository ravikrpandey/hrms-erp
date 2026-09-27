module.exports = (sequelize, Sequelize) => {
    const certificate_typeDetails = sequelize.define("MASTER_NEW_CERTIFICATE_TYPE", {
        certificate_type_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        certificate_type_name: {
            type: Sequelize.STRING
        },
        segment_id: {
            type: Sequelize.INTEGER,
        },
        isChecked: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: true,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
    
    {
      freezeTableName: true,
    });
    return certificate_typeDetails;
}