module.exports = (sequelize, Sequelize) => {
    const pochargesDetailsList = sequelize.define("PO_CHARGES_DETAILS_LIST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        po_id:{
            type: Sequelize.INTEGER,
        }
       
    }, {
        freezeTableName: true
    });
    return pochargesDetailsList
}