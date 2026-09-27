module.exports = (sequelize, Sequelize) => {
    const company_qual_rating = sequelize.define("RECRUITMENT_CANDIDATE_COMP_QUAL_RATINGS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quality_type_name: {
            type: Sequelize.STRING,
        },
        rating_value: {
            type: Sequelize.STRING(100),
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
    return company_qual_rating;
};
