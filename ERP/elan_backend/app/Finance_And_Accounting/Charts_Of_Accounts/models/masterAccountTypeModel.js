// module.exports = (sequelize, Sequelize) => {
// const masterAccountType = sequelize.define('MASTER_ACCOUNT_TYPE', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   account_type_name: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   // account_type_id: {
//   //   type: Sequelize.INTEGER,
//   //   allowNull: false
//   // },
//   // currency: {
//   //   type: Sequelize.INTEGER,
//   //   allowNull: false
//   // },
//   status: {
//     type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
//     allowNull: false,
//     defaultValue: 'ACTIVE'
//   },
//   isDeleted: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     defaultValue: '0'
//   }

// },
//         {
//             freezeTableName: true
//         });
//     return masterAccountType
// }
