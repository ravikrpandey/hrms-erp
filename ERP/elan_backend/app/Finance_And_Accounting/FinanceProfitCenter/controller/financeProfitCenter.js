const db = require('../../../models/index')

module.exports.createProfitCenter = async(req,res)=>{
    try {
        let { profit_center_id,parent_profit_center_id,cost_profit_center_name, profit_center_name,manager_id, department_id,created_on,entity_id, type, from_date, to_date, is_group, remark, need_type_id, employee_id, currency_id} = req.body;
        let cost_profit_center_id;

        if(typeof type === "number"){
            cost_profit_center_id=type;
            type =null;
        }
  
        await db.financeProfitCenter.create({profit_center_id,cost_profit_center_name, cost_profit_center_id,profit_center_name,manager_id,parent_profit_center_id,department_id,entity_id, created_on, type, from_date, to_date, is_group, remark, need_type_id, employee_id, currency_id})
        return res.status(201).send({code:201,messege:'Created SuccefFully'})
    } catch (error) {
        return res.status(500).send({code:500,messege:error.messege})
    }
}


module.exports.getAllProfitCenter = async(req,res)=>{
    try {
        const {entity_id}= req.query;
        const [dataList] = await db.sequelize.query(
            `SELECT F.*,M.need_type,CONCAT(HR.first_name,' ',HR.last_name) AS employee_name,MC.Currency_Type
FROM FINANCE_PROFIT_CENTER AS F
LEFT JOIN MASTER_NEED AS M ON M.id = F.need_type_id
LEFT JOIN  HRMS_REGISTERED_USER AS HR ON HR.employee_id = F.manager_id
LEFT JOIN MASTER_CURRENCY_CONVERT AS MC ON MC.Currency_Convert_id = F.currency_id
WHERE F.entity_id =${entity_id} AND F.isDeleted = false ORDER BY F.id DESC`
        )
        if(dataList){
            return res.status(200).send({code:200,messege:'sucess',data:dataList})
        }else{
            return res.status(200).send({code:404,messege:'Data Not Found'})
        }
    } catch (error) {
        return res.status(500).send({code:500,messege:error.messege})
    }
}


module.exports.getAllProfitCenterIsGroup = async(req,res)=>{
    try {
        const {entity_id}= req.query;
        const dataList = await db.financeProfitCenter.findAll({where:{is_group:'YES',entity_id},attributes:['id','profit_center_id','profit_center_name']})
        if(dataList){
            return res.status(200).send({code:200,messege:'sucess',data:dataList})
        }else{
            return res.status(200).send({code:404,messege:'Data Not Found'})
        }
    } catch (error) {
        return res.status(500).send({code:500,messege:error.messege})
    }
}

module.exports.getProfitCenterHierarchyViewData = async (req, res) => {
    try {
        const { entity_id } = req.query;
    
        const [costCenterHierarchyView] = await db.sequelize.query(`
            SELECT id,profit_center_name AS name, type,parent_profit_center_id,profit_center_id
            FROM FINANCE_PROFIT_CENTER
            WHERE  isDeleted = '0' AND status = 'ACTIVE' AND entity_id = ${entity_id}`)
    
       
        const accountMap = {};
        costCenterHierarchyView.forEach(account => {
            account.children = []; 
            accountMap[account.id] = account; 
        });
    
      
        const rootAccounts = [];
        costCenterHierarchyView.forEach(account => {
            if (account.parent_profit_center_id === null || account.parent_profit_center_id === '') {
                rootAccounts.push(account); 
            } else {
                const parent = accountMap[account.parent_profit_center_id];
                if (parent) {
                    parent.children.push(account); 
                }
            }
        });
    
        
        const response = {
            costCenterHierarchyView: rootAccounts,
        };
    
       
        res.json(response);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
    
    
    
  };


module.exports.getProfitCenterById = async (req, res) => {
  try {
    const { id } = req.query;

    const data = await db.financeProfitCenter.findOne({
      where: { id: id }
    });

    if (!data) {
      return res.status(404).send({
        code: 404,
        message: "Profit Center not found"
      });
    }

    return res.status(200).send({
      code: 200,
      data: data,
      message: "Fetched Data"
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};

module.exports.updateProfitCenter = async (req, res) => {
    try {
        const { id } = req.params;
        let { profit_center_id, parent_profit_center_id, cost_profit_center_name, profit_center_name, manager_id, department_id, created_on, entity_id, type, from_date, to_date, is_group, remark, need_type_id, employee_id, currency_id, status } = req.body;

        const existingProfitCenter = await db.financeProfitCenter.findOne({
            where: { id: id, isDeleted: false }
        });

        if (!existingProfitCenter) {
            return res.status(404).send({ code: 404, message: "Profit Center not found" });
        }

        let cost_profit_center_id;
        if (typeof type === "number") {
            cost_profit_center_id = type;
            type = null;
        }

        const updateData = {
            profit_center_id,
            parent_profit_center_id,
            cost_profit_center_name,
            profit_center_name,
            manager_id,
            department_id,
            created_on,
            entity_id,
            type,
            from_date,
            to_date,
            is_group,
            remark,
            need_type_id,
            employee_id,
            currency_id,
            status,
            cost_profit_center_id
        };

        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        await db.financeProfitCenter.update(updateData, {
            where: { id: id }
        });

        const updatedProfitCenter = await db.financeProfitCenter.findOne({
            where: { id: id, isDeleted: false }
        });

        return res.status(200).send({
            code: 200,
            message: "Profit Center Updated Successfully",
            data: updatedProfitCenter
        });

    } catch (error) {
        console.error('Error in updateProfitCenter:', error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.deleteProfitCenter = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProfitCenter = await db.financeProfitCenter.findOne({
            where: { id: id, isDeleted: false }
        });

        if (!existingProfitCenter) {
            return res.status(404).send({ code: 404, message: "Profit Center not found" });
        }

        await db.financeProfitCenter.update(
            { isDeleted: true },
            { where: { id: id } }
        );

        return res.status(200).send({
            code: 200,
            message: "Profit Center Deleted Successfully"
        });

    } catch (error) {
        console.error('Error in deleteProfitCenter:', error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};