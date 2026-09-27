module.exports = (sequelize, Sequelize) => {
    const mapDetails = sequelize.define("MASTER_MUNICIPALITY_LOG", {
       id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        increase:{
            type:Sequelize.INTEGER
        },
        decrease:{
            type:Sequelize.INTEGER
        },
        totalamount:{
            type:Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        start_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
            allowNull: true
        },
        end_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
    },
    {
      freezeTableName: true,
    })
    ;
    return mapDetails;
};
