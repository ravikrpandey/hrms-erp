module.exports = (sequelize, Sequelize) => {
    const vehical_driver = sequelize.define("TM_VEHICAL_DRIVER", {
        driver_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        full_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        
        driver_code: {
            type: Sequelize.STRING,
            allowNull: true
        },
        
        date_of_birth: {
            type: Sequelize.STRING,
            allowNull: true
        },
        gender: {
            type: Sequelize.ENUM("Male", "Female", "Other"),
            allowNull: true
        },
        profile_picture: {
            type: Sequelize.STRING,
            allowNull: true
        },
        blood_group: {
            type: Sequelize.STRING,
            allowNull: true
        },
        nationality: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mobile_number: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        alternate_contact_number: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email_address: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        residential_address: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        permanent_address: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        driving_license_number: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        license_issuing_authority: {
            type: Sequelize.STRING,
            allowNull: true
        },
        license_type: {
            type: Sequelize.ENUM("LMV", "HMV"),
            allowNull: true
        },
        license_expiry_date: {
            type: Sequelize.STRING,
            allowNull: true
        },
        aadhar_number: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        pan_number: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        passport_number: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        work_permit_expiry_date: {
            type: Sequelize.STRING,
            allowNull: true
        },
        police_verification_status: {
            type: Sequelize.ENUM("Verified", "Pending"),
            allowNull: true,
            defaultValue: "Pending"
        },
        employment_type: {
            type: Sequelize.ENUM("Full-time", "Contract", "Vendor"),
            allowNull: true
        },
        vendor_agency_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        date_of_joining: {
            type: Sequelize.STRING,
            allowNull: true
        },
        experience_years: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        driving_license_copy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        id_proof_copy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        police_verification_document: {
            type: Sequelize.STRING,
            allowNull: true
        },
        medical_fitness_certificate: {
            type: Sequelize.STRING,
            allowNull: true
        },
        work_permit_document: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    },
    {
        freezeTableName: true,
    });

    return vehical_driver;
};
