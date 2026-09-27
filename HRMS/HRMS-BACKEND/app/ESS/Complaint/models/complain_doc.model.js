module.exports = (sequelize, Sequelize) => {
    const complaint_doc = sequelize.define("ESS_COMPLAINT_DOCUMENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        
        file_name: {
            type: Sequelize.STRING
        },
      
        status: {
            type: Sequelize.STRING,
            defaultValue: "ACTIVE"
        },
       
    },
    {
      freezeTableName: true,
    });
    return complaint_doc;
};