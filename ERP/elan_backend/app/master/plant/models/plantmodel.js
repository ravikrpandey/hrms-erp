module.exports = (sequelize, Sequelize) => {
    const plantmaster = sequelize.define("MASTER_PLANT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        plant_code: {
            type: Sequelize.STRING
        },
        plant_name: {
            type: Sequelize.STRING
        },
        plant_address: {
            type: Sequelize.STRING
        },
        plant_contactno: {
            type: Sequelize.STRING
        },
        plant_altcontactno: {
            type: Sequelize.STRING
        },
        plant_emailid: {
            type: Sequelize.STRING
        },
        plant_headname: {
            type: Sequelize.STRING
        },
        plant_headcontactno: {
            type: Sequelize.STRING
        },
        plant_location: {
            type: Sequelize.STRING
        },
        plant_pincode: {
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
    },{
        freezeTableName:true
    });
    return plantmaster;
};