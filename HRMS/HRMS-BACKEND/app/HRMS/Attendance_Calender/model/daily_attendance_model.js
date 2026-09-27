module.exports = (sequelize, Sequelize) => {
    const daily_attendance = sequelize.define("ESS_DAILY_ATTENDANCE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        att_day: {
            type: Sequelize.STRING,
        },
        att_month: {
            type: Sequelize.INTEGER,
        },
        att_year: {
            type: Sequelize.INTEGER,
        },
        att_date: {
            type: Sequelize.STRING,
        },
        att_checktime: {
            type: Sequelize.STRING,
        },
        att_time: {
            type: Sequelize.STRING,
        },
        checkInloc: {
            type: Sequelize.STRING,
        },
        checkoutloc: {
            type: Sequelize.STRING,
        },
        job_type: {
            type: Sequelize.ENUM("WFO", "WFH"),
            defaultValue: "WFO",
        },
        entry_type: {
            type: Sequelize.ENUM("IN", "OUT"),
            defaultValue: "IN",
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        att_mode:{
            type:Sequelize.ENUM("BIOMETRIC","MANUAL","AUTO","ONLINE","FACE"),
            defaultValue: "BIOMETRIC"
        },
        verification_status: {
            type: Sequelize.STRING(50),
            defaultValue: "UNVERIFIED",
        },
        punch_mode: {
            type: Sequelize.STRING(50),
            defaultValue: "FACE_MATCHED",
        },
        punch_image_path: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        face_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        location_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        punch_latitude: {
            type: Sequelize.DECIMAL(10, 8),
            allowNull: true,
        },
        punch_longitude: {
            type: Sequelize.DECIMAL(11, 8),
            allowNull: true,
        },
        punch_accuracy_meters: {
            type: Sequelize.FLOAT,
            allowNull: true,
        },
        calculated_distance_meters: {
            type: Sequelize.FLOAT,
            allowNull: true,
        },
        geofence_branch_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        audit_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        }
    );
    return daily_attendance;
};