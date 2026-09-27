module.exports = (sequelize, Sequelize) => {
    const countryssDetails = sequelize.define("MASTER_COUNTRY", {
        countryss_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        countryss_name: {
            type: Sequelize.STRING,
        },
        country_code: {
            type: Sequelize.STRING,
        },
        phone_code: {
            type: Sequelize.STRING,
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        filter_status:{
            type: Sequelize.STRING,
            defaultValue:"HRMS"
        }
    },{
        freezeTableName: true
    });
    return countryssDetails;
};