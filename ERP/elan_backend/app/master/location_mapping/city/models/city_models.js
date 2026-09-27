module.exports = (sequelize, Sequelize) => {
    const cityDetails = sequelize.define("MASTER_CITY", {
        city_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        city_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        states_id: {
            type: Sequelize.INTEGER,
            // references: {
            //     model: 'states',
            //     key: 'states_id',
            // },
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        filter_status:{
            type: Sequelize.STRING,
            defaultValue:"HRMS"
          }

    },{
        freezeTableName: true
    });
    return cityDetails;
};