// module.exports = (sequelize, Sequelize) => {
//     const goodsInventory = sequelize.define("GOODS_INVENTORY", {
//         id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         batch_number: {
//             type: Sequelize.STRING
//         },
//         inward_date: {
//             type: Sequelize.DATEONLY, 
//             allowNull: true
//         },
//         batch_expiry_date: {
//             type: Sequelize.DATEONLY, 
//             allowNull: true
//         },
//         quantity: {
//             type: Sequelize.STRING
//         },
//         basic_rate: {
//             type: Sequelize.STRING
//         },
//         total_value: {
//             type: Sequelize.STRING
//         },
//         upload_document: {
//             type: Sequelize.STRING
//         },
//         remarks: {
//             type: Sequelize.STRING
//         },
//         status: {
//             type: Sequelize.ENUM("ACTIVE", "INACTIVE","ALLOCATED"),
//             defaultValue: "ACTIVE"
//         },
//         isDeleted: {
//             type: Sequelize.BOOLEAN,
//             defaultValue: false
//         },
//     }, {
//         freezeTableName: true
//     });
//     return goodsInventory
// }