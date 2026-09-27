module.exports = (sequelize, Sequelize) => {
    const proposal_approval = sequelize.define("PROPOSAL_APPROVAL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        level: {
            type: Sequelize.STRING
        },
        approvel_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING","REJECTED","FORWARD"),
            defaultValue: "PENDING"
        },
        progressStatus: {
            type: Sequelize.ENUM("OPEN", "CLOSE"),
            defaultValue: "OPEN"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
      
        workflow_type : {
            type: Sequelize.STRING
        },
        remark : {
            type: Sequelize.TEXT
        }
    },
        {
            freezeTableName: true
        });
    return proposal_approval
}