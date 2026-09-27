const db = require("../../../models/index");

class TravelTypeController {
  async addTravelType(req, res) {
    try {
      if (req.body.id) {
        const travelType = await db.TravelType.findByPk(req.body.id);
        if (!travelType) {
          return res.status(404).send({ message: "Travel type not found" });
        }
        // Update existing travel type
        await travelType.update(req.body);
        return res.status(200).send(travelType);
      }
      const newTravelType = await db.TravelType.create(req.body);
      return res.status(201).send(newTravelType);
    } catch (error) {
      console.error("Error adding travel type:", error);
      return res.status(500).send({ message: "Internal server error" });
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