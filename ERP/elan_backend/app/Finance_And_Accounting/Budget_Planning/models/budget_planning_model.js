module.exports = (sequelize,Sequelize) =>{
    const budgetPlanning = sequelize.define("FINANCE_BUDGET_PLANNING", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
       
        nature_need:{
            type: Sequelize.TEXT,
        },
        price_without_vat:{
            type: Sequelize.DECIMAL(10,2),
        },
        quantity:{
            type: Sequelize.INTEGER,
        },
        vat:{
            type: Sequelize.DECIMAL(10,2),
        },
        budget_planning_type:{
            type:Sequelize.ENUM("Capex","Opex"),
            
        },
        estimated_unit_price_with_vat:{
            type: Sequelize.DECIMAL(10,2),
        },
        source_of_price:{
            type: Sequelize.STRING,
        },
        flight_insurance_transport:{
            type: Sequelize.DECIMAL(10,2),
        },
        custom_duties:{
            type: Sequelize.STRING,
        },
        total_Value:{
            type: Sequelize.DECIMAL(10,2),
        },
        justification_need:{
            type: Sequelize.TEXT,
        },
        vat_classification:{
            type: Sequelize.STRING,
        },
        month:{
            type: Sequelize.JSON,
        },
        
        status:{
            type:Sequelize.ENUM("ACTIVE","INACTIVE"),
            defaultValue:"ACTIVE"
        },
        isDeleted:{
            type:Sequelize.BOOLEAN(true,false),
            defaultValue: false
        }
    },
    {
        freezeTableName:true
    }
    )
    return budgetPlanning;
} 