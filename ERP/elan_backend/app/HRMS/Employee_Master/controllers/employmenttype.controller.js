const db = require("../../../models/index");
const EmploymentType = db.employmenttype;

const Op = db.Sequelize.Op;


exports.createEmployment = async (req, res) => {
  const { emptype_name, status } = req.body;
  try {
    if (!emptype_name) {
      return res.status(400).send({
        message: "Employment_Type Name can not be empty!"
      });
    }

    const userExits = await EmploymentType.findOne({
      where: { emptype_name: emptype_name, status: "ACTIVE", isDeleted: false }
    })
    if (userExits) {
      return res.status(403).send({
        message: "Employment Type Already Exists!"
      })
    }

    // Save employData in the database
    const employData = await EmploymentType.create({
      emptype_name,
      status
    })
    // console.log(JSON.parse("employData", employData))
    return res.status(200).send({
      message: "create successfully!", data: employData
    })
  }
  catch (error) {
    logger.error(`Error ${error.message}`, { error });
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the employData."
    });
  }
}

exports.employmentList = async (req, res) => {
  try {
    const employData = await EmploymentType.findAll({
      where: { isDeleted: false },
      attributes: ['emptype_id', 'emptype_name', 'status'],
      order: [['emptype_id', 'DESC']],
    })
    if (employData) {
      res.status(200).send({ message: "get all employData list", data: employData })
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error.message)
    res.status(500).send({ message: "error", error: error.message })
  }
}

exports.active_employmenttype_List = async (req, res) => {
  try {
    const employData = await EmploymentType.findAll({
      where: { isDeleted: false, status: "ACTIVE" },
      attributes: ['emptype_id', 'emptype_name', 'status'],
    })
    if (employData) {
      res.status(200).send({ message: "get all employData list", data: employData })
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error.message)
    res.status(500).send({ message: "error", error: error.message })
  }
}

exports.getAll_employmentTypeList = async (req, res) => {
  try {
    const employData = await EmploymentType.findAll({
      attributes: ['emptype_id', 'emptype_name', 'status'],
    })
    if (employData) {
      res.status(200).send({ message: "Fetched Successfully", data: employData })
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error.message)
    res.status(500).send({ message: error.message || "Server Error" })
  }
}

exports.employmentDetails = async (req, res) => {
  const employId = parseInt(req.params.emptype_id);
  try {
    const employData = await EmploymentType.findAll({
      where: { emptype_id: employId }
    })
    if (employData) {
      res.status(200).send({ message: "get employment type details success", data: employData })
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    res.status(500).send({ message: error.message || "Server Error" })
  }
}

// exports.employmentUpdate = async (req, res) => {
//   try {
//     const employId = req.params.emptype_id;
//     const { emptype_name } = req.body;

//     let employmentDetails = await EmploymentType.findOne({ where: { emptype_id: employId, isDeleted: false } });

//     if (!employmentDetails) {
//       return res.status(404).send({ code: 404, message: "Employeement Type not found" });
//     } else {
//       const employmentDetails = await EmploymentType.findOne({
//         where: { emptype_name: emptype_name, emptype_id: { [db.Sequelize.Op.ne]: employId } }
//       })
//       if (employmentDetails) {
//         return res.status(409).send({ code: 409, message: "Employeement Type Already Exists" });
//       } else {
//         const employmentDetails = await EmploymentType.update({
//           emptype_name
//         }, {
//           where: {
//             emptype_id: employId
//           }
//         });

//         return res.status(200).send({ code: 200, message: "Employeement Type updated successfully", data: employmentDetails });
//       }
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send({ code: 500, message: error.message });
//   }
// };

exports.employmentUpdate = async (req, res) => {
  try {
    const employId = req.params.emptype_id;
    const { emptype_name, status } = req.body;

    let employmentDetails = await EmploymentType.findOne({ where: { emptype_id: employId, isDeleted: false } });

    if (!employmentDetails) {
      return res.status(404).send({ code: 404, message: "Employment Type not found" });
    } else {
      if (emptype_name) {
        const existingEmployment = await EmploymentType.findOne({
          where: { emptype_name: emptype_name, isDeleted: false, status: "ACTIVE"  }
        });

        if (existingEmployment) {
          return res.status(409).send({ code: 409, message: "Employment Type Already Exists" });
        }
      }

      let updateData = {};
      if (emptype_name !== undefined && emptype_name !== null) {
        updateData.emptype_name = emptype_name;
      }
      if (status !== undefined && status !== null) {
        updateData.status = status;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).send({ code: 400, message: "No fields to update" });
      }

      const updatedEmploymentDetails = await EmploymentType.update(updateData, {
        where: { emptype_id: employId }
      });

      return res.status(200).send({
        code: 200,
        message: "Employment Type updated successfully",
        data: updatedEmploymentDetails
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};



exports.employmentDeleted = async (req, res) => {
  const employId = parseInt(req.params.emptype_id);
  try {
    const employmentDetails = await EmploymentType.findOne({ where: { emptype_id: employId } })
    if (employmentDetails) {
      const employData = await EmploymentType.update({ status: "INACTIVE", isDeleted: true }, {
        where: { emptype_id: employId }
      })
      return res.status(200).send({
        message: "employment type is deleted successfully!"
      });
    } else {
      return res.status(500).send({ message: "Invalid employment type Id..." })
    }
  }
  catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      message: "Could not delete employment type with id=" + error.message
    })
  }
}