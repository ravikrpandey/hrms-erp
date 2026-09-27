module.exports = (sequelize,Sequelize) =>{
    const scheme_master_selected_item = sequelize.define("MASTER_SCHEME_SELECTED_ITEM", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        selected_qty:{
            type: Sequelize.INTEGER
        },

        number_of_qty :{
            type: Sequelize.INTEGER,
        },
        price_scheme :{
             type:Sequelize.DECIMAL(50,2),
        },

        isDeleted:{
            type:Sequelize.BOOLEAN(true,false),
            defaultValue: false
        }
    },
    {
        freezeTableName:true
    }
    )
    return scheme_master_selected_item;
}