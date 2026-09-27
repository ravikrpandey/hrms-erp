const db = require("../../../models/index");
// const stageDetails = db.stage;
const Category = db.productcategory
const op = db.sequelize.op;
const { Op } = require('sequelize');
exports.createCategory = async (req, res) => {
    try {
        const { category_name, entity_id, } = req.body;
        const categorydata = await Category.findOne({ where: { category_name: category_name, isDeleted: false, status:'ACTIVE' } });
        if (categorydata) {
            return res.status(201).send({ code: 201, message: "Category Name is Already Exits!" });
        }
        const product_codes = btoa(Math.random()).slice(0, 10).toUpperCase();
        const response = await Category.create({
            category_name, entity_id,
            category_code: product_codes
        });
        return res.status(200).send({ code: 200, message: "Category created successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllCategory = async (req, res) => {
    try {
        const entity_id = req.params.entity_id;
        const getAllData = await Category.findAll({
            where: { entity_id, isDeleted: false },
            order: [['id', 'DESC']],
        })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getByIdCategory = async (req, res) => {
    try {
        const category_id = parseInt(req.params.category_id);
        const getData = await Category.findOne({ where: { id: category_id } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully", data: getData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);

        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.deleteCategory = async (req, res) => {
    try {
        const category_id = parseInt(req.params.category_id);
        const deleteCategory = await Category.findOne({ where: { id: category_id } });
        if (deleteCategory) {
            const deleteData = await Category.update({ isDeleted: true }, { where: { id: category_id } });
            return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.editCategory = async (req, res) => {
    try {
        const category_id = parseInt(req.params.category_id);
        const { category_name } = req.body;
        const data = await Category.findOne({ where: { id: category_id } });
        if (data) {
            const findCategory = await Category.findOne({
                where: {
                    category_name: category_name,
                    isDeleted: false,
                    // id: { [Op.ne]: category_id }
                    status: 'ACTIVE'
                }
            });
            if (findCategory) {
                return res.status(409).send({ code: 409, message: "Category Name is Already Exits!" });
            } else {
                const updateData = await Category.update(req.body, { where: { id: category_id } });
                return res.status(200).send({ code: 200, message: "Category is update successfully!", data: updateData });
            }
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.updateCategoryStatus = async (req, res) => {
    try {
        const category_id = req.params.category_id;
        const { status } = req.body;
        const editData = await Category.findOne({ where: { id: category_id } });
        if (editData) {
            const updateData = await Category.update(
                {
                    status
                }, { where: { id: category_id } }
            );
            return res.status(200).send({ code: 200, message: "Status Updated Successfully", data: updateData });
        } else {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.getAllActiveCategory = async (req, res) => {
    try {
        const entity_id = parseInt(req.params.entity_id);
        const getAllData = await Category.findAll({
            where: { isDeleted: false, entity_id, status: 'ACTIVE' },
            order: [['id', 'DESC']],
        })
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAllActiveProduct = async (req, res) => {
    try {
        const category_id = parseInt(req.params.category_id);
        const entity_id = parseInt(req.params.entity_id);

        const getAllData = await db.product_master.findAll({
            where: { isDeleted: false, status: 'ACTIVE', asset_id: category_id, entity_id },
            include: [
                {
                    model: db.product__variant_master,
                    attributes: ["variant_name", "product_variant_code"]
                },
                {
                    model: db.uom,
                    attributes: ["uom_name"],
                    required: false,
                    as: "uom_name"
                }
            ],
            raw: true,
            nest: true
        });
        const formattedData = getAllData.map(item => ({
            ...item,
            uom_name: item.uom_name ? item.uom_name.uom_name : null,
        }));

        if (formattedData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: formattedData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

