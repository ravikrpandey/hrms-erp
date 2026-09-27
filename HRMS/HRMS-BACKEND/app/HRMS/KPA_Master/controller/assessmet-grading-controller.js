const db = require('../../../models/index')
const GradeModel = db.assessment_grading;
const { Op } = require("sequelize");

exports.getAllGrades = async (req, res) => {
  try {
    const {
        status = "ACTIVE",
        name,
        value,
        description,
        category,
        isDeleted = false,
    } = req.query;

    const whereClause = {
      isDeleted,
    };
    if (status != "all") whereClause.status = status;
    if (name) whereClause.name = name;
    if (value) whereClause.value = value;
    if (category) whereClause.category = category;
    // Handle description (supports partial match if needed)
    if (description) {
      whereClause.description = { [Op.like]: `%${description}%` };
    }
   

    const records = await GradeModel.findAll({
      where: whereClause,
    });

    if (records.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "All assesment grades fetched successfully!",
        data: records,
      });
    } else {
      return res.status(200).send({
        code: 404,
        message: "No assesment grades found",
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
exports.createGrade = async (req, res) => {
    try {
        const {
          status = "ACTIVE",
          name,
          value,
          description,
          category,
          isDeleted = false,
        } = req.body;

        if (!name || !description || isNaN(+value) || !status) { 
           return res.status(400).send({ code: 400, message: "All fields are required!" }); 
        }
        const record = await GradeModel.findOne({
          where: {
            name: name,
            isDeleted: false,
          },
        });
        if (record) {
            return res.status(400).send({ code: 400, message: "Dublicate name for grade!" });
        }
        
        const newRecord = await GradeModel.create({
          name: name.trim(),
          description,
          value,
          status,
          category: category?.trim()||null,
          isDeleted,
        });
     
        return res
          .status(201)
          .send({
            code: 201,
            message: "Graded created successfully",
            data: newRecord,
          });
    
    } catch (error) {
         console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message||"Internal Server Error" });
    }
}
exports.getOneGrade = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing kpa objective id." });
    }
    const record = await GradeModel.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    return res.status(200).send({
      code: 200,
      message: "Success",
      data: record,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};
exports.updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
      let updates = req.body;
      
    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .send({ code: 400, message: "No update provided!" });
    }

    const grade = await GradeModel.findByPk(id);
    if (!grade) {
      return res.status(404).send({ code: 404, message: "Record not found" });
    }

      // Check for duplicate name if name is being updated
      if (updates.name) {
        updates.name = updates.name.trim();
      }
      if (updates.name && updates.name !== grade.name) {
       
      const existingGrade = await GradeModel.findOne({
        where: { name: updates.name.trim(), isDeleted: false },
      });
      if (existingGrade) {
        return res.status(400).send({
          code: 400,
          message: "Duplicate name! Please try with a different name.",
        });
      }
    }

      // Apply updates
      
    Object.assign(grade, updates);
    await grade.save();

    return res.status(200).send({
      code: 200,
      message: "success",
      data: grade,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};
exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing kpa objective id." });
    }
    const updatedRecord = await GradeModel.update(
      {
        isDeleted: true,
        status: "INACTIVE",
      },
      {
        where: { id },
      }
    );
    return res.status(200).send({
      code: 200,
      message: "Delete Successfull!",
      id: id,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};