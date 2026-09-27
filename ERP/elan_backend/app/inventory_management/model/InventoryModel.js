// module.exports = (sequelize, Sequelize) => {
//     const inventoryDetails = sequelize.define("SYS_INVENTORY_MASTER", {
//         id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         type: {
//             type: Sequelize.ENUM("employee", "location"),
//         },
//         in_type: {
//             type: Sequelize.ENUM("Last_IN", "First_IN"),
//         },
//         allocate_inventory: {
//             type: Sequelize.INTEGER
//         },
//         remark: {
//             type: Sequelize.STRING
//         },
//         inventory_type: {
//             type: Sequelize.ENUM("Inventory", "Production"),
//         },
//         manage_by: {
//             type: Sequelize.STRING
//         },
//         Total_inventory: {
//             type: Sequelize.INTEGER
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
//     return inventoryDetails
// }