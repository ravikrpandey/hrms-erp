module.exports = (sequelize, Sequelize) => {
    const user_family_details = sequelize.define("HRMS_REGISTERED_USER_FAMILY", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        member_name: {
            type: Sequelize.STRING,
        },
        date_of_birth: {
            type: Sequelize.STRING,
        },
        relation: {
            type: Sequelize.STRING,
        },
        country_code: {
            type: Sequelize.STRING,
        },
        contact_number: {
            type: Sequelize.STRING,
        },
        remarks: {
            type: Sequelize.STRING,
        },
        emergency_contact: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    }, {
        freezeTableName: true
    });
    return user_family_details;
};