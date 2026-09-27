module.exports = (sequelize, Sequelize) => {
    const bomDetails = sequelize.define("PRODUCTION_BOM_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        bom_qty:{
            type: Sequelize.INTEGER
        },
        type:{
            type: Sequelize.STRING
        },
        scrape:{
            type: Sequelize.STRING
        },
        scrape_reuseable:{
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
       
    }, {
        freezeTableName: true
    });

    return bomDetails;
};
