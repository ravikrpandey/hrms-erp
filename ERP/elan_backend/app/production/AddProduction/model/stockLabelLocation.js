module.exports = (sequelize, Sequelize) => {
    const stockLabelLocation = sequelize.define("STOCK_LABEL_LOCATION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        label_type:{
            type: Sequelize.STRING,
            defaultValue:null
        },        
        batch_no:{
            type: Sequelize.STRING,
            defaultValue:null
        },        
        serial_no:{
            type: Sequelize.STRING,
            defaultValue:null
        },
    }, {
        freezeTableName: true
    });

    return stockLabelLocation;
};