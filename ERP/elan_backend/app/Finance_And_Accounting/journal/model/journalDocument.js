module.exports = (sequelize, Sequelize) => {
    const journalDocument = sequelize.define('FINANCIAL_AND_ACCOUNT_JOURNAL_DOCUMENT', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true
        },
        
    },{
        freezeTableName : true
    })
    return journalDocument;
};
