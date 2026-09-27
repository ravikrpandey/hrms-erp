


module.exports = (sequelize, Sequelize) => {
    const submittedAssessement = sequelize.define("PM_SUBMITTED_ASSESSMENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM("Pending For Self Assessment", "Committee Review Completed", "Pending For Manager Review", "Manager Review Completed", "Pending Committee Review", "Pending For Approval" ,"Approval Review Completed"),
            defaultValue: "Pending For Manager Review",
        },
        manager_review_date: {
            type: Sequelize.DATEONLY("DD-MM-YYYY"),
        },
        manager_remark: {
            type: Sequelize.TEXT,
        },

        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        remark: {
            type: Sequelize.TEXT,
        }
    },

        {
            freezeTableName: true,
        });
    return submittedAssessement;
};
