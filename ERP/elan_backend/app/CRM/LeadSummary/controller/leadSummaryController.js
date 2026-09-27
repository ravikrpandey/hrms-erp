const db = require("../../../models/index");



module.exports.getLeadSummaryData = async (req, res) => {
  try {
    const { user_id, from_date, to_date, status, login_id } = req.query;
    let response = [];
    const singleEmployeeList = await db.user.findAll({ where: { employee_id: login_id } })
    let role = singleEmployeeList[0]?.user_role;
    if (role == 'Super Admin') {
      const [allLead] = await db.sequelize.query(
        `SELECT C.*,DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt,
        JSON_EXTRACT(C.dynamic_fields, '$.status') AS status
         FROM CRM_CREATE_LEAD_MST AS C
         WHERE JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) != 'Deal Close'
         ORDER BY C.id DESC`
    );
    
    const proposalList = await db.proposalData.findAll({
        where: {
          create_lead_id: allLead.map(lead => lead.id) 
        }
    });
    allLead.forEach(lead => {
        const matchingProposal = proposalList.find(proposal => proposal.create_lead_id === lead.id);
        
        
        lead.proposal_id = matchingProposal ? matchingProposal.id : null;
        lead.proposal_status = matchingProposal ? matchingProposal.proposal_status : null;
    });
    
  
    response = allLead;
    
    }
    else {
     
      const [selfData] = await db.sequelize.query(`
        SELECT DISTINCT C.* , R.first_name AS user_first_name, R.middle_name AS user_middle_name,
        R.last_name AS user_last_name 
        FROM CRM_CREATE_LEAD_MST AS C 
        LEFT JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = C.user_id
        LEFT JOIN CRM_ASSIGN_EMPLOYEE_MST AS CS ON CS.assign_id = C.user_id
        LEFT JOIN CRM_ASSIGN_USER_MST AS CA ON CA.id = CS.assign_user_id
        WHERE (C.user_id = ${login_id} OR CA.employee_id=${login_id}) 
        AND JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) != "Deal Close" ORDER BY C.id DESC`)
  
        let filteredResponse = selfData;
        if (user_id || status || from_date || to_date) {
          filteredResponse = filteredResponse.filter(item => {
            const user_idFilter = user_id ? item.login_id == user_id : true;
            const statusFilter = status ? item.dynamic_fields.stage === status : true;
            const createdAt = new Date(item.createdAt);
            const fromDateFilter = from_date ? new Date(from_date) <= createdAt : true;
            const toDateFilter = to_date ? createdAt <= new Date(to_date) : true;
  
            return user_idFilter && statusFilter && fromDateFilter && toDateFilter;
          });
        }
        if (filteredResponse.length > 0) {
          return res.status(200).send({ code: 200, message: "Get Data Successfully", data: filteredResponse });
        } else {
          return res.status(404).send({ code: 404, message: "No Data Found " });
        }
      }
      return res.status(200).send({ code: 200, message: "Get Data Successfully", data: response });
        
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};


module.exports.getLeadStatusData = async (req, res) => {
  try {
    const getAllStatusData = await db.models.fieldValue.findAll({
      attributes: ['id', 'field_value'],
      order: [['id', 'DESC']]
    });
    if (getAllStatusData.length > 0) {
      return res.status(200).send({ code: 200, message: "Get Data Successfully", data: getAllStatusData });
    } else {
      return res.status(404).send({ code: 404, message: "No Data Found " });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: " server error" });
  }
}

module.exports.createLeadSummary = async (req, res) => {
  try {
    const { assign_id, leadList } = req.body;

    if (!Array.isArray(leadList)) {
      return res.status(400).send({ code: 400, message: "Invalid request format. Expected an array of leads in the 'leadList' property." });
    }
    const dataExist = await db.user.findOne({ where: { employee_id: assign_id } });
    if (!dataExist) {
      return res.status(404).send({ code: 404, message: "No Data Found  " });
    }
    const updatePromises = leadList?.map(async (item) => {
      return await db.createLead.update(
        { login_id: assign_id },
        { where: { id: item?.create_lead_id } }
      );
    })
    const updateResults = await Promise.all(updatePromises);
    const allUpdatesSuccessful = updateResults.every(result => result[0] > 0);
    if (allUpdatesSuccessful) {
      return res.status(200).send({ code: 200, message: "Successfully Assigned" });
    } else {
      return res.status(400).send({ code: 400, message: "Failed to Assign" });
    }

  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || 'Server error' });
  }
};