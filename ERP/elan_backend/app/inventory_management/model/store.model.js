// module.exports = (sequelize, Sequelize) => {
//     const inventoryStores = sequelize.define("INV_STORE_LIST", {
//         id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         store_name: {
//             type: Sequelize.STRING,
//         },
//         branch_id: {
//             type: Sequelize.INTEGER,
//         },
//         isDeleted: {
//             type: Sequelize.BOOLEAN(true, false),
//             defaultValue: false,
//         },
//         status: {
//             type: Sequelize.ENUM("ACTIVE", "INACTIVE",),
//             defaultValue: "ACTIVE"
//         }
//     })
//     return inventoryStores;
// }