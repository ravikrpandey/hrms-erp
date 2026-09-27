module.exports = (sequelize, Sequelize) => {
    const generate_label = sequelize.define("GENERATE_QUALITY_LABEL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        label_type:{
            type: Sequelize.ENUM('Bno','Sno'),
            defaultValue:'Bno'
        },
        batch_no:{
            type: Sequelize.STRING,
        },
        serial_no:{
            type: Sequelize.STRING,
            defaultValue: null

        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "INACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        freezeTableName: true
    });

    return generate_label ;
};