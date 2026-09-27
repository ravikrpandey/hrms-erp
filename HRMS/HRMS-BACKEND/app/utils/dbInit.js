const db = require('../models/index');

async function initAttendanceVerificationDb() {
    try {
        const queryInterface = db.sequelize.getQueryInterface();

        await db.attendance_verification_audit.sync();
        try {
            await db.sequelize.query(`
                ALTER TABLE ESS_ATTENDANCE_VERIFICATION_AUDIT 
                MODIFY COLUMN location_status VARCHAR(50) NOT NULL,
                MODIFY COLUMN face_status VARCHAR(50) NOT NULL,
                MODIFY COLUMN overall_status VARCHAR(50) NOT NULL,
                MODIFY COLUMN failure_reason TEXT NULL;
            `);
        } catch (e) {}

        const branchTableDesc = await queryInterface.describeTable('MASTER_BRANCH').catch(() => null);
        if (branchTableDesc) {
            if (!branchTableDesc.latitude) {
                await queryInterface.addColumn('MASTER_BRANCH', 'latitude', {
                    type: db.Sequelize.DECIMAL(10, 8),
                    allowNull: true,
                });
            }
            if (!branchTableDesc.longitude) {
                await queryInterface.addColumn('MASTER_BRANCH', 'longitude', {
                    type: db.Sequelize.DECIMAL(11, 8),
                    allowNull: true,
                });
            }
            if (!branchTableDesc.geofence_radius_meters) {
                await queryInterface.addColumn('MASTER_BRANCH', 'geofence_radius_meters', {
                    type: db.Sequelize.INTEGER,
                    defaultValue: 150,
                });
            }
            if (!branchTableDesc.is_geofence_active) {
                await queryInterface.addColumn('MASTER_BRANCH', 'is_geofence_active', {
                    type: db.Sequelize.BOOLEAN,
                    defaultValue: true,
                });
            }
        }

        const attTableDesc = await queryInterface.describeTable('ESS_DAILY_ATTENDANCE').catch(() => null);
        if (attTableDesc) {
            if (!attTableDesc.verification_status) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'verification_status', {
                    type: db.Sequelize.ENUM('VERIFIED', 'UNVERIFIED', 'OVERRIDDEN'),
                    defaultValue: 'UNVERIFIED',
                });
            }
            if (!attTableDesc.face_verified) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'face_verified', {
                    type: db.Sequelize.BOOLEAN,
                    defaultValue: false,
                });
            }
            if (!attTableDesc.location_verified) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'location_verified', {
                    type: db.Sequelize.BOOLEAN,
                    defaultValue: false,
                });
            }
            if (!attTableDesc.punch_latitude) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'punch_latitude', {
                    type: db.Sequelize.DECIMAL(10, 8),
                    allowNull: true,
                });
            }
            if (!attTableDesc.punch_longitude) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'punch_longitude', {
                    type: db.Sequelize.DECIMAL(11, 8),
                    allowNull: true,
                });
            }
            if (!attTableDesc.punch_accuracy_meters) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'punch_accuracy_meters', {
                    type: db.Sequelize.FLOAT,
                    allowNull: true,
                });
            }
            if (!attTableDesc.calculated_distance_meters) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'calculated_distance_meters', {
                    type: db.Sequelize.FLOAT,
                    allowNull: true,
                });
            }
            if (!attTableDesc.geofence_branch_id) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'geofence_branch_id', {
                    type: db.Sequelize.INTEGER,
                    allowNull: true,
                });
            }
            if (!attTableDesc.audit_id) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'audit_id', {
                    type: db.Sequelize.BIGINT,
                    allowNull: true,
                });
            }
            if (!attTableDesc.punch_mode) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'punch_mode', {
                    type: db.Sequelize.STRING(50),
                    defaultValue: 'FACE_MATCHED',
                });
            }
            if (!attTableDesc.punch_image_path) {
                await queryInterface.addColumn('ESS_DAILY_ATTENDANCE', 'punch_image_path', {
                    type: db.Sequelize.STRING(255),
                    allowNull: true,
                });
            }
            try {
                await db.sequelize.query(`
                    ALTER TABLE ESS_DAILY_ATTENDANCE 
                    MODIFY COLUMN verification_status VARCHAR(50) DEFAULT 'UNVERIFIED';
                `);
            } catch (e) {}
        }

        const fs = require('fs');
        const path = require('path');
        const captureDir = path.join(process.cwd(), 'uploaded_files', 'attendance_captures');
        if (!fs.existsSync(captureDir)) {
            fs.mkdirSync(captureDir, { recursive: true });
        }

        setTimeout(() => {
            syncExistingProfileFaceDescriptors().catch(() => {});
        }, 3000);

    } catch (error) {
        console.warn("Attendance verification DB init warning:", error.message);
    }
}

async function syncExistingProfileFaceDescriptors() {
    try {
        const { getFaceDescriptor } = require('./faceMatch');
        const fs = require('fs');
        const path = require('path');

        const usersWithoutDescriptors = await db.user.findAll({
            where: {
                face_descriptor: null,
                status: 'ACTIVE'
            },
            attributes: ['employee_id', 'first_name', 'last_name', 'employee_photo'],
            limit: 100
        });

        if (!usersWithoutDescriptors || usersWithoutDescriptors.length === 0) return;

        for (const emp of usersWithoutDescriptors) {
            if (!emp.employee_photo) continue;
            let cleanPath = emp.employee_photo.replace(/^.*uploaded_files\//, 'uploaded_files/');
            let fullPath = path.join(process.cwd(), cleanPath);

            if (fs.existsSync(fullPath)) {
                try {
                    const descriptor = await getFaceDescriptor(fullPath);
                    if (descriptor) {
                        const descriptorJson = JSON.stringify(Array.from(descriptor));
                        await db.user.update(
                            { face_descriptor: descriptorJson },
                            { where: { employee_id: emp.employee_id } }
                        );
                    }
                } catch (err) {}
            }
        }
    } catch (e) {}
}

module.exports = { initAttendanceVerificationDb, syncExistingProfileFaceDescriptors };
