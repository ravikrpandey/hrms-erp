module.exports = (sequelize, Sequelize) => {
    const candidate_bgv_company = sequelize.define("RECRUITMENT_CANDIDATE_BGV_COMPANYS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        company_name: {
            type: Sequelize.STRING,
        },
        start_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
        },
        end_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
        },
        remarks:{
            type: Sequelize.TEXT,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        });
    return candidate_bgv_company;
};
