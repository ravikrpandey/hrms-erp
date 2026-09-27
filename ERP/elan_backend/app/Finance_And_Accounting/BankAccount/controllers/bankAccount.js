const { response } = require("express");
const Sequelize = require("sequelize");
const db = require("../../../models/index");




exports.getBankAccountList = async (req, res) => {
  try {

      const [query] = await db.sequelize.query(`SELECT MBA.*, MB.bank_name FROM MASTER_BANK_ACCOUNT AS MBA
LEFT JOIN MASTER_BANK AS MB ON MB.id = MBA.bank_id
WHERE MBA.isDeleted = '0' ORDER BY MBA.id DESC`);


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

exports.getBankList = async (req, res) => {
  try {
      const {entity_id} = req.query;
      const [query] = await db.sequelize.query(`SELECT * FROM MASTER_BANK WHERE isDeleted = '0' AND status = 'ACTIVE' entity_id=${entity_id}`);


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



exports.getAccountListForBank = async (req, res) => {
  try {

      const [query] = await db.sequelize.query(`SELECT * FROM CHART_OF_ACCOUNTS WHERE isDeleted = '0' AND status = 'ACTIVE' AND is_group = 'no'
        AND account_group = 3`);


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


exports.getBankAccountById = async (req, res) => {
  try {

    let id = req.params?.id;
      const [query] = await db.sequelize.query(`SELECT * FROM MASTER_BANK_ACCOUNT WHERE id = ${id}`);


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







exports.getBankAccountDetailsById = async (req, res) => {
  try {

    let id = req.params?.id;
      const [query] = await db.sequelize.query(`SELECT MBA.*, MB.bank_name, CONCAT(RU.first_name,' ', RU.last_name) AS employee_name, 
VM.vendor_name FROM MASTER_BANK_ACCOUNT AS MBA
LEFT JOIN MASTER_BANK AS MB ON MB.id = MBA.bank_id
LEFT JOIN vendor_managements AS VM ON VM.vendor_management_id = MBA.vendor_id
LEFT JOIN registered_users AS RU ON RU.employee_id = MBA.employee_id
WHERE MBA.isDeleted = '0' AND MBA.id = ${id}`);


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



 



exports.addBankAccount = async (req, res) => { 
  const transaction = await db.sequelize.transaction();
  try {
    const {
      account_name,
      account_type,
      bank_account_no,
      // party_type,
      is_default_account,
      is_company_account,
      iban,
      branch,
      status,
      bank_id,
      entity_id,
      currency_id,
      mapped_company_gl_account,
      chart_account_id,
      // company_account_id,
      // employee_id,
      // vendor_id,
      country
    } = req.body;

    const payload = {
      account_name,
      account_type,
      bank_account_no,
      // party_type,
      is_default_account,
      is_company_account,
      mapped_company_gl_account,
      entity_id,
      iban,
      branch,chart_account_id,
      status,
      bank_id
    };
    
    // if (!company_account_id == '') {
    //   payload.company_account_id = company_account_id;
    // }

    // if (!vendor_id == '') {
    //   payload.vendor_id = vendor_id;
    // }

    // if (!employee_id == '') {
    //   payload.employee_id = employee_id;
    // }

    if (!country == '') {
      payload.country = country;
    }

    const payload1 = {
    }
    let default_account_status = 'Y'
    payload1.default_account_status = 'N'
    payload1.is_default_account =''

    if(is_default_account){
      await db.createBankAccount.update(
        payload1,{where:{default_account_status},transaction}
      )
     payload.default_account_status = 'Y'
    }
    else{
        payload.default_account_status = 'N'
    }

    let id = req.params?.id;
   
    if (id != 'null' && id != '' && id != 'undefined' && id != null && id != undefined) {
      const bankExist = await db.createBankAccount.findOne({where:{id,chart_account_id:chart_account_id},transaction})
      if(!bankExist){
         await db.createBankAccount.update(
           payload,{where:{id},transaction}
         )
         await transaction.commit();
         return res.status(200).send({ code: 200, message: "Updated Successfully" });
        }else{
          await transaction.rollback();
          return res.status(404).send({code:404,message:'This account is already mapped'})
        }
      
    }
   
    else {
     
      const bankExist = await db.createBankAccount.findOne({where:{chart_account_id:chart_account_id},transaction})
      if(bankExist){
          return res.status(404).send({code:404,message:'This account is already mapped'})
        }
      const createData = await db.createBankAccount.create(payload,{transaction});
      if (createData) {
        await transaction.commit();
        return res
          .status(201)
          .send({ code: 201, message: "Bank Account Created Successfully" });
      } else {
        await transaction.rollback();
        return res
          .status(200)
          .send({ code: 404, message: "Bank Account not added!" });
      }
    }
    
    
  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({ code: 500, message: error.message });
  }
};




exports.deleteBankAccount = async (req, res) => {
  try {
    const {id} =req.params;
   
    await db.createBankAccount.update({isDeleted:'1'},{where:{id}})

    return res
      .status(200)
      .send({ code: 200, message: "Deleted Successfully!" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};


exports.getAccountNameByBankId = async (req, res) => {
  try {
    const {id} =req.params;
    const getData = await db.createChartOfAccounts.findAll({where:{parent_account:5,is_group:'no'}})
    if(getData){
      return res.status(200).send({ code: 200, message: "Fetched Successfully!", data:getData });
    }else{
      return res.status(200).send({ code: 404, message: "Record Not Found!" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
}



exports.getBankAccountNameByBankId = async (req, res) => {
  try {
    const {id} =req.params;
    const getData = await db.createChartOfAccounts.findAll({where:{bank_id: id,is_group:'no'}})
    if(getData){
      return res.status(200).send({ code: 200, message: "Fetched Successfully!", data:getData });
    }else{
      return res.status(200).send({ code: 404, message: "Record Not Found!" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
}