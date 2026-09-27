module.exports = (sequelize, Sequelize) => {
    const countryssDetails = sequelize.define("MASTER_STATE", {
        states_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        states_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        // countryss_id: {
        //     type: Sequelize.INTEGER,
            // references: {
            //     model: 'countrysses',
            //     key: 'countryss_id',
            // },
        // },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }

    },{
        freezeTableName: true
    });
    return countryssDetails;
};