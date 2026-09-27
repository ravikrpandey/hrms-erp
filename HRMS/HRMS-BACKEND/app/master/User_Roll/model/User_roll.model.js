module.exports = (sequelize, Sequelize) => {
    const userRollDetails = sequelize.define("MASTER_USER_ROLL", {
        userRoll_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        md_ceo: {
            type: Sequelize.STRING
        },
        sr_vp: {
            type: Sequelize.STRING
        },
        agm: {
            type: Sequelize.STRING
        },
        gm: {
            type: Sequelize.STRING
        },
        vp: {
            type: Sequelize.STRING
        },
        aup: {
            type: Sequelize.STRING
        },
        sr_gm: {
            type: Sequelize.STRING
        },
        sr_manager: {
            type: Sequelize.STRING
        },
        manager: {
            type: Sequelize.STRING
        },
        asso_manager: {
            type: Sequelize.STRING
        },
        sr_executive: {
            type: Sequelize.STRING
        },
        executive: {
            type: Sequelize.STRING
        },
        asso_executive: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        }
    },
    
    {
      freezeTableName: true,
    })
    return userRollDetails;
}
