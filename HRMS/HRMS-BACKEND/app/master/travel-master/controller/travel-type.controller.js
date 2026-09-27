const db = require("../../../models/index");

class TravelTypeController {
async addTravelType(req, res) {
  try {
    const { id, name, type, parentId } = req.body;
    const { Op } = db.Sequelize;

    if (id) {
      //  Update case
      const travelType = await db.TravelType.findByPk(id);
      if (!travelType) {
        return res.status(404).send({ message: "Travel type not found" });
      }

      // Build duplicate check condition
      let duplicateCondition = { name, type, id: { [Op.ne]: id } };

      if (type === "conveyance") {
        duplicateCondition = { name, type, parentId, id: { [Op.ne]: id } };
      }
      else if (type === "reimbursement"){
        duplicateCondition = { name, type, parentId, id: { [Op.ne]: id } };
      }
      else if(type === "travel"){
        duplicateCondition = { name, type, parentId, id: { [Op.ne]: id } };
      }

      const duplicate = await db.TravelType.findOne({ where: duplicateCondition });
      if (duplicate) {
        return res.status(400).send({ message: `Duplicate ${type} name already exists` });
      }

      await travelType.update(req.body);
      return res.status(200).send(travelType);
    }

    // Create case
    let existingCondition = { name, type };

    if (type === "conveyance") {
      existingCondition = { name, type, parentId };
    }
    else if(type==='reimbursement'){
      existingCondition = { name, type, parentId };
    }
    else if(type==='travel'){
      existingCondition = { name, type, parentId };
    }

    const existing = await db.TravelType.findOne({ where: existingCondition });
    if (existing) {
      return res.status(400).send({ message: `Duplicate ${type} name already exists!` });
    }

    const newTravelType = await db.TravelType.create(req.body);
    return res.status(201).send(newTravelType);

  } catch (error) {
    console.error("Error adding travel type:", error);
    return res.status(500).send({ message: "Internal server error!" });
  }
}



  async getAllTravelType(req, res) {
    const { type } = req.query;
    try {
      const travelTypes = await db.TravelType.findAll({
        where: { type, status: true, parentId: null },
        include: [
          {
            model: db.TravelType,
            as: "children",
            required: false,
          },
        ],
        order: [["name", "ASC"]],
      });
      return res.status(200).send({ data: travelTypes });
    } catch (error) {
      console.error("Error fetching travel types:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async deleteTravelType(req, res) {
    try {
      const { id } = req.params;
      const travelType = await db.TravelType.findByPk(id);
      if (!travelType) {
        return res.status(404).send({ message: "Travel type not found" });
      }

      await travelType.destroy();
      return res
        .status(200)
        .send({ message: "Travel type deleted successfully" });
    } catch (error) {
      console.error("Error deleting travel type:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async getTravelTypeById(req, res) {
    try {
      const { id } = req.params;
      const travelType = await db.TravelType.findByPk(id);
      if (!travelType) {
        return res.status(404).send({ message: "Travel type not found" });
      }
      return res.status(200).send(travelType);
    } catch (error) {
      console.error("Error fetching travel type by ID:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

module.exports = new TravelTypeController();