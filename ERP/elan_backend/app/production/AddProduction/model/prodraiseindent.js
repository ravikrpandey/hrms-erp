module.exports = (sequelize, Sequelize) => {
    const prodraiseindent= sequelize.define("PROD_RAISE_INDENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        BOM_qty:{
            type: Sequelize.INTEGER,
        },
        total_required_qty:{
            type: Sequelize.INTEGER,
        },
        remark:{
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        freezeTableName: true
    });

    return prodraiseindent;
};