module.exports = (sequelize, Sequelize) => {
    const rateAgreement_master = sequelize.define("TM_RATEAGREEMENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        agreement_no: {
            type: Sequelize.STRING,
        },
        agreement_type: {
            type: Sequelize.STRING,
        },
        valid_from: {
            type: Sequelize.DATEONLY,
        },
        valid_to: {
            type: Sequelize.DATEONLY,
        },
        agreement_copy: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
        },
        {
            freezeTableName: true,
        });
    return rateAgreement_master;
};
