module.exports = (sequelize, Sequelize) => {
    const new_regionDetails = sequelize.define("MASTER_NEW_REGION", {
        new_region_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        new_region_name: {
            type: Sequelize.STRING
        },
        segment_id: {
            type: Sequelize.INTEGER,
        },
        certificate_type:{
            type:Sequelize.INTEGER,
        },
        certificate_type_name:{
            type:Sequelize.STRING,
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
    return new_regionDetails;
}