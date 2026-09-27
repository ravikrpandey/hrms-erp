module.exports = (sequelize, Sequelize) => {
    const financeProfitCenter = sequelize.define("FINANCE_PROFIT_CENTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        profit_center_id: {
            type: Sequelize.STRING
        },
        profit_center_name: {
            type: Sequelize.STRING
        },
        cost_profit_center_name: {
            type: Sequelize.STRING
        },
        created_on: {
            type: Sequelize.DATEONLY
        },
        type: {
            type: Sequelize.STRING
        },
        from_date: {
            type: Sequelize.DATEONLY
        },
        to_date: {
            type: Sequelize.DATEONLY
        },
        is_group: {
            type: Sequelize.ENUM("YES", "NO"),
            defaultValue: 'NO'
        },
        remark:{
            type: Sequelize.STRING
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        parent_profit_center_id:{
            type: Sequelize.INTEGER
        }
    }, {
        freezeTableName: true
    });
    return financeProfitCenter;
}
