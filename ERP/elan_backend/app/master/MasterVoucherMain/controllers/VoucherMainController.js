const { where } = require('sequelize')
const db = require('../../../models/index')

module.exports.getAllVoucherMainData = async (req, res) => {
try {
const getAllVoucher = await db.voucherMain.findAll({where:{isDeleted:false},order:[['id','DESC']]})
if(getAllVoucher){
    return res.status(200).send({code:200,data:getAllVoucher})
}else{
    return res.status(200).send({code:404,message:'No Record Found',data:getAllVoucher})
}

} catch (error) {
     return res.status(500).send({code:500,message:error.message})
}
}


module.exports.createVoucherMainList = async (req, res) => {
    try {
        const { voucherList,voucher_id ,entity_id} = req.body;
        Promise.all(voucherList.map(async(item)=>{
            const {voucher_name, series} = item;
            await db.voucherMainList.create({series, voucher_name,  entity_id:entity_id,voucher_main_id:voucher_id})
        }))
    
        return res.status(200).send({code:200,message:'SuccessFully Created'})
  
    
    } catch (error) {
         return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.voucherMainListById = async (req, res) => {
    try {
        const { id } = req.query;
        const valueData = await db.voucherMain.findOne({where:{id}})
        const [dataList] = await db.sequelize.query(
            `SELECT VM.*
FROM SYS_VOUCHER_MAIN_MST AS S
INNER JOIN VOUCHER_MAIN_LIST_MST AS VM ON VM.voucher_main_id = S.id
WHERE S.id=${id}`
        )
        const Obj = {
            ...valueData.dataValues,
            voucherList:dataList
        }
        if(Obj){
            return res.status(200).send({code:200,data:Obj})
        }else{
            return res.status(200).send({code:404,message:'No Record Found',data:Obj})
        }
  
    
    } catch (error) {
         return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.voucherMainList = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const [dataList] = await db.sequelize.query(
            `SELECT S.name,S.id,VM.entity_id,VM.voucher_name,VM.series
FROM SYS_VOUCHER_MAIN_MST AS S
INNER JOIN VOUCHER_MAIN_LIST_MST AS VM ON VM.voucher_main_id = S.id
WHERE VM.entity_id=${entity_id} AND S.isDeleted = 0`
        )

        if(dataList){
            return res.status(200).send({code:200,data:dataList})
        }else{
            return res.status(200).send({code:404,message:'No Record Found',data:dataList})
        }
    
    } catch (error) {
         return res.status(500).send({code:500,message:error.message})
    }
}


module.exports.updateVoucherMainById = async (req, res) => {
    try {
        const { voucherList,id ,entity_id} = req.body;
        await db.voucherMainList.destroy({where:{voucher_main_id:id}})
        Promise.all(voucherList.map(async(item)=>{
            const {voucher_name, series} = item;
            await db.voucherMainList.create({series, voucher_name,entity_id:entity_id,  voucher_main_id:id})
        }))
    
        return res.status(200).send({code:200,message:'SuccessFully Updated'})
  
    
    } catch (error) {
         return res.status(500).send({code:500,message:error.message})
    }
}


module.exports.getBankVoucherById = async(req,res) =>{
    try {
        const {id,entity_id} = req.query;
        const dataList = await db.voucherMainList.findAll({where:{voucher_main_id:id,entity_id,isDeleted:0}});
        if(dataList){
            return res.status(200).send({code:200,data:dataList})
        }else{
            return res.status(200).send({code:404,message:'No Record Found',data:[]})
        }

    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}


module.exports.getVoucherMainSeries = async(req,res)=>{
    try {
        const {entity_id,employee_id,id} = req.body
        const employeeExist = await db.user.findOne({where:{employee_id,primary_entity_id:entity_id},attribute:['id','branch_id']});
        const branchExist = await db.tbl_branch.findOne({where:{id:employeeExist.branch_id},attributes:['id','branch_name']})
        const branchPrefix = branchExist.branch_name.slice(0, 3).toUpperCase();
        const voucherMainExist = await db.voucherMain.findOne({where:{id},attributes:['id','name']})
        const voucherPrefixed = voucherMainExist.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
        const lastEntry = await db.voucherMainList.findOne({
            order: [["createdAt", "DESC"]],
            attributes: ["id","series"],
          });
      
          let number;
          const currentYear = new Date().getFullYear();
          if (lastEntry) {
            const lastCode = lastEntry.series;
            const parts = lastCode.split('-');
            parts[parts.length - 2] = currentYear;
            let numberPart = parseInt(parts[3], 10);
            numberPart++;
            const newNumberPart = String(numberPart).padStart(5, '0');
          
            const newCode = `${branchPrefix}-${voucherPrefixed}-${lastEntry}-${currentYear}-${newNumberPart}`;
            number = newCode;
           
          } else {
            number = `${branchPrefix}-${voucherPrefixed}-${lastEntry}-${currentYear}-00001`;
           
          }
          return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: number });
    } catch (error) {
       return res.status(500).send({code:500,message:error.message}) 
    }
}