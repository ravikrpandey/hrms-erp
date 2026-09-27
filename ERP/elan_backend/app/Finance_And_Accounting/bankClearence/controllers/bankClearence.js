const { response } = require("express");
const Sequelize = require("sequelize");
const db = require("../../../models/index");
const XLSX = require('xlsx');
const moment = require('moment');


module.exports.getBankList = async (req, res) => {
  try {

      const [query] = await db.sequelize.query(`SELECT MB.*, CS.countryss_name AS country_name FROM MASTER_BANK AS MB

LEFT JOIN MASTER_COUNTRY AS CS ON CS.countryss_id = MB.country_id
WHERE MB.isDeleted = '0'`);


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
              .status(404)
              .send({ code: 404, message: "Record Not Found", data: query });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
  }
};


module.exports.getCountryList = async (req, res) => {
  try {

      const [query] = await db.sequelize.query(`SELECT * FROM MASTER_COUNTRY WHERE status = 'ACTIVE'`);


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
              .status(404)
              .send({ code: 404, message: "Record Not Found", data: query });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
  }
};


module.exports.getBankDetailsById = async (req, res) => {
  try {


    let id = req.params?.id;
    
      const [query] = await db.sequelize.query(`SELECT MB.*, CS.countryss_name AS country_name FROM MASTER_BANK AS MB
INNER JOIN MASTER_COUNTRY AS CS ON CS.countryss_id = MB.country_id
WHERE MB.isDeleted = '0' AND MB.id = ${id}`);


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
              .status(404)
              .send({ code: 404, message: "Record Not Found", data: query });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
  }
};


module.exports.getBankById = async (req, res) => {
  try {

    let id = req.params?.id;
      const [query] = await db.sequelize.query(`SELECT * FROM MASTER_BANK WHERE id = ${id}`);


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
              .status(404)
              .send({ code: 404, message: "Record Not Found", data: query });
      }
  } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
  }
};


module.exports.addBank = async (req, res) => { 
   
  try {
    const {
      bank_name,
      swift_number,
      branch,
      state,
      country_id,
      status
    } = req.body;

    const payload = {
      bank_name,
      swift_number,
      branch,
      state,
      country_id,
      status
    };
    // if (!organization_id == '') {
    //   payload.organization_id = organization_id;
    // }

    let id = req.params?.id;
   

    if (id != 'null' && id != '' && id != 'undefined' && id != null && id != undefined) {
    
         await db.createBank.update(
           payload,{where:{id}}
         )

        return res.status(200).send({ code: 200, message: "Updated Successfully" });
    } else {

    const createData = await db.createBank.create(payload);
    if (createData) {
      return res
        .status(201)
        .send({ code: 201, message: "Bank Added Successfully" });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "Bank not added" });
    }

    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};




