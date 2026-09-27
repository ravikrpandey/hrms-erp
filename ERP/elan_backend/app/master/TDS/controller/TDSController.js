
const { where } = require("sequelize");
const db = require("../../../models/index");


module.exports.createTDS = async (req, res) => {
    try {
        const {section,description,nature,tdsList,entity_id,maximum_amount} = req.body;
        const tdsExist = await db.tds.findOne({where:{entity_id},order:[['id','ASC']]});
       
        const createTDS = await db.tds.create({section,nature,description,tdsList,entity_id,maximum_amount,chart_account_id:tdsExist.chart_account_id})
        await Promise.all(tdsList.map(async(item)=>{
            const { nature_of_transaction,threshold_limit,maximum_amount, current_rate, new_rate, from_date} =item;
            await db.tdsList.create({nature_of_transaction,threshold_limit,rate:current_rate,tds_id:createTDS.id,maximum_amount, current_rate: current_rate || null, new_rate: new_rate || null, from_date})
        }))
        return res.status(200).send({code:200,message:'Created Successfully'})
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
};


module.exports.getAllTDS = async (req, res) => {
    try {
        const {entity_id} = req.query;
        
       const getAllList = await db.tds.findAll({where:{entity_id,isDeleted:false},order:[['id','DESC']]});
       if(getAllList){
        return res.status(200).send({code:200,message:'success',data:getAllList})
       }else{
        return res.status(200).send({code:404,message:'Data Not Found',data:getAllList})
       }
      
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
};

module.exports.getAllTDSById = async (req, res) => {
    try {
        const {id} = req.query;
        
        const dataList = await db.tds.findOne({where:{id}})

       const [getAllListById] = await db.sequelize.query(
        `SELECT TL.*
FROM SYS_TDS_MST AS T
INNER JOIN TDS_LIST_MST AS TL ON TL.tds_id=T.id
WHERE T.id= ${id}`
       )
       const Obj ={
        ...dataList.dataValues,
        tdsList:getAllListById
       }
       if(getAllListById){
        return res.status(200).send({code:200,message:'success',data:Obj})
       }else{
        return res.status(200).send({code:404,message:'Data Not Found',data:Obj})
       }
      
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
};

module.exports.updateTdsById = async (req, res) => {
    try {
        const {section,description,tdsList,id,maximum_amount,nature} = req.body;
        const TDSListData = await db.tdsList.findAll({where:{tds_id :id},atributes:['id']}) 
        const existingIds = tdsList.map(item => item.id);
        const valueId = TDSListData.filter(item => !existingIds.includes(item.dataValues.id));
        const idsToDelete = valueId.map(item => item.dataValues.id);
        const createTDS = await db.tds.update({section,description,tdsList,maximum_amount,nature},{where:{id}})

        if (tdsList) {
            await db.tdsList.destroy({
                where: {id: idsToDelete}});
            await Promise.all(
                tdsList.map(async (item) => {
                    const { id: itemId, nature_of_transaction, threshold_limit, maximum_amount, current_rate, new_rate, from_date, deleted_flag } = item;  
         
                        if (itemId) {
                            const existingItem = await db.tdsList.findOne({ where: { id: itemId } });
        
                            if (existingItem) {
                                await db.tdsList.update(
                                    {
                                        nature_of_transaction,
                                        threshold_limit,
                                        maximum_amount: maximum_amount || null,
                                        current_rate: current_rate || null,
                                        new_rate: new_rate || null,
                                        from_date,
                                        rate: current_rate || null,
                                    },
                                    { where: { id: itemId } }
                                );
                               
                                
                            } else {
                                
                                await db.tdsList.create({
                                    tds_id: id,  
                                    nature_of_transaction,
                                    threshold_limit,
                                    maximum_amount: maximum_amount || null,
                                    current_rate: current_rate || null,
                                    new_rate: new_rate || null,
                                    from_date,
                                    rate: current_rate || null,
                                });
                            }
                        } else {
                            await db.tdsList.create({
                                tds_id: id,  
                                nature_of_transaction,
                                threshold_limit,
                                rate: current_rate || null,
                                maximum_amount: maximum_amount || null,
                                current_rate: current_rate || null,
                                new_rate: new_rate || null,
                                from_date
                            });
                        }
                    
                })
            );
        }
        
       
       if(createTDS){
        return res.status(200).send({code:200,message:'Updated Suceesfully'})
       }else{
        return res.status(200).send({code:404,message:'Data Not Found'})
       }
      
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
};

module.exports.getTDSById = async (req, res) => {
    try {
        const {id,} = req.query;
        const [getAllListById] = await db.sequelize.query(
            `SELECT TL.*,T.nature
    FROM SYS_TDS_MST AS T
    INNER JOIN TDS_LIST_MST AS TL ON TL.tds_id=T.id
    WHERE T.id= ${id}`
           )
       if(getAllListById){
        return res.status(200).send({code:200,message:' Suceesfully',data:getAllListById})
       }else{
        return res.status(200).send({code:404,message:'Data Not Found',data:getAllListById})
       }
      
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
};


module.exports.deleteTDSById = async (req, res) => {
    try {
        const {id,} = req.query;
        const dataList = await db.tds.update({isDeleted:true},{where:{id}})
       if(dataList){
        return res.status(200).send({code:200,message:' Deleted Suceesfully'})
       }else{
        return res.status(200).send({code:404,message:'Not Deleted'})
       }
      
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
};

module.exports.createGlobalTdsMapCA = async(req,res)=>{
    try {
        const {entity_id,chart_account_id} = req.body;

        const dataList = await db.tds.findAll({where:{entity_id}})
        await Promise.all(dataList.map(async (i)=>{
            await db.tds.update({chart_account_id},{where:{entity_id}})
        }))
        return res.status(200).send({code:200,message:'Successfully updated'})
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.createGlMappingTransactions = async(req,res)=>{
    try {
        const { roleFiled } = req.body;
        await Promise.all(roleFiled.map(async (i)=>{
           const {entity_id,transaction_type} = i

           let checkIfExist = await db.glMappingTransactions.findAll({where:{entity_id:entity_id}})
           console.log(checkIfExist,'checkIfExist')
           const exists = checkIfExist.some(res => res.transaction_type === transaction_type);
           if(exists){
           return res.status(500).send({ code: 500, message:'GL Already Mapped' });
   
           }
        }))
        await Promise.all(roleFiled.map(async (i) => {
            const { transaction_type, credit_account_id, debit_account_id, entity_id} = i;
            await db.glMappingTransactions.create({
                transaction_type,
                credit_account_id,
                debit_account_id,
                entity_id
            });
        }));
    
        return res.status(200).send({ code: 200, message: 'Successfully Added' });
    
    } catch (error) { 
        return res.status(500).send({ code: 500, message: error.message });
    }
    
}

module.exports.getAllGlAccountMapped = async(req,res)=>{
   let {entity_id}  = req.query; 
try {
    
let [getAllData] = await db.sequelize.query(`
    SELECT GMT.*,CA.account_name AS credit_account,COA.account_name AS debit_account from GL_MAPPING_TRANSACTIONS AS GMT
INNER JOIN CHART_OF_ACCOUNTS AS CA ON GMT.credit_account_id = CA.id
INNER JOIN CHART_OF_ACCOUNTS AS COA ON GMT.debit_account_id = COA.id
WHERE GMT.entity_id = ${entity_id}
    `)
if(getAllData){
    return res.status(200).send({code:200,message:'Records',data:getAllData})
}


} catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
    

}



}