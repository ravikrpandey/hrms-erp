const db = require("../../../models/index");
const RatingModel = db.self_rating;
const { Op } = require("sequelize");

// Get all ratings
exports.allRatings = async (req, res) => {
  try {
    const {
      status = "ACTIVE",
      self_rating,
        self_rating_value,
        description,
      self_data,
      isDeleted = false,
    } = req.query;

    const whereClause = {
        isDeleted,
       
    };
    if (status !== "all") whereClause.status = status;
    if (self_rating)
      whereClause.self_rating = { [Op.like]: `%${self_rating}%` };
    if (description)
      whereClause.description = { [Op.like]: `%${description}%` };
    if (self_data)
      whereClause.self_data = { [Op.like]: `%${self_data}%` };
    if (self_rating_value) whereClause.self_rating_value = self_rating_value;

      const records = await RatingModel.findAll({
        where: whereClause,
        order: [["self_rating_value", "ASC"]]
      });

    if (records.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Self ratings fetched successfully!",
        data: records,
      });
    } else {
      return res.status(200).send({
        code: 404,
        message: "No self ratings found",
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

// Create a new self rating
exports.createRating = async (req, res) => {
  try {
    const {
      self_rating,
      self_rating_value,
      rating_data,
        status = "ACTIVE",
      description,
      isDeleted = false,
    } = req.body;

    if (!self_rating || !rating_data || !self_rating_value) {
      return res
        .status(400)
        .send({ code: 400, message: "All fields are required!" });
    }

    const duplicate = await RatingModel.findOne({
      where: {
        self_rating: self_rating.trim(),
        isDeleted: false,
      },
    });

    if (duplicate) {
      return res
        .status(400)
        .send({ code: 400, message: "Duplicate self rating name!" });
    }

    const newRecord = await RatingModel.create({
        self_rating: self_rating.trim(),
        self_rating_value,
        rating_data,
        description,
        status,
        isDeleted,
    });

    return res.status(201).send({
      code: 201,
      message: "Self rating created successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

// Get rating by ID
exports.getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .send({ code: 400, message: "Missing self rating ID." });
    }

    const record = await RatingModel.findOne({
      where: { id, isDeleted: false },
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

// Update rating by ID
exports.updateRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id || Object.keys(updates).length === 0) {
      return res
        .status(400)
        .send({ code: 400, message: "ID and update data required!" });
    }

    const record = await RatingModel.findByPk(id);
    if (!record || record.isDeleted) {
      return res.status(404).send({ code: 404, message: "Record not found" });
    }

    // Prevent duplicate name
    if (updates.self_rating && updates.self_rating !== record.self_rating) {
      const exists = await RatingModel.findOne({
        where: { self_rating: updates.self_rating.trim(), isDeleted: false },
      });
      if (exists) {
        return res.status(400).send({
          code: 400,
          message: "Duplicate self rating name!",
        });
      }
    }

    Object.assign(record, updates);
    await record.save();

    return res.status(200).send({
      code: 200,
      message: "Updated successfully",
      data: record,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

// Soft delete rating by ID
exports.deleteRatingById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await RatingModel.findByPk(id);
    if (!record || record.isDeleted) {
      return res.status(404).send({ code: 404, message: "Record not found" });
    }

    await RatingModel.update(
      { isDeleted: true, status: "INACTIVE" },
      { where: { id } }
    );

    return res.status(200).send({
      code: 200,
      message: "Delete successful!",
      id: id,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};
