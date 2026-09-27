module.exports = (sequelize, Sequelize) => {
    const Master_Contract = sequelize.define("MASTER_CONTRACT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        contract_type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },

        {
            freezeTableName: true,
        })
        ;
    return Master_Contract;
};
