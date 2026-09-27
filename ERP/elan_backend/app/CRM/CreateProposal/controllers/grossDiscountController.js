
const db = require("../../../models/index");
const { Op, where } = require("sequelize");



module.exports.getGrossDiscMst = async (req, res, next) => {
  try {
    const discountData = await db.sequelize.query(
      `
      SELECT GDM.* 
      FROM CRM_PROPOSAL_GROSS_DISCOUNT_MST AS GDM
      WHERE GDM.isDeleted = false 
        AND GDM.status = true
      `,
      { type: db.Sequelize.QueryTypes.SELECT }
    );

    if (!discountData || discountData.length === 0) {
      return res.status(404).send({ code: 404, message: "No discount data found" });
    }

    return res.status(200).send({ code: 200, message: "Success", data: discountData });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};



module.exports.getLatestBankDataByEntityId = async function (entityId) {
  try {
    const bankData = await db.sequelize.query(
      `
      SELECT   
      MBA.account_name,
        MBA.bank_account_no, 
        MBA.account_type,  
        MBA.bank_ifsc_code
      FROM MASTER_BANK AS MB
      LEFT JOIN MASTER_BANK_ACCOUNT AS MBA 
        ON MBA.bank_id = MB.id
      WHERE MB.isDeleted = false 
        AND MB.status = true
        AND MB.entity_id = :entityId
      ORDER BY MB.id DESC
      LIMIT 1
      `,
      {
        type: db.Sequelize.QueryTypes.SELECT,
        replacements: { entityId },
      }
    );

    return bankData.length > 0 ? bankData[0] : null;
  } catch (error) {
    throw new Error(error.message);
  }
};

