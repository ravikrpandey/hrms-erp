module.exports = (sequelize, Sequelize) => {
    const sales_request = sequelize.define("MASTER_SALE_REQUEST", {
        sales_request_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        lead_genration_id:{
            type:Sequelize.INTEGER,
        },
        Accridation_log:{
            type:Sequelize.STRING,
        },
        br_number:{
            type:Sequelize.STRING,
        },
        new_location_id:{
            type:Sequelize.STRING,
        },
        request_audit_date:{
            type:Sequelize.STRING,
        },
        site: {
            type: Sequelize.STRING,
        },
        specific_auditor:{
            type:Sequelize.JSON,
        },
        client_name:{
            type:Sequelize.STRING,
        },
        Country:{
            type:Sequelize.STRING,
        },
        State:{
            type:Sequelize.STRING,
        },
        employee_id:{
            type:Sequelize.INTEGER,
        },

        City:{
            type:Sequelize.STRING,
        },

        service:{
            type:Sequelize.STRING,
        },
        program:{
            type:Sequelize.JSON,
        },
        man_days:{
            type:Sequelize.INTEGER,
        },
        eaCode:{
            type:Sequelize.JSON,
        },
        expected_date:{
            type:Sequelize.STRING,
        },
        remarksSale:{
            type:Sequelize.STRING,
        },
        status:{
            type:Sequelize.STRING,
        },
        sales_program:{
            type:Sequelize.JSON,
        },
        sales_EACode:{
            type:Sequelize.JSON,
        },
        stage_for_sales_request:{
            type:Sequelize.JSON,

        },
        expected_date_s2:{
            type:Sequelize.STRING,
        },
        
        man_days_S2:{
            type:Sequelize.STRING,
        },

        sales_request_state: {
            type: Sequelize.ENUM("parent", "child","both"),
            defaultValue: "parent",
        },
        saleRequest_stage: {
            type:Sequelize.STRING,
        },
        lead_data: {
            type:Sequelize.JSON,
        },
        saleRequest_data: {
            type:Sequelize.JSON,
        }
    },
    
    {
      freezeTableName: true,
    });
    return sales_request;
}