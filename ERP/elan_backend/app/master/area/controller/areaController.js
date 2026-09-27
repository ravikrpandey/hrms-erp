const db = require("../../../models/index");

const logger = require('../../../../logger/index');

exports.createArea = async (req, res) => {
    try {
        const { area_name, department_id, entity_id } = req.body;
        const existDept = await db.department.findOne({ where: { dept_id: department_id, isDeleted: false } })
        if (existDept) {
            const existArea = await db.area.findOne({ where: { area_name: area_name, department_id: department_id, entity_id: entity_id, isDeleted: false, status: 'ACTIVE' } });
            if (existArea) {
                return res.status(201).send({ code: 201, message: "Area Name is Already Exists!" });
            }
            const response = await db.area.create({
                area_name, department_id, entity_id
            });
            return res.status(200).send({ code: 200, message: "Area Created Successfully" })
        } else {
            return res.status(404).send({ code: 404, message: "Area Not Found", })
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

exports.getAllArea = async (req, res) => {
    try {
        const query = `
        SELECT A.id, D.department_name, D.department_code,A.area_name,A.status
        FROM MASTER_AREA A
        INNER JOIN MASTER_DEPARTMENT D ON A.department_id = D.dept_id
        WHERE A.isDeleted = false
        ORDER BY A.id DESC  
        `;

        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (getAllData.length === 0) {
            return res.status(404).send({ code: 404, message: "No areas found" });
        }
        return res.status(200).send({ code: 200, message: "Get All Areas Successfully", data: getAllData });
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error fetching area data: ", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getByIdArea = async (req, res) => {
    try {
        const areaId = req.params.id
        const query = `
        SELECT A.id, D.department_name,A.department_id, D.department_code,A.area_name,A.status
        FROM MASTER_AREA A
        INNER JOIN MASTER_DEPARTMENT D ON A.department_id = D.dept_id
        WHERE A.isDeleted = false AND A.id =  ${areaId}`;

        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch Area Data Successfully", data: getAllData[0] });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.updateAreaById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(404).send({ code: 404, message: "ID not found" });
        }
        const { area_name, department_id, entity_id } = req.body;
        if (!area_name || !department_id || !entity_id) {
            return res.status(400).send({ code: 400, message: "Missing required fields" });
        }
        const editData = await db.area.findOne({ where: { id: id } });
        if (!editData) {
            return res.status(400).send({ code: 400, message: "Record Not Found" });
        }
        const existingArea = await db.area.findOne({
            where: {
                area_name: area_name,
                // id: { [db.Sequelize.Op.ne]: id },
                department_id: department_id,
                entity_id: entity_id,
                isDeleted: false
            }
        });
        if (existingArea) {
            return res.status(201).send({ code: 201, message: "Area Name is Already Exists!" });
        }
        const [updated] = await db.area.update(
            { area_name: area_name, department_id: department_id, entity_id: entity_id },
            { where: { id: id } }
        );
        if (updated) {
            return res.status(200).send({ code: 200, message: "Status Updated Successfully" });
        } else {
            return res.status(400).send({ code: 400, message: "Update Failed" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error('Server Error:', error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


exports.deleteArea = async (req, res) => {
    try {
        const area_id = req.params.id
        const dltStage = await db.area.findOne({ where: { id: area_id } });
        if (dltStage) {
            const deleteData = await db.area.update({ isDeleted: true }, { where: { id: area_id } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.AreaStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await db.area.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await db.area.update(
                { status },
                { where: { id: id } }
            );
            return res.status(200).send({
                code: 200,
                message: "Area Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

