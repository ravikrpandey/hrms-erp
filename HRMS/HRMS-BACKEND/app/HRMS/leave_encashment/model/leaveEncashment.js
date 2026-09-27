module.exports = (sequelize, Sequelize) => {
    const encashment = sequelize.define("PAYROLL_LEAVE_ENCASHMENT", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        month: {
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.TEXT
        },
        leaveId: {
            type: Sequelize.STRING
        },
        is_taxable:{
            type:Sequelize.BOOLEAN(true,false),
            defaultValue:false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return encashment;
};