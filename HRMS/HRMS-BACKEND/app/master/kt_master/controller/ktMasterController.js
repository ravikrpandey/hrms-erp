const db = require("../../../models/index");
const Op = db.Sequelize.Op;

// Create a new KT Category
exports.createKtCategory = async (req, res) => {
    try {
        const { category_name, description, entity_id } = req.body;

        // Check exist
        const exists = await db.kt_master.findOne({
            where: { category_name, entity_id, isDeleted: false },
        });

        if (exists) {
            return res
                .status(201)
                .send({ code: 201, message: "Category Name already exists!" });
        }

        // Create
        const created = await db.kt_master.create({
            category_name,
            description,
            entity_id,
        });

        return res
            .status(200)
            .send({ code: 200, message: "Created successfully", data: created });

    } catch (err) {
        return res.status(500).send({ code: 500, message: "Server error" });
    }
};


// Get a list of KT Category
exports.KtCategoryList = async (req, res) => {
    try {
        const { entity_id } = req.query;
        const data = await  db.kt_master.findAll({
            where: { isDeleted: false, entity_id },
            attributes: ["id", "category_name", "status","description"],
            order: [["id", "DESC"]],
        });
        if (data) {
            res.status(200).send({
                message: "Category Name data list fetched successfully",
                data: data,
            });
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ message: "Error", error: err.message });
    }
};

// Get KT Category details by ID
exports.KtCategoryById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = await  db.kt_master.findOne({
            where: { id },
            attributes: ["id", "category_name", "description"],
        });
        if (data) {
            res.status(200).send({
                message: "Category Name fetched successfully",
                data: data,
            });
        }
    } catch (err) {
        res.status(400).send({ message: "Error", error: err.message });
    }
};

// Update KT Category details
exports.KtCategoryUpdate = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { category_name } = req.body;
        const data = await  db.kt_master.findOne({ where: { id } });
        if (data) {
            const gradeExists = await  db.kt_master.findOne({
                where: { category_name, id: { [db.Sequelize.Op.ne]: id } },
            });
            if (gradeExists) {
                return res
                    .status(409)
                    .send({ code: 409, message: "Category Name already exists!" });
            } else {
                const data = await  db.kt_master.update(req.body, {
                    where: { id },
                });
                return res
                    .status(200)
                    .send({ message: "Category Name updated successfully", data: data });
            }
        } else {
            return res.status(403).send({ code: 403, message: "Record not found" });
        }
    } catch (err) {
        return res.status(500).send({ code: 500, message: "Server error" });
    }
};

// Update KT Category status
exports.updateKtCategoryStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const editData = await  db.kt_master.findOne({ where: { id } });
        if (editData) {
            const updateData = await  db.kt_master.update(
                { status },
                { where: { id } }
            );
            return res.status(200).send({
                code: 200,
                message: "Status updated successfully!",
                data: updateData,
            });
        } else {
            return res.status(400).send({ code: 400, message: "Record not found!" });
        }
    } catch (error) {
        return res
            .status(500)
            .send({ code: 500, message: "Internal server error!" });
    }
};

// Soft delete a  KT Category
exports.deleteKtCategoryById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = await  db.kt_master.findOne({ where: { id } });
        if (data) {
            const data = await  db.kt_master.update(
                { isDeleted: true },
                {
                    where: { id },
                }
            );
            return res
                .status(200)
                .send({ code: 200, message: "Deleted successfully!", data: data });
        } else {
            return res.status(403).send({ code: 403, message: "Record not found!" });
        }
    } catch (err) {
        return res
            .status(500)
            .send({ code: 500, message:err.message || "Internal server error!" });
    }
}
