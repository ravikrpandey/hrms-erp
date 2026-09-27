const db = require("../../../models/index");
const logger = require('../../../../logger/index');
const chartOfAccountsModel = require("../../Charts_Of_Accounts/models/chartOfAccountsModel");


exports.getDashBoardFinanceData = async (req, res) => {
    try {
        const {entity_id,financial_id} = req.params;
        
        const [dataList] = await db.sequelize.query(`
            
                        SELECT MPPM.month FROM MASTER_POSTING_PERIOD AS MPP
                        LEFT JOIN MASTER_POSTING_PERIOD_MONTH_LIST AS MPPM ON MPPM.posting_period_id = MPP.id
                        WHERE MPP.status = 'ACTIVE' AND MPP.isDeleted = 0
                         AND MPP.financial_year_id = ${financial_id} AND MPPM.status = 'ACTIVE'  AND MPP.entity_id =${entity_id}
`);

            const [dataList2] = await db.sequelize.query(`
                SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit 
                 FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST 
                 WHERE chart_account_id=4 AND entity_id=${entity_id}
                 GROUP BY chart_account_id`);

                 let chartAccount = await db.createChartOfAccounts.findAll({where:{parent_account :5,status:'ACTIVE',isDeleted:0},
                    attributes:['id','account_name']});
               let chartOfAccountList=[];
               for(let item of chartAccount){
       
                   let data = await db.financial_And_Account_Journal_List.findAll({where:{chart_account_id:item.id,status:'ACTIVE',isDeleted:0},
                     attributes:[
                        'chart_account_id',
                         [db.sequelize.fn('SUM', db.sequelize.col('credit_amount')), 'total_credit_amount'],
                         [db.sequelize.fn('SUM', db.sequelize.col('debit_amount')), 'total_debit_amount']
                     ],
                    
                     group:['chart_account_id']
                     })
                   
                     if(data.length>0 ){
                       chartOfAccountList.push({
                           ...item?.dataValues, 
                           total_amount:data[0]?.dataValues?.total_debit_amount-data[0]?.dataValues?.total_credit_amount,
                           
                       });
                     }
               }



               let activeJournalData = await db.financial_And_Account_Journal.findAll({where: {status: 'ACTIVE',isDeleted: 0,entity_id: entity_id},
                attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalActiveJournal'] ]
            });
            let journalData = await db.financial_And_Account_Journal.findAll({
                attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalJournal'] ]
    
            });
            
            let mergeData;
            if(journalData){
                 mergeData =[...activeJournalData, ...journalData]
            }


            ////////////////////////////
            let chartOfAccount = await db.createChartOfAccounts.findAll({
                attributes:[[db.sequelize.fn('COUNT',db.sequelize.col('id')),'totalChartOfAccounts']]
            })
            let bankList = await db.createBank.findAll({
                attributes:[[db.sequelize.fn('COUNT',db.sequelize.col('id')),'totalBank']]
            })


            let response ={
                bankList:bankList[0],
                totalChartOfAccount:chartOfAccount[0],
                cashOnHand:dataList2,
                journalData:mergeData,
                chartOfAccount:chartOfAccountList,
                postingPeriod:dataList
            }

        return res.status(200).send({code :200,message:'success', data: response});
        
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};




