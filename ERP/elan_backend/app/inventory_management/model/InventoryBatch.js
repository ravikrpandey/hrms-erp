// module.exports = (sequelize, Sequelize) => {
//     const inventoryBatchDetails = sequelize.define("Inventory_batch", {
//         id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         allocated_inventory: {
//             type: Sequelize.INTEGER
//         },
//         selection_id: {
//             type: Sequelize.INTEGER
//         },
//         allocated_status:{
//             type: Sequelize.STRING
//         },
//         status: {
//             type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
//             defaultValue: "ACTIVE"
//         },
//         isDeleted: {
//             type: Sequelize.BOOLEAN,
//             defaultValue: false
//         },
//     }, {
//         freezeTableName: true
//     });
//     return inventoryBatchDetails
// }