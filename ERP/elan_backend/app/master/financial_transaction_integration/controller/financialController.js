const db = require("../../../models/index");
const fiancial_transactions = db.fiancial_transactions;
const logger = require('../../../../logger/index');


exports.getSubModulesData = async (req, res) => { 
    try {
           const  {module_id} = req.query;
           let query;
           if(module_id == 5){
            [query] = await db.sequelize.query(`SELECT HR.*,HR.submenu_master_name AS menu_master_name FROM HRMS_RBAC_MENU_MASTER AS A 
INNER JOIN HRMS_RBAC_SUBMENU_MASTER AS HR ON HR.menu_master_id=A.menu_master_id
 WHERE A.role_module_master_id=${module_id}`);
           }else{
           [query] = await db.sequelize.query(`SELECT * FROM HRMS_RBAC_MENU_MASTER WHERE role_module_master_id =${module_id}`);
           }
          
    

    
           if (query.length > 0) {
              return res
                  .status(200)
                  .send({  
                      code: 200,
                      message: "Fetched Data Successfully !",
                      data: query,
                  });
          } else {
              return res
                  .status(400)
                  .send({ code: 404, message: "Record Not Found", data: query });
          }
      } catch (error) {
          return res.status(500).send({ code: 500, message: error.message });
      }
  };


module.exports.createFinacialTransactionIntegration = async (req, res) => {

  const transaction = await db.sequelize.transaction();

  try {

    const {
      menu_master_id,
      sub_module_id,
      Account_details,
      entity_id
    } = req.body;

 

    const existingData = await db.fiancialTransactionsIntegration.findOne({

      where: {
        role_module_master_id: menu_master_id,
        menu_master_id: sub_module_id,
        entity_id: entity_id
      },

      transaction

    });

 

    if (existingData) {
 
      await db.fiancialTransactionsIntegrationList.destroy({

        where: {
          transaction_integration_id: existingData.id
        },

        transaction

      });

 
      await db.fiancialTransactionsIntegration.destroy({

        where: {
          id: existingData.id
        },

        transaction

      });

    }

 

    const createData = await db.fiancialTransactionsIntegration.create({

      role_module_master_id: menu_master_id,

      menu_master_id: sub_module_id,

      entity_id

    }, { transaction });

 

    await Promise.all(

      Account_details.map(async (item) => {

        const {
          chart_account_id,
          mapping_account,
          debit_credit
        } = item;


        await db.fiancialTransactionsIntegrationList.create({

          mapping_component: mapping_account,

          chart_of_account_id: chart_account_id,

          debitCredit: debit_credit,

          transaction_integration_id: createData.id

        }, { transaction });

      })

    );

 

    await transaction.commit();

    return res.status(200).send({
      code: 201,
      message: 'Created Successfully'
    });


  } catch (error) {

    await transaction.rollback();

    return res.status(500).send({
      code: 500,
      message: error.message
    });

  }

};

  module.exports.getFinacialTransactionIntegrationList = async(req,res)=>{
    try {
        
        const [dataList] = await db.sequelize.query(
            `SELECT 
  FTI.*,
  F.*,
  MAX(HR.menu_master_name) AS menu_master_name
FROM FINANCIAL_TRANSACTION_INTEGRATION_LIST AS FTI
INNER JOIN FINANCIAL_TRANSACTION_INTEGRATION AS F
ON FTI.transaction_integration_id = F.id
INNER JOIN HRMS_RBAC_MENU_MASTER AS HR
ON F.role_module_master_id = HR.role_module_master_id
GROUP BY FTI.id`
        )
        if(dataList.length >0){
            return res.status(200).send({code:200,message:'success',data:dataList})
        }else{
            return res.status(200).send({code:404,message:'Data Not Found',data:dataList})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
  } 
  
  module.exports.getfinancialTransactionsById = async(req,res)=>{
    try {
        const {module_id,module_master_id} = req.query;
        const [dataList] = await db.sequelize.query(
            `SELECT 
  FTI.*,
  F.*,
  MAX(HR.menu_master_name) AS menu_master_name
FROM FINANCIAL_TRANSACTION_INTEGRATION_LIST AS FTI
INNER JOIN FINANCIAL_TRANSACTION_INTEGRATION AS F
ON FTI.transaction_integration_id = F.id
INNER JOIN HRMS_RBAC_MENU_MASTER AS HR
ON F.role_module_master_id = HR.role_module_master_id
WHERE 
    F.role_module_master_id = ${module_id}
    AND HR.menu_master_id = ${module_master_id}

GROUP BY FTI.id;`
        )
        if(dataList.length >0){
            return res.status(200).send({code:200,message:'success',data:dataList})
        }else{
            return res.status(200).send({code:404,message:'Data Not Found',data:dataList})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
  }