module.exports = (sequelize, Sequelize) => {
    const auditor_booking = sequelize.define("MASTER_AUDITOR_BOOKING", {
        auditer_booking_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sales_request_id:{
            type: Sequelize.INTEGER,
        },
       
        lead_genration_id:{
            type:Sequelize.INTEGER,
            
        },

        br_number:{
            type:Sequelize.STRING,
        },
         status:{
            type:Sequelize.STRING,
        },
      
        new_location_id:{
            type:Sequelize.STRING,
        },
                
                leadAuditor:{
                    type:Sequelize.JSON,
                },
                leadAuditor_bookedDate:{
                    type:Sequelize.JSON,
                },
                co_auditorData:{
                    type:Sequelize.JSON,
                },
                coAuditor_bookedDate:{
                    type:Sequelize.JSON,
                },
                traineeauditorData:{
                    type:Sequelize.JSON,
                },
                traineeAuditor_bookedDate:{
                    type:Sequelize.JSON,
                },
                technicalAuditorData:{
                    type:Sequelize.JSON,
                },
                technicalAuditor_bookedDate:{
                    type:Sequelize.JSON,
                },
                candidateAuditorData:{
                    type:Sequelize.JSON,
                },
                candidateAuditor_bookedDate:{
                    type:Sequelize.JSON,
                },
                witnessAuditorData:{
                    type:Sequelize.JSON,
                },
                witnessAuditor_bookedDate:{
                    type:Sequelize.JSON,
                },
                workOrdercomponentId:{
                    type:Sequelize.INTEGER,
                },
                workOrder:{
                    type:Sequelize.INTEGER,
                },

                status:{
                    type:Sequelize.STRING
                },
                sales_request_state: {
                    type: Sequelize.ENUM("parent", "child","both"),
                    defaultValue: "parent",
                },
    },
    
    {
      freezeTableName: true,
    });
    return auditor_booking;
}