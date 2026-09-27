module.exports = (sequelize, Sequelize) => {
    const hrms_notification = sequelize.define("HRMS_NOTIFICATION", {
        hrms_notification_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        employee_id: {
            type: Sequelize.INTEGER,
        },
        is_read: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,  
        },
        message: {
            type: Sequelize.STRING,
        },
        notification_type: {
            type: Sequelize.ENUM("OFFER_LETTER", "CANDIDATE_PROF", "MANPOWER", "INTERVIEW", "SHORTLIST_CAND", "TRAVEL_REQ", "TRAVEL_APPROVAL", "EXP_REQ", "LEAVE_APPLY", "LEAVE_APPROVE","LEAD_SUMMARY", "LEGAL_ACTION", "LEGAL_ASSIGNED","INTERNAL_CC_ACTION","INTERNAL_COMPILANCE_ACTION","INTERNAL_CONTACTFOR_ACTION","LEGAL_INTERNAL_DISCUSSION","LEGAL_DISCUSSION", "DELEGATE LEADS", "LIBRARY APPROVAL", "SUPPLIER APPROVAL", "PROSPECT_STATUS",'COMPOFF_EMPLOYEE', 'ANNOUNCEMENT' ),
        },
    },
        {
            freezeTableName: true,
        });
    
    return hrms_notification;
}