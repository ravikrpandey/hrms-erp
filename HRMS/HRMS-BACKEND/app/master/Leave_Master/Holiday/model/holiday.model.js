module.exports = (sequelize, Sequelize) => {
    const holiday_Details = sequelize.define("MASTER_HOLIDAY", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        financial_year_id:{
            type: Sequelize.INTEGER
        },
        entity_id:{
            type: Sequelize.INTEGER
        },
        holiday_name: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATEONLY("DD-MM_YYYY")
        },
        region_name: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    {
      freezeTableName: true,
    });
    return holiday_Details;
}