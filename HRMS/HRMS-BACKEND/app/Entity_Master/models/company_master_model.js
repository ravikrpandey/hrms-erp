module.exports = (sequelize, Sequelize) => {
    const company_master = sequelize.define("COMPANY_DETAILS_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        company_name: {
            type: Sequelize.STRING
        },
        abbreviation: {
            type: Sequelize.STRING
        },     
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return company_master;
}
