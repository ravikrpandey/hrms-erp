module.exports = (sequelize, Sequelize) => {
    const bomDetails = sequelize.define("PRO_BOM_DETAILS_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        item_type:{
            type: Sequelize.STRING
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
