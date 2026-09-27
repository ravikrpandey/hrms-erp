module.exports = (sequelize, Sequelize) => {
    const country_codes = sequelize.define("MASTER_COUNTRY_CODES", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        country_name: {
            type: Sequelize.STRING,
        },
        dialing_code: {
            type: Sequelize.STRING,
        },
        country_code: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
    },{
        freezeTableName: true
    });
    return country_codes;
};