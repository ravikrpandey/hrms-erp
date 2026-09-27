module.exports = (sequelize, Sequelize) => {
    const stockTransferSerial = sequelize.define("STOCK_TRANSFER_SERIAL_NEW", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM('RESERVED', 'TRANSIT', 'RECEIVED', 'DAMAGED', 'RETURNED'),
            defaultValue: 'RESERVED'
        }
    }, {
        freezeTableName: true
    });
    return stockTransferSerial;
}
