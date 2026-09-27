module.exports = (sequelize, Sequelize) => {
    const new_spaDetails = sequelize.define("MASTER_NEW_SAP", {
        new_spa_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        product_master_id: {
            type: Sequelize.INTEGER,
        },
        segment_id: {
            type: Sequelize.INTEGER,
        },
        certificate_type_id: {
            type: Sequelize.INTEGER,
        },
        isChecked: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: true,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        filter_status:{
            type: Sequelize.STRING,
            defaultValue:"HRMS"
          }
    },
    
    {
      freezeTableName: true,
    });
    return new_spaDetails;
}