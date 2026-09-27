module.exports = (sequelize, Sequelize) => {
    const agreementLevelType = sequelize.define("TM_AGREEMENT_LEVEL_TYPE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM('L1','L2','L3'),
            allowNull: false,
            defaultValue: 'L1'
        },
        },
        {
            freezeTableName: true,
        });
    return agreementLevelType;
};
