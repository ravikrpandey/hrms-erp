module.exports = (sequelize, Sequelize) => {
    const attendanceVerificationAudit = sequelize.define(
        "ESS_ATTENDANCE_VERIFICATION_AUDIT",
        {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            employee_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            entry_type: {
                type: Sequelize.ENUM("IN", "OUT"),
                allowNull: false,
            },
            attempt_timestamp: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            overall_status: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            face_status: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            face_match_score: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            face_distance: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            location_status: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            latitude: {
                type: Sequelize.DECIMAL(10, 8),
                allowNull: true,
            },
            longitude: {
                type: Sequelize.DECIMAL(11, 8),
                allowNull: true,
            },
            accuracy_meters: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            calculated_distance_meters: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            target_branch_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            ip_address: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            user_agent: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            failure_reason: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            idempotency_key: {
                type: Sequelize.STRING(64),
                allowNull: true,
                unique: true,
            },
        },
        {
            freezeTableName: true,
            indexes: [
                {
                    name: "idx_att_audit_emp_time",
                    fields: ["employee_id", "attempt_timestamp"],
                },
                {
                    name: "idx_att_audit_status",
                    fields: ["overall_status"],
                },
            ],
        }
    );

    return attendanceVerificationAudit;
};

