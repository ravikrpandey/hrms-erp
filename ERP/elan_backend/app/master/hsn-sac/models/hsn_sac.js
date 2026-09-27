module.exports = (sequelize, Sequelize) => {
    const hsn_sac_master = sequelize.define("MASTER_HSN_SAC_CODE", {
         id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code_type: {
            type: Sequelize.ENUM("HSN", "SAC"),
            defaultValue: "HSN"
        },
        hsn_sac_code: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        exemption: {
            type: Sequelize.ENUM("YES", "NO"),
            defaultValue: "YES"
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
    return hsn_sac_master;
};