module.exports.deleteBank = async (req, res) => {
  try {
    const {id} =req.params;
   
    await db.createBank.update({isDeleted:'1'},{where:{id}})

    return res
      .status(200)
      .send({ code: 200, message: "Deleted Successfully!" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.uploadBankStatement = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send({
        code: 400,
        message: 'File is required'
      });
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const excelData = XLSX.utils.sheet_to_json(worksheet);

    if (!excelData.length) {
      return res.status(400).send({
        code: 400,
        message: 'Excel is empty'
      });
    }
    function excelDateToJSDate(serial) {
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400;
      return new Date(utc_value * 1000);
    }
    await db.bankClearence.update({updated_value:true},{where:{entity_id:req.user.primary_entity_id,updated_value:false}})
    await Promise.all(excelData.map(async(i)=>{
      let {refrence_no,clearence_date,amount} =i;
     
      if (typeof clearence_date === 'number') {
        const dateObj = excelDateToJSDate(clearence_date);
        clearence_date = moment(dateObj).format('YYYY-MM-DD');
      } 
      else {
        clearence_date = moment(clearence_date, [
          'DD-MM-YYYY',
          'MM-DD-YYYY',
          'YYYY-MM-DD'
        ]).format('YYYY-MM-DD');
      }
   
      await db.bankClearence.create({
        refrence_no,clearence_date,amount,entity_id:req.user.primary_entity_id,chart_account_id:req.body.chart_account_id
      })
    }))
 
  
    return res.status(200).send({
      code: 200,
      message: 'File processed successfully',
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};


module.exports.getBankClearenceList=async(req,res)=>{
  try {
    const {entity_id} = req.query;
    const dataList = await db.bankClearence.findAll({where:{entity_id,updated_value:false}})
    if(dataList){
      return res.status(200).send({code:200,message:'Success',data:dataList})
    }else{
      return res.status(404).send({code:404,message:'Data Not Found',data:dataList})
    }
  } catch (error) {
    return res.status(500).send({code:500,message:error.message})
  }
}


module.exports.reconcileBankStatement=async(req,res)=>{
  try {
    const {entity_id,chart_of_account_id} = req.body;
    const [existingRecords] = await db.sequelize.query(`
       SELECT F.*,FL.chart_account_id
  FROM FINANCIAL_AND_ACCOUNT_JOURNAL AS F
  INNER JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FL ON FL.journal_id=F.id
  WHERE F.bank_clearance_date IS NULL AND F.entity_id=${entity_id} AND FL.chart_account_id=${chart_of_account_id}
    GROUP BY F.id` )
     
   
    const dataExist = await db.bankClearence.findAll({where:{entity_id,reference_status:'UnReconcile',chart_account_id:chart_of_account_id}})


    const dataExistValue =  await Promise.all(existingRecords.map(async(md)=>{
        const matchingRecord = dataExist.find((ud)=> md.reference==ud.refrence_no)

        if(matchingRecord){
          await db.bankClearence.update({reference_status:'Reconcile'},{where:{refrence_no:matchingRecord.refrence_no,entity_id}})
          await db.financial_And_Account_Journal.update({bank_clearance_date:matchingRecord.clearence_date},{where:{reference:matchingRecord.refrence_no,entity_id}})
        }
    }))
   if(dataExistValue){
    return res.status(200).send({code:200,message:'Clearence Updated Succesfully'})
   }else{
    return res.status(404).send({code:404,message:'Not Updated'})
   }

    
   
  } catch (error) {
    return res.status(500).send({code:500,message:error.message})
  }
}

module.exports.getUnReconciledBankEntries= async(req,res)=>{
  try {
    const {entity_id,account_id,from_date,to_date}=req.body;
    const fromDate = new Date(from_date);
    fromDate.setHours(0, 0, 0, 0);
    const formattedFromDate = fromDate.toISOString().slice(0, 19).replace('T', ' ');


    const toDate = new Date(to_date);
    toDate.setHours(23, 59, 59, 999);
    const formattedToDate = toDate.toISOString().slice(0, 19).replace('T', ' ');
    
      const [BankDataList]= await db.sequelize.query(
        `SELECT B.* ,C.account_name
  FROM BANK_CLEARENCE AS B
  INNER JOIN CHART_OF_ACCOUNTS AS C ON C.id= B.chart_account_id
  WHERE B.entity_id =${entity_id} AND B.reference_status ='UnReconcile' AND B.chart_account_id=${account_id}
  AND B.createdAt BETWEEN '${formattedFromDate}' AND '${formattedToDate}'
        `
      )
      return res.status(200).send({code:200,message:'Success',data:BankDataList})
    
   
    
  } catch (error) {
    return res.status(500).send({code:500,message:error.message})
  }
}

module.exports.getBankEntriesForBankReconciliationStatm= async(req,res)=>{
  try {
    const {entity_id,account_id,from_date,to_date}=req.body;
    const fromDate = new Date(from_date);
    fromDate.setHours(0, 0, 0, 0);
    const formattedFromDate = fromDate.toISOString().slice(0, 19).replace('T', ' ');


    const toDate = new Date(to_date);
    toDate.setHours(23, 59, 59, 999);
    const formattedToDate = toDate.toISOString().slice(0, 19).replace('T', ' ');

      const [dataList]= await db.sequelize.query(
        `SELECT F.*,FL.chart_account_id,C2.account_name
  FROM FINANCIAL_AND_ACCOUNT_JOURNAL AS F
  INNER JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FL ON FL.journal_id=F.id
  INNER JOIN CHART_OF_ACCOUNTS AS C ON C.id= FL.chart_account_id
  INNER JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS FAJL2 ON FL.journal_id = FAJL2.journal_id
      AND FAJL2.chart_account_id != ${account_id}
  INNER JOIN CHART_OF_ACCOUNTS AS C2 ON C2.id = FAJL2.chart_account_id
  WHERE  F.bank_clearance_date IS NULL AND F.entity_id=${entity_id} AND C.id=${account_id}
  AND C.marks_cash_account ='Bank' 
  AND F.createdAt BETWEEN '${formattedFromDate}' AND '${formattedToDate}'
GROUP BY F.id
        `
      )
   
      return res.status(200).send({code:200,message:'Success',data:dataList})
    
      
    
  } catch (error) {
    return res.status(500).send({code:500,message:error.message})
  }
}