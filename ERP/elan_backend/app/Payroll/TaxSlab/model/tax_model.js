module.exports = (sequelize, Sequelize) => {
    const complaintDetail = sequelize.define("PAYROLL_TAX_SLAB", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tax_slab_name:{
            type: Sequelize.STRING
        },
        standard_deduction:{
            type: Sequelize.INTEGER
        },
        tax_slab_row:{
            type: Sequelize.JSON
        },      
        start_date: {
            type: Sequelize.STRING,
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
    return complaintDetail;
};