const db = require("../../../models/index");
 

 
exports.createItemcostCategory = async (req, res) => {
    const { itemCostForm } = req.body;
   
    const records = (itemCostForm || []).map(i => ({
      cost_type: i.cost_type,
      chart_account_id: i.chart_of_account_id,
      entity_id: i.entity_id
    }));
  
    const t = await db.sequelize.transaction();
    try {
      
      await db.item_cost_category.destroy({ where: {}, transaction: t });
   
      if (records.length) {
        await db.item_cost_category.bulkCreate(records, { transaction: t });
      }
   
      await t.commit();
      return res.status(200).send({ code: 200, message: 'Successfully replaced item_cost_category' });
  
    } catch (error) {
          
      await t.rollback();
      return res.status(500).send({ code: 500, message: error.message });
    }
  };
  
  

  exports.getAllItemcostCategory= async(req,res)=>{
   try {
        let data = await db.item_cost_category.findAll()

         if(data){
            return res.status(200).send({code:200,data:data,message:'success'})
         }
   } catch (error) {
    return res.status(500).send({code:500,message:'Internal Server Error'})
    
   }

  }

