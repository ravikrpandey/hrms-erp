const { response } = require("express");
const Sequelize = require("sequelize");
const db = require("../../../models/index");



exports.getActiveMonthByFinancialYearId = async (req, res) => {
  try {

    let id = req.query?.entity_id;
    let financial_year_id = req.query?.financial_year_id;
      const [query] = await db.sequelize.query(`SELECT MPPM.month FROM MASTER_POSTING_PERIOD AS MPP
LEFT JOIN MASTER_POSTING_PERIOD_MONTH_LIST AS MPPM ON MPPM.posting_period_id = MPP.id
WHERE MPP.status = 'ACTIVE' AND MPP.isDeleted = 0 AND MPP.financial_year_id = ${financial_year_id} AND MPPM.status = 'ACTIVE' AND MPP.entity_id = ${id}`);



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

exports.getPostingPeriodList = async (req, res) => {
  try {
  let id = req.params?.id;
      const [query] = await db.sequelize.query(`
        SELECT MPP.*, MML.month_name AS from_month_name, MMLI.month_name
        AS to_month_name, MFY.financial_year 
        FROM MASTER_POSTING_PERIOD AS MPP
INNER JOIN MASTER_FINANCIAL_YEAR AS MFY ON MFY.id = MPP.financial_year_id
INNER JOIN MASTER_MONTH_LIST AS MML ON MML.id = MPP.from_month
INNER JOIN MASTER_MONTH_LIST AS MMLI ON MMLI.id = MPP.to_month
WHERE MPP.isDeleted = '0' AND MFY.isDeleted = false   AND MPP.status = 'ACTIVE'  ORDER BY MPP.createdAt DESC`);


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

exports.getFinancialYearList = async (req,res) => {
  try{
    let entity_id = req.params?.id;
 
  const [query] = await db.sequelize.query(`SELECT * FROM MASTER_FINANCIAL_YEAR WHERE isDeleted = false`);   
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
}


exports.getFromToMonthByFinancialYear = async (req,res) => {
  try{
    let id = req.params?.id;
  const [query] = await db.sequelize.query(`
    SELECT M.id, M.financial_year, M.year_start_date, M.year_end_date,MONTH( M.add_start_date ) AS additional_from_month,
    MONTH(M.add_end_date) AS additional_to_month, M.is_add_date AS isAdditionalMonth ,MONTH(M.year_start_date) AS from_month , MONTH(M.year_end_date) AS to_month
    FROM MASTER_FINANCIAL_YEAR AS  M
    WHERE M.id = ${id}  AND M.isDeleted = 0`);   
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
}




exports.getFromToMonthByEntityId = async (req,res) => {
  try{
    let entity_id = req.params?.id;
 
  const [query] = await db.sequelize.query(`SELECT from_month, to_month FROM ENTITY_MASTER WHERE id = ${entity_id}`);   
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
}



exports.getPostingPeriodById = async (req, res) => {
  try {

    let id = req.params?.id;
      const [query] = await db.sequelize.query(`
        SELECT MPP.* ,MONTH(MFY.year_start_date) AS from_month ,MONTH(MFY.year_end_date) AS to_month,MFY.year_start_date,MFY.year_end_date FROM MASTER_POSTING_PERIOD AS MPP
INNER JOIN MASTER_FINANCIAL_YEAR AS MFY ON MPP.financial_year_id = MFY.id
        
        WHERE MPP.id = ${id}`);


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


exports.getFinancialYearActiveMonthByEntityId = async (req, res) => {
  try {

    let id = req.params?.id;
      const [query] = await db.sequelize.query(`SELECT MPPM.month, MPP.from_month, MPP.to_month FROM MASTER_FINANCIAL_YEAR AS MFY
INNER JOIN MASTER_POSTING_PERIOD AS MPP ON MPP.financial_year_id = MFY.id
INNER JOIN MASTER_POSTING_PERIOD_MONTH_LIST AS MPPM ON MPPM.posting_period_id = MPP.id
INNER JOIN ENTITY_MASTER AS E ON JSON_CONTAINS(E.financial_id, CAST(MFY.id AS JSON))
WHERE MFY.isDeleted = '0' AND MFY.status = 'ACTIVE' AND MPP.isDeleted = '0' AND MPPM.status = 'ACTIVE' AND E.id = ${id}`);

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





exports.getFinancialYearActiveMonthByEntityFinancial = async (req, res) => {
  try {
    let id = req.params?.id;
    let financial_id = req.params.financial_id;

    const getDate = new Date();
    const currentDate = getDate.toISOString().split('T')[0];
    
   
    const [query] = await db.sequelize.query(`
      SELECT MPPM.month 
      FROM MASTER_POSTING_PERIOD AS MPP
      LEFT JOIN MASTER_POSTING_PERIOD_MONTH_LIST AS MPPM ON MPPM.posting_period_id = MPP.id
      INNER JOIN MASTER_FINANCIAL_YEAR AS F ON MPP.financial_year_id = F.id 
      WHERE MPP.status = 'ACTIVE' AND MPP.isDeleted = 0 
      AND MPP.financial_year_id = ${financial_id}
      AND MPPM.status = 'ACTIVE' 
      AND '${currentDate}' BETWEEN F.year_start_date AND F.year_end_date
      AND MPP.entity_id = ${id}
    `);
    
   
    if (query.length > 0) {
     
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetched Data Successfully!",
          data: query,
        });
    } else {
      // Check if the month is active but the date doesn't match the financial year range
      const [dateCheck] = await db.sequelize.query(`
        SELECT * 
        FROM MASTER_POSTING_PERIOD AS MPP
        LEFT JOIN MASTER_POSTING_PERIOD_MONTH_LIST AS MPPM ON MPPM.posting_period_id = MPP.id
        INNER JOIN MASTER_FINANCIAL_YEAR AS F ON MPP.financial_year_id = F.id 
        WHERE MPP.status = 'ACTIVE' 
        AND MPPM.status = 'ACTIVE' 
        AND '${currentDate}' NOT BETWEEN F.year_start_date AND F.year_end_date
        AND MPP.entity_id = ${id} 
        AND MPP.financial_year_id = ${financial_id}
      `);
      
      if (dateCheck.length > 0) {
        return res
          .status(201)
          .send({
            code: 201,
            message: "Posting period is active, but the current date is outside the financial year range.",
            data: query,
          });
      } else {
        // If both conditions fail
        return res
          .status(400)
          .send({
            code: 400,
            message: "Posting period is either inactive or the month is not within the active period.",
            data: query,
          });
      }
    }
  } catch (error) {
   
    return res.status(500).send({ code: 500, message: "Internal Server Error", error: error.message });
  }
};




exports.getPostingPeriodMonthListById = async (req, res) => {
    try {
  
      let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT * FROM MASTER_POSTING_PERIOD_MONTH_LIST 
WHERE posting_period_id = ${id}`);
  
  
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


exports.getAdditionalPostingPeriodMonthListById = async (req, res) => {
    try {
  
      let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT * FROM MASTER_ADDITION_POSTING_PERIOD_MONTH_LIST 
WHERE posting_period_id = ${id}`);
  
  
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


exports.addPostingPeriod = async (req, res) => { 
    try {
         
      const {
        period_name,
        financial_year_id,
        entity_id,
        from_month,
        to_month,
        status,
        is_additional_months,
        monthList,
        additionalMonthsList
      } = req.body;
  
      let posting_period_id = req.params.id; 
  
      const payload = {
        period_name,
        financial_year_id,
        from_month,
        to_month,
        is_additional_months,
        entity_id,
        status
      };
   

   
      if (posting_period_id != null && posting_period_id != 'null' && posting_period_id != undefined && posting_period_id != '') {
        
        

        const updateResult = await db.createPostingPeriod.update(payload, {
          where: { id: posting_period_id }
        });
  
        if (updateResult) {
          
          await db.createPostingPeriodMonthList.destroy({
            where: { posting_period_id: posting_period_id }
          });
  
          
      
          const monthListData = monthList.map(month => ({
            month: month.month,
            status: month.status,
            posting_period_id: posting_period_id // Use the existing ID
          }));
  
          await db.createPostingPeriodMonthList.bulkCreate(monthListData);
  

    if(is_additional_months){

          if(additionalMonthsList.length > 0){

            await db.createAdditionalPostingPeriodMonth.destroy({
            where: { posting_period_id: posting_period_id }
          });

            const additionalMonthsLists = additionalMonthsList.map(month => ({
              month: month.month,
              status: month.status,
              posting_period_id: posting_period_id
            }));

             await db.createAdditionalPostingPeriodMonth.bulkCreate(additionalMonthsLists);
          }
        }

          return res.status(200).send({
            code: 200,
            message: "Posting Period Month List Updated Successfully"
          });
        } else {
          return res.status(404).send({
            code: 404,
            message: "Posting Period not found or update failed"
          });
        }
  
      }
      
      else {
        const postingPeriodExist = await db.createPostingPeriod.findOne({where:{isDeleted:0}})
        if(postingPeriodExist){
          return res.status(404).send({code:404,message:'This Posting Period Already Exist'})
        }
      
        const createData = await db.createPostingPeriod.create(payload);
  
        if (createData) {
          posting_period_id = createData.id; 
  
         
          const monthListData = monthList.map(month => ({
            month: month.month,
            status: month.status,
            posting_period_id: posting_period_id
          }));
  
          await db.createPostingPeriodMonthList.bulkCreate(monthListData);

          if(is_additional_months){

          if(additionalMonthsList.length > 0){
            posting_period_id = createData.id;

            const additionalMonthsLists = additionalMonthsList.map(month => ({
              month: month.month,
              status: month.status,
              posting_period_id: posting_period_id
            }));

             await db.createAdditionalPostingPeriodMonth.bulkCreate(additionalMonthsLists);
          }
        }
          return res.status(201).send({
            code: 201,
            message: "Posting Period Month List Created Successfully"
          });
        } else {
          return res.status(400).send({
            code: 400,
            message: "Posting Period not added"
          });
        }
      }
  
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
    }
  };
  


exports.deletePostingPeriod = async (req, res) => {
  try {
    const {id} =req.params;
   
    await db.createPostingPeriod.update({isDeleted:'1'},{where:{id}})

    return res
      .status(200)
      .send({ code: 200, message: "Deleted Successfully!" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};


