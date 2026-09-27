module.exports = (sequelize, Sequelize) => {
    const hrmsLeaveEntitlementt = sequelize.define("HRMS_LEAVE_POLICY_ENTITLEMENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true,false),
            defaultValue: false
        },
        effective_value: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 0
        },
        effective_period: {
            type: Sequelize.ENUM('YEAR', 'MONTHS', 'DAYS'),
            defaultValue: 'DAYS'
        },
        effective_duration: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        effective_duration: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        from: {
            type: Sequelize.ENUM('DOJ', 'DOC'),
            defaultValue: 'DOJ'
        },
        carry_unused_leaves: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        unused_leaves_mode: {
            type: Sequelize.ENUM('UNIT', 'PERCENT'),
            defaultValue: "UNIT"
        },
        carry_unused_limit: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        encash_leaves: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        encash_mode: {
            type: Sequelize.ENUM('UNIT', 'PERCENT'),
            defaultValue: "UNIT"
        },
        encash_limit: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
    }, {
        freezeTableName: true,
        timestamps: true // Adds createdAt and updatedAt fields
    });
    return hrmsLeaveEntitlementt;
};

