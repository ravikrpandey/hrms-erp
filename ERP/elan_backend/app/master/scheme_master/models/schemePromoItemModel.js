module.exports = (sequelize,Sequelize) =>{
    const scheme_master_promo_item = sequelize.define("MASTER_SCHEME_PROMO_ITEM", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        promo_qty:{
            type: Sequelize.INTEGER
        },


        isDeleted:{
            type:Sequelize.BOOLEAN(true,false),
            defaultValue: false
        },
        price_amount_promo:{
            type:Sequelize.DECIMAL(50,2),
        }
    },                 
    {
        freezeTableName:true
    }
    )
    return scheme_master_promo_item;
}     