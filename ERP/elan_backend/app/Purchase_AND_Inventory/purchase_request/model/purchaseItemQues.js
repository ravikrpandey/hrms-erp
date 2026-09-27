module.exports = (sequelize, Sequelize) => {
    const purchase_item_ques = sequelize.define("PROCUREMENT_PURCHASE_REQUEST_ITEM_QUES", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
      
        question_type: {
            type: Sequelize.STRING
        },
      
        question: {
            type: Sequelize.STRING
        },
        answer: {
            type: Sequelize.STRING
        },
    },
        {
            freezeTableName: true,
        });
    return purchase_item_ques;
};
