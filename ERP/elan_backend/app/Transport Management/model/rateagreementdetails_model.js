module.exports = (sequelize, Sequelize) => {
    const rateAgreementDetails_mapping = sequelize.define("TM_RATE_AGREEMENT_DETAIL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        rate: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        extra_charge: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        remark: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
        },
        {
            freezeTableName: true,
        });
    return rateAgreementDetails_mapping;
};
