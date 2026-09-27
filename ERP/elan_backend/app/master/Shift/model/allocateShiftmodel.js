module.exports = (sequelize, Sequelize) => {
    const shiftAllocate = sequelize.define("ALLOCATE_SHIFT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        createdAt:{
            type: Sequelize.DATE,
            defaultValue: new Date,
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
    return shiftAllocate;
}