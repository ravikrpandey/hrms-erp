module.exports = (sequelize, Sequelize) => {

    const faceDetect = sequelize.define("PATIENTS", {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        uuid: {
            type: Sequelize.STRING(36),
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },

        uhid: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
        },

        entity_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        title: {
            type: Sequelize.ENUM("Mr", "Mrs", "Ms"),
        },

        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        last_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        date_of_birth: Sequelize.DATEONLY,

        age: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        gender: {
            type: Sequelize.ENUM("Male", "Female", "TG"),
            allowNull: false,
        },

        marital_status: Sequelize.STRING,
        blood_group: Sequelize.STRING,

        photo: Sequelize.STRING,

        patient_status: {
            type: Sequelize.ENUM("converted", "clear"),
            defaultValue: "converted",
        },

        id_proof_type: {
            type: Sequelize.STRING,
            defaultValue: "AADHAAR",
        },

        id_proof_no: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        relation_of: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        relation_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        relation_phone: {
            type: Sequelize.STRING(15),
            allowNull: true,
        },

        address: {
            type: Sequelize.TEXT,
            allowNull: true,
        },


        city_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },

        state_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },

        country_id: {
            type: Sequelize.INTEGER,
           allowNull: true,
        },

        area: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        pincode: {
            type: Sequelize.STRING(10),
            allowNull: true,
        },
        face_descriptor: {
            type: Sequelize.TEXT, 
            allowNull: true
        },

        status: {
            type: Sequelize.ENUM("Active", "InActive"),
            defaultValue: "Active",
        },

        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },

        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },

        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },

    }, {
        freezeTableName: true,
        timestamps: false,
        indexes: [
            { fields: ["entity_id"] },
            { fields: ["uhid"] }
        ]
    });

    return Patient;
};
