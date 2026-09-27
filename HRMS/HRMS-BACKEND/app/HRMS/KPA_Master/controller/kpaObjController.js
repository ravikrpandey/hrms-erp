const db = require('../../../models/index')
const KPA_OBJECTIVE = db.kpa_objective;
const { Op } = require("sequelize");

exports.getallKpaObj = async (req, res) => {
  try {
    const {
      status='ACTIVE',
      objective_code,
      objective_name,
      description,
      isDeleted = false,
    } = req.query;


    const whereClause = {
      isDeleted,
    };
    if (status!='all') whereClause.status = status;
    if (objective_code) whereClause.objective_code = objective_code;
    if (objective_name) whereClause.objective_name = objective_name;
    // Handle description (supports partial match if needed)
    if (description) {
      whereClause.description = { [Op.like]: `%${description}%` };
    }

    const kpaobj = await KPA_OBJECTIVE.findAll({
      where: whereClause,
    });

    if (kpaobj.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "All KPA Objectives fetched successfully!",
        data: kpaobj,
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "No KPA Objectives found",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.createKpaObj = async (req, res) => {
    try {
        const { objective_name, description, objective_code, status='ACTIVE' } = req.body;
        if (!objective_name || !description || !objective_code || !status) { 
           return res.status(400).send({ code: 400, message: "All fields are required!" }); 
        }
        const existingkpaObj = await KPA_OBJECTIVE.findOne({
          where: {
            [Op.or]: [{ objective_name }, { objective_code }],
            isDeleted: false,
          },
        });
        if (existingkpaObj) {
            return res.status(400).send({ code: 400, message: "KPA Objective with this name or code already exists!" });
        }
        
        const kpaObj = await KPA_OBJECTIVE.create({
            objective_name,
            description,
            objective_code,
            status
        });
     
        return res
          .status(200)
          .send({ code: 200, message: "No KPA Objective Found", data: kpaObj });
    
    } catch (error) {
         console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message||"Internal Server Error" });
    }
}
exports.getOneKpaObj = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) { 
           return res.status(400).send({ code: 400, message: "Missing kpa objective id." }); 
        }
        const existingkpaObj = await KPA_OBJECTIVE.findOne({
          where: {
            id,
            isDeleted: false,
          },
        });
        
        return res
          .status(200)
          .send({
            code: 200,
            message: "No KPA Objective Found",
            data: existingkpaObj,
          });
    
    } catch (error) {
         console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message||"Internal Server Error" });
    }
}
exports.updateKpaObj = async (req, res) => {
    try {
        const { id } = req.params;
        const { objective_name, description, objective_code, status } = req.body;
        if (!objective_name && !description && !objective_code && !status) { 
            return res.status(400).send({ code: 400, message: "No Update value provided!" });
        }
 
      if (!id) {
        return res
          .status(400)
          .send({ code: 400, message: "Missing id parameter!" });
        }
        if (objective_name || objective_code) {
            let whereclause = { isDeleted: false };
            if (objective_name) {
                whereclause.objective_name = objective_name;
            } else if (objective_code) {
                whereclause.objective_code = objective_code;
            } else {
                whereclause = {
                  [Op.or]: [{ objective_name }, { objective_code }],
                  isDeleted: false,
                };
            }
            const existingkpaObj = await KPA_OBJECTIVE.findOne({
              where: whereclause,
            });
            if (existingkpaObj.id !== parseInt(id)) {
              return res.status(400).send({
                code: 400,
                message: "KPA Objective with this name or code already exists! Please try with different name or code.",
              });
            }
        }

      const kpaObj = await KPA_OBJECTIVE.update(
        {
          objective_name,
          objective_code,
          description,
          status,
        },
        {
          where: { id },
        }
      );

      return res
        .status(200)
        .send({ code: 200, message: "success", data: kpaObj });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Internal Server Error" });
    }
}
exports.deleteKpaObj = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) { 
           return res.status(400).send({ code: 400, message: "Missing kpa objective id." }); 
        }
        const kpaObj = await KPA_OBJECTIVE.update(
          {
            isDeleted: true,
            status: "INACTIVE"
          },
          {
            where: { id },
          }
        );
        return res
          .status(200)
          .send({
            code: 200,
            message: "Deleted KPA Objective Successfully!",
            id: id,
          });
    
    } catch (error) {
         console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message||"Internal Server Error" });
    }
}