const db = require("../../../models/index");
const logger = require('../../../../logger/index');

exports.createSubCategory = async (req, res) => {
    try {
        let {
            sub_category_name, sub_category_code, item_category_id,
        } = req.body;
        let { entity_id, financial_year_id } = req.query;
        const getSubCategoryName = await db.SubCategory.findOne({
            where: { sub_category_name: sub_category_name, status: 'ACTIVE', isDeleted: false }
        })
        if (getSubCategoryName) {
            return res.status(400).send({ code: 400, message: "Sub Category Name Already Exist" })
        }
        const createData = await db.SubCategory.create({
            sub_category_name, sub_category_code, item_category_id, financial_year_id, entity_id
        });

        return res.status(200).json({ code: 200, message: "Sub Category Created Successfully", data: createData });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllSubCategory = async (req, res) => {
    try {
        const items = await db.SubCategory.findAll({
            where: { isDeleted: false },
            include: [
                {
                    model: db.asset
                },
            ],
            order: [
                ['id', 'DESC'], // Order by 'id' in descending order
            ],
        });
        if (items.length > 0) {
            return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: items });
        } else {
            return res.status(201).send({ code: 201, message: "No Item found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.getAllSubCategory_id = async (req, res) => {
    try {
        const id = req.params.id;
        const items = await db.SubCategory.findAll({
            where: { isDeleted: false, id: id },
            include: [
                {
                    model: db.asset
                },
                {
                    model: db.entityMaster,
                    attributes: ['entity_name']
                },
                {
                    model: db.financial_year,
                    attributes: ['financial_year']
                }
            ],
        });

        if (items.length > 0) {
            return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: items });
        } else {
            return res.status(201).send({ code: 201, message: "No Item found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.updateSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        let { sub_category_name, item_category_id } = req.body;
        let { entity_id, financial_year_id } = req.query;

        const subCategory = await db.SubCategory.findOne({
            where: { id, isDeleted: false },
        });

        // Check if name already exists
        const getSubCategoryName = await db.SubCategory.findOne({
            where: {
                sub_category_name,
                status: 'ACTIVE',
                isDeleted: false
            }
        });

        if (getSubCategoryName) {
            return res.status(400).send({ code: 400, message: "Sub Category Name Already Exist" }); // <-- RETURN here
        }

        if (!subCategory) {
            return res.status(404).json({ code: 404, message: "Sub Category Not Found or Deleted" });
        }
       
        subCategory.item_category_id = item_category_id;
        subCategory.sub_category_name = sub_category_name;
        subCategory.financial_year_id = financial_year_id;
        subCategory.entity_id = entity_id;
        let subCat = await db.SubCategory.update({ sub_category_name, item_category_id, financial_year_id, entity_id }, { where:{id} });
        if (subCat[0]===1 ) {
            return res.status(200).json({ code: 200, message: "Sub Category Updated Successfully", data: subCategory });
        } else {
            return res.status(400).json({ code: 400, message: "Failed!" });
        }

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.deleteSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const getAllData = await db.SubCategory.findOne({ where: { id: id } });
        if (getAllData) {
            await db.SubCategory.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Subcategory deleted successfully!" });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};

exports.SubCategoryStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await db.SubCategory.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await db.SubCategory.update(
                { status },
                { where: { id: id } }
            );
            return res.status(200).send({
                code: 200,
                message: "SubCategory Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllItemCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const items = await db.SubCategory.findAll({
            where: { isDeleted: false, item_category_id: id, status: 'ACTIVE' },
        });
        if (items.length > 0) {
            return res.status(200).send({ code: 200, message: "Get All Item data successfully", data: items });
        } else {
            return res.status(201).send({ code: 201, message: "Sub category not found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};