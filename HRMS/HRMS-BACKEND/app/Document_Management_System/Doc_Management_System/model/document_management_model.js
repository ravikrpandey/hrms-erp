module.exports = (sequelize, Sequelize) => {
    const document_management_system = sequelize.define(
        "DOCUMENT_MANAGEMENT_SYSTEM",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            document_category: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isIn: [['Employee-related', 'Company Policies', 'Compliance Documents', 'Training & Performance']]
                }
            },
            designation_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            states_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            uploaded_date: {
                type: Sequelize.DATEONLY(),
                defaultValue: Sequelize.NOW
            },
            upload_document: {
                type: Sequelize.TEXT, // Store JSON string of file metadata
                allowNull: true
            },
            uploaded_by: {
                type: Sequelize.STRING,
                allowNull: true
            },
            version: {
                type: Sequelize.STRING,
                defaultValue: '1.0'
            },
            status: {
                type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
                defaultValue: "ACTIVE",
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );

    return document_management_system;
};
