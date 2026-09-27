const db = require("../../models/index");

const division = db.division_master;
const Op = db.Sequelize.Op;

// Create a new division
exports.createdivision = async (req, res) => {
    try {
      const { division_name, entity_id } = req.body;
      const divisiondata = await division.findOne({ where: { division_name, entity_id, isDeleted: 0 } });
      if (divisiondata) {
        return res.status(201).send({ code: 201, message: "division already exists!" });
      }
      const divisionData = await division.create({
        division_name,
        entity_id
      });
      return res.status(200).send({ code: 200, message: "Created successfully", data: divisionData });
    } catch (err) {
      return res.status(500).send({ code: 500, message: err.message || "Server error" });
    }
  };
  
  // Get a list of divisions
  exports.divisionList = async (req, res) => {
    try {
      const { entity_id } = req.query; 
      const divisionData = await division.findAll({
        where: { isDeleted: false, entity_id },
        attributes: ['division_id', 'division_name', 'status'],
        order: [['division_id', 'DESC']],
      });
      if (divisionData) {
        res.status(200).send({ message: "division data list fetched successfully", data: divisionData });
      }
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ message: "Error", error: err.message });
    }
  };
  
  // Get division details
  exports.divisionDetails = async (req, res) => {
    const division_id = parseInt(req.params.division_id);
    try {
      const divisionData = await division.findOne({
        where: { division_id },
        attributes: ['division_id', 'division_name', 'status'],
      });
      if (divisionData) {
        res.status(200).send({ message: "division details fetched successfully", data: divisionData });
      }
    } catch (err) {
      res.status(400).send({ message: "Error", error: err.message });
    }
  };
  
  // Update division details
  exports.divisionUpdate = async (req, res) => {
    try {
      const division_id = parseInt(req.params.division_id);
      const { division_name } = req.body;
      const divisionDetails = await division.findOne({ where: { division_id } });
      if (divisionDetails) {
        const divisionExists = await division.findOne({ where: { division_name } });
        if (divisionExists) {
          return res.status(409).send({ code: 409, message: "division already exists!" });
        } else {
          const divisionData = await division.update(req.body, {
            where: { division_id }
          });
          return res.status(200).send({ message: "division updated successfully", data: divisionData });
        }
      } else {
        return res.status(403).send({ code: 403, message: "Record not found" });
      }
    } catch (err) {
      return res.status(500).send({ code: 500, message: err.message || "Server error" });
    }
  };
  
  // Update division status
  exports.update_divisionStatus = async (req, res) => {
    try {
      const division_id = parseInt(req.params.division_id);
      const { status } = req.body;
      const editData = await division.findOne({ where: { division_id } });
      if (editData) {
        const updateData = await division.update(
          { status },
          { where: { division_id } }
        );
        return res.status(200).send({ code: 200, message: "Status updated successfully", data: updateData });
      } else {
        return res.status(400).send({ code: 400, message: "Record not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ code: 500, message: "Server error" });
    }
  };
  
  // Soft delete a division
  exports.divisionDeleted = async (req, res) => {
    const division_id = parseInt(req.params.division_id);
    try {
      const divisionDetails = await division.findOne({ where: { division_id } });
      if (divisionDetails) {
        const divisionData = await division.update({ isDeleted: true }, {
          where: { division_id }
        });
        return res.status(200).send({ code: 200, message: "Data deleted successfully", data: divisionData });
      } else {
        return res.status(403).send({ code: 403, message: "Record not found" });
      }
    } catch (err) {
      return res.status(500).send({ code: 500, message: "Server error" });
    }
  };
  
  /** get all active division list */
  // Get a list of divisions
  exports.getactivedivisionList = async (req, res) => {
    try {
      const { entity_id } = req.query; 
      const divisionData = await division.findAll({
        where: { isDeleted: false, entity_id, status: "ACTIVE" },
        attributes: ['division_id', 'division_name', 'status'],
        order: [['division_id', 'DESC']],
      });
      if (divisionData) {
        res.status(200).send({ message: "division data list fetched successfully", data: divisionData });
      }
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ message: "Error", error: err.message });
    }
  };