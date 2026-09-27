module.exports = (sequelize, Sequelize) => {
    const grnVersion = sequelize.define("GRN_VERSION_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        version:{
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        version_status:{
            type: Sequelize.ENUM('PENDING', 'APPROVED','PARTIAL'),
            defaultValue: 'PENDING'
        }
       
    }, {
        freezeTableName: true
    });
    return grnVersion;
};