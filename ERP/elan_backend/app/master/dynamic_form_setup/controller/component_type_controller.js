const db = require("../../../models/index");

exports.create_dynamic_component_type = async (req, res) => {
    try {
        const { component_type } = req.body;

        if (!component_type) {
            return res.status(400).send({ code: 400, message: "Component Type is Required" })
        }

        let existFrom_type = await db.models.dynamicComponentType.findOne({ where: { component_type: component_type, isDeleted: false } })
        if (existFrom_type) {
            return res.status(400).send({ code: 400, message: "Component Type already Exist" })
        }

        let createComponent_type = await db.models.dynamicComponentType.create({
            component_type: component_type
        })

        return res.status(201).send({ code: 201, message: "Successfully Created." })

    } catch (error) {

        return res.status(500).send({ code: 500, message: error.message || "Server Error" })
    }
}

exports.get_component_type_by_id = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ code: 400, message: "Id is Required" });
        }

        let getComponentType = await db.models.dynamicComponentType.findOne({ where: { id: id, isDeleted: false } });

        if (!getComponentType) {
            return res.status(404).send({ code: 404, message: "Data Not Found", data: getComponentType });
        }

        return res.status(200).send({ code: 200, message: "Successfully Fetched.", data: getComponentType });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_all_component_type = async (req, res) => {
    try {
        let getComponentType = await db.models.dynamicComponentType.findAll({ where: { isDeleted: false } });
        if (getComponentType.length === 0) {
            return res.status(404).send({ code: 404, message: "Data Not Found", data: getComponentType });
        }
        return res.status(200).send({ code: 200, message: "Successfully Fetched.", data: getComponentType });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.get_all_component_type_active = async (req, res) => {
    try {
        let getComponentType = await db.models.dynamicComponentType.findAll({ where: { isDeleted: false , status:"ACTIVE" } });
        if (getComponentType.length === 0) {
            return res.status(404).send({ code: 404, message: "Data Not Found", data: getComponentType });
        }
        return res.status(200).send({ code: 200, message: "Successfully Fetched.", data: getComponentType });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}



exports.edit_component_type = async (req, res) => {
    try {

        const { id } = req.params;
        const { component_type } = req.body;

        let getComponentType = await db.models.dynamicComponentType.findOne({ where: { id: id, isDeleted: false } });

        if (!getComponentType) {
            return res.status(404).send({ code: 404, message: "Data Not Found" });
        }

        let saveUpdate = await db.models.dynamicComponentType.update(
            { component_type: component_type },
            { where: { id: id } })

        return res.status(200).send({ code: 200, message: "Successfully Updated." });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}


exports.delete_component_type = async (req, res) => {
    try {
        const { id } = req.params;

        let getComponentType = await db.models.dynamicComponentType.findOne({ where: { id: id, isDeleted: false } });

        if (!getComponentType) {
            return res.status(404).send({ code: 404, message: "Data Not Found" });
        }

        let saveUpdate = await db.models.dynamicComponentType.update(
            { isDeleted: true },
            { where: { id: id } })

        return res.status(200).send({ code: 200, message: "Successfully deleted." });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}


exports.status_component_type = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        let saveUpdate = await db.models.dynamicComponentType.update(
            { status: status },
            { where: { id: id } })

        return res.status(200).send({ code: 200, message: "Status updated sccessfully" });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}