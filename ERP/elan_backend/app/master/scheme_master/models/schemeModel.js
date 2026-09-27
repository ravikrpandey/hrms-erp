module.exports = (sequelize, Sequelize) => {
    const scheme_master = sequelize.define("MASTER_SCHEME", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        scheme_name: {
            type: Sequelize.STRING
        },

        description: {
            type: Sequelize.STRING
        },
        documents: {
            type: Sequelize.STRING
        },

        start_date: {
            type: Sequelize.DATEONLY,
        },
        end_date: {
            type: Sequelize.DATEONLY,
        },

        no_of_select_item: {
            type: Sequelize.STRING
        },

        scheme_type: {
            type: Sequelize.STRING
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },

        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true
        }
    )
    return scheme_master;
}