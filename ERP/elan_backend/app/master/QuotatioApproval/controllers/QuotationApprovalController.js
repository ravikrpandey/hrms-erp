const db = require("../../../../app/models/index");



exports.saveQuotationApproval = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { sub_category_ids, levels, status } = req.body;

    if (!Array.isArray(sub_category_ids) || sub_category_ids.length === 0) {
      return res.status(400).send({ code: 400, message: "sub_category_ids is required" });
    }

    if (!Array.isArray(levels) || levels.length === 0) {
      return res.status(400).send({ code: 400, message: "levels is required" });
    }

    const approval = await db.quotationApproval.create(
      { status: status || "ACTIVE", isDeleted: false },
      { transaction: t }
    );

 
    let details = [];
    for (const subId of sub_category_ids) {
      for (const lvl of levels) {
        details.push({
          quotationApprovalId: approval.id,
          sub_category_id: subId,
          level_id: lvl.level,  
          discount: lvl.discount
        });
      }
    }

    await db.quotationApprovalDetails.bulkCreate(details, { transaction: t });
    await t.commit();

    return res.status(201).send({
      code: 201,
      message: "Quotation Approval created successfully",
      
    });

  } catch (error) {
    await t.rollback();
    console.error("Error in saveQuotationApproval:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// getall data
exports.getAllQuotationApprovals = async (req, res) => {
  try {
    const approvals = await db.quotationApproval.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: db.quotationApprovalDetails,
          as: "details",
          attributes: ["id","quotationApprovalId", "sub_category_id", "level_id", "discount"]
        }
      ],
      order: [["id", "DESC"]]
    });



    if (approvals.length) {
    
      // const mappedApprovals = approvals.map(x => ({
      //   id: x.id,
      //   level_id: x.level_id,
      //   discount: x.discount,
      //   level: x.quotationLevel?.level_type || "",
      //   category: x.subCategoryLevel?.sub_category_name || ""
      // }));
  
      
      // const mergedApprovals = [];
  
      // mappedApprovals.forEach(item => {
      //   const existing = mergedApprovals.find(x => x.level_id === item.level_id);
  
      //   if (existing) {
         
      //     const categoryList = existing.category.split(',').map(c => c.trim());
      //     if (!categoryList.includes(item.category)) {
      //       existing.category += `, ${item.category}`;
      //     }
      //   } else {
      //     mergedApprovals.push({
      //       level_id: item.level_id,
      //       level: item.level,
      //       discount: item.discount,
      //       category: item.category
      //     });
      //   }
      // });
  
      return res.status(200).send({
        code: 200,
        message: "Data fetched successfully",
        data: approvals
      });
    }else{
      return res.status(200).send({
        code: 200,
        message: "Quotation Approvals not found",
       
      });

    }

  } catch (error) {
    console.error("Error in getAllQuotationApprovals:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// getbyid api
exports.getQuotationApprovalById = async (req, res) => {
  try {
    const { id } = req.params;

    const approval = await db.quotationApproval.findOne({
      where: { id, isDeleted: false },
      include: [
        {
          model: db.quotationApprovalDetails,
          as: "details",
          attributes: ["id", "quotationApprovalId", "sub_category_id", "level_id", "discount"]
        }
      ]
    });



    if (!approval) {
      return res.status(404).send({
        code: 404,
        message: "Quotation Approval not found"
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Quotation Approval fetched successfully",
      data: approval
    });

  } catch (error) {
    console.error("Error in getQuotationApprovalById:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


// update api
exports.update_quotationApprovalById = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const { sub_category_ids, levels, status } = req.body;

    const approval = await db.quotationApproval.findOne({
      where: { id, isDeleted: false }
    });

    if (!approval) {
      await t.rollback();
      return res.status(404).send({ code: 404, message: "Quotation Approval not found!" });
    }

    await approval.update({ status: status || approval.status }, { transaction: t });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction: t });

    await db.quotationApprovalDetails.destroy({
      where: { quotationApprovalId: id },
      transaction: t
    });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction: t });
    let details = [];
    for (const subId of sub_category_ids) {
      for (const lvl of levels) {
        details.push({
          quotationApprovalId: id,
          sub_category_id: subId,
          level_id: lvl.level, 
          discount: lvl.discount
        });
      }
    }

    await db.quotationApprovalDetails.bulkCreate(details, { transaction: t });

    await t.commit();
    const updatedApproval = await db.quotationApproval.findOne({
      where: { id, isDeleted: false },
      include: [{ model: db.quotationApprovalDetails, as: "details" }]
    });

    return res.status(200).send({
      code: 200,
      message: "Quotation Approval updated successfully!",
      data: updatedApproval
    });

  } catch (error) {
    if (!t.finished) { 
      await t.rollback();
    }
    console.error("Error in update_quotationApprovalById:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
};



exports.deleteQuotationApproval = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const approval = await db.quotationApproval.findOne({
      where: { id, isDeleted: false }
    });

    if (!approval) {
      return res.status(404).send({
        code: 404,
        message: "Quotation Approval not found!"
      });
    }

    await db.quotationApproval.update(
      { isDeleted: true },
      { where: { id }, transaction: t }
    );

    await db.quotationApprovalDetails.update(
      { isDeleted: true },
      { where: { quotationApprovalId: id }, transaction: t }
    );

    await t.commit();

    return res.status(200).send({
      code: 200,
      message: "Quotation Approval deleted successfully!"
    });

  } catch (error) {
    await t.rollback();
    console.error("Error in deleteQuotationApproval:", error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
};



exports.getsubcatorgyData = async (req, res) => {
  try {
    const { currentApprovalId } = req.query;

    let subCategories = await db.SubCategory.findAll({
      where: { isDeleted: false },
      attributes: ["id", "sub_category_name"]
    });

    const approvals = await db.quotationApprovalDetails.findAll({
      where: { isDeleted: false },
      attributes: ["sub_category_id"]
    });

    let usedSet = new Set();
    approvals.forEach(appr => {
      if (appr.sub_category_id) {
        usedSet.add(appr.sub_category_id);
      }
    });

    let currentIds = [];
    if (currentApprovalId) {
      const currentDetails = await db.quotationApprovalDetails.findAll({
        where: { quotationApprovalId: currentApprovalId, isDeleted: false },
        attributes: ["sub_category_id"]
      });

      currentIds = currentDetails.map(cd => cd.sub_category_id);
    }

    let result = subCategories.map(sc => {
      const isUsed = usedSet.has(sc.id) && !currentIds.includes(sc.id);
      return {
        id: sc.id,
        sub_category_name: sc.sub_category_name,
        disabled: isUsed
      };
    });

    return res.status(200).send({
      code: 200,
      message: "SubCategories fetched successfully",
      data: result
    });

  } catch (error) {
    console.error("Error in getsubcatorgyData:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};
