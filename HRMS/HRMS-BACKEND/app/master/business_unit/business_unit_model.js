module.exports = (sequelize, Sequelize) => {
    const business_unit_master = sequelize.define("BUSINESS_UNIT_MASTER", {
        business_unit_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        businessunit_name: {
            type: Sequelize.STRING
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
    },
        {
            freezeTableName: true
        }
    );

    return business_unit_master;
};
