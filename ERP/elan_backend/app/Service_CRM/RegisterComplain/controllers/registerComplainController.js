const { where } = require("sequelize");
const db = require("../../../models/index");
const { Op } = require("sequelize");
const moment = require("moment");
const { mode } = require("mathjs");
const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
// const model = require("../../../Currency_Convert/Model/model");
const loggerInfo = require('../../../../logger');

module.exports.checkSystemSerialNo = async (req, res) => {
    try {
        const serial_no = req.params.serial_no;

        const data = await db.CRMS_register_complain.findOne({ system_serial_no: serial_no });

        if (data) {
            return res.status(200).send({ code: 200, message: "System Serial No already exist", data: created });
        } else {
            return res.status(403).send({ code: 403, message: "" });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};
module.exports.createRegisterComplain = async (req, res) => {
    try {
        const { system_serial_no, customer_mobile_no, customer_name, issue, issue_details, address, syatem_type, syatem_rating, alt_mobile_no, document,collection,collection_status,complaint_type,entity_id
         } = req.body;
        const random = generateRandomDigits(7);
        const complain = 'COMP';
        const complain_ID = complain + random;
        const created = await db.CRMS_register_complain.create({ system_serial_no, customer_mobile_no, customer_name, issue, issue_details, address, system_type:syatem_type, system_rating:syatem_rating, alt_mobile_no, document, complain_ID: complain_ID, complain_status: "Open" ,collection,collection_status,complaint_type,entity_id});

        if (created) {
            await db.CRMS_complain_log.create({ register_complain_id: created.id, complain_status: "Open" });
            return res.status(200).send({ code: 200, message: "Complain Created Successfully", data: created });
        } else {
            return res.status(403).send({ code: 403, message: "Complain not Created" });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

module.exports.assignServiceCenter = async (req, res) => {
    try {
        const { register_complain_id, service_center_id } = req.body;

        const Updated = await db.CRMS_register_complain.update({ register_complain_id, service_center_id, complain_status: "Assigned" }, { where: { id: register_complain_id } });

        if (Updated) {
            await db.CRMS_complain_log.create({ register_complain_id: register_complain_id, complain_status: "Assigned" });
            return res.status(200).send({ code: 200, message: "Complain assigned successfully", data: Updated });
        } else {
            return res.status(403).send({ code: 403, message: "Complain not assigned" });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


module.exports.updateComplainDetail = async (req, res) => {
    try {
        const register_complain_id = req.params.register_complain_id;
        const { system_serial_no, customer_mobile_no, complain_status, customer_name, issue, issue_details, address, system_type, system_rating, alt_mobile_no, document, bill_uploaded, system_display_audio, priority, complaint_type, brand, system_installation_date, service_charge_cpplicable, in_warranty, blacklist_hold, state_id, city_id,collection,collection_status } = req.body;

        const Updated = await db.CRMS_register_complain.update({ customer_mobile_no, complain_status, customer_name, issue, issue_details, address, system_type, system_rating, alt_mobile_no, document, bill_uploaded, system_display_audio, priority, complaint_type, brand, system_installation_date, service_charge_cpplicable, in_warranty, blacklist_hold, state_id, city_id,collection,collection_status }, { where: { id: register_complain_id } });

        if (Updated) {
            await db.CRMS_complain_log.create({ register_complain_id: register_complain_id, complain_status });
            return res.status(200).send({ code: 200, message: "Details updated successfully", data: Updated });
        } else {
            return res.status(403).send({ code: 403, message: "Details not updated" });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

module.exports.registerComplainList = async (req, res) => {
    try {
        const allData = await db.CRMS_register_complain.findAll({
            where: { isDeleted: false ,entity_id : req.query.entity_id}
        });
        if (allData.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Data Successfully", data: allData });
        } else {
            return res.status(200).send({ code: 200, message: "No Data Found ", data: allData });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "server Error" });
    }
};

module.exports.getComplaintById = async (req, res) => {
    try {
        const  id  = req.params.register_complain_id;
        if (!id) {
            return res.status(400).send({ code: 400, message: "ID is required" });
        }

        const complaintData = await db.CRMS_complain_log.findAll({
            where: { register_complain_id: id, isDeleted: false },
            include: [
                {
                    model: db.CRMS_register_complain,
                    where: { isDeleted: false },
                    attributes: ['system_serial_no', 'customer_name', 'complain_ID']
                }
            ],
            attributes: ['register_complain_id','complain_status', 'createdAt', 'id']
        });

        if (complaintData.length > 0) {
            loggerInfo.logger.log('info','fetch the complaint as per id');
            return res.status(200).send({
                code: 200,
                message: "Get Data Successfully",
                data: complaintData
            });
        } else {
            return res.status(200).send({
                code: 200,
                message: "No Data Found",
                data: []
            });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

module.exports.assignedComplainList = async (req, res) => {
    try {
        const allData = await db.CRMS_register_complain.findAll({
            where: { isDeleted: false, complain_status: "Assigned",entity_id : req.query.entity_id}
        });
        if (allData.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Data Successfully", data: allData });
        } else {
            return res.status(200).send({ code: 200, message: "No Data Found ", data: allData });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "server Error" });
    }
};

module.exports.openComplainList = async (req, res) => {
    try {
        const allData = await db.CRMS_register_complain.findAll({
            where: { isDeleted: false, complain_status: "Open" ,entity_id : req.query.entity_id}
        });
        if (allData.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Data Successfully", data: allData });
        } else {
            return res.status(200).send({ code: 200, message: "No Data Found ", data: allData });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "server Error" });
    }
};


module.exports.resloveComplainList = async (req, res) => {
    try {
        const allData = await db.CRMS_register_complain.findAll({
            where: { isDeleted: false, complain_status: "Resolved" ,entity_id : req.query.entity_id}
        });
        if (allData.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Data Successfully", data: allData });
        } else {
            return res.status(200).send({ code: 200, message: "No Data Found ", data: allData });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "server Error" });
    }
};

module.exports.rejectedComplainList = async (req, res) => {
    try {
        const allData = await db.CRMS_register_complain.findAll({
            where: { isDeleted: false, complain_status: "Rejected" ,entity_id : req.query.entity_id}
        });
        if (allData.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Data Successfully", data: allData });
        } else {
            return res.status(200).send({ code: 200, message: "No Data Found ", data: allData });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "server Error" });
    }
};

module.exports.complainStatus = async (req, res) => {
    try {
        const totalComplaints = await db.CRMS_register_complain.count({
            where: { isDeleted: false, status: "ACTIVE" },
        });

        const assignedComplaints = await db.CRMS_register_complain.count({
            where: { isDeleted: false, status: "ACTIVE", complain_status: "Assigned" },
        });

        const openComplaints = await db.CRMS_register_complain.count({
            where: { isDeleted: false, status: "ACTIVE", complain_status: "Open" },
        });

        const collectionStatusTrue = await db.CRMS_register_complain.count({
            where: { isDeleted: false, status: "ACTIVE", collection_status: "True" },
        });

        const collectionStatusFalse = await db.CRMS_register_complain.count({
            where: { isDeleted: false, status: "ACTIVE", collection_status: "False" },
        });

        const inWarrantyYes = await db.CRMS_register_complain.count({
            where: { isDeleted: false, status: "ACTIVE", in_warranty: "Yes" },
        });

        const inWarrantyNo = await db.CRMS_register_complain.count({
            where: { isDeleted: false, status: "ACTIVE", in_warranty: "No" },
        });

        const totalCollection = await db.CRMS_register_complain.sum("collection", {
            where: { isDeleted: false, status: "ACTIVE" },
        });

        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'days').startOf('day');

        const todayCollection = await db.CRMS_register_complain.sum("collection", {
            where: {
                isDeleted: false,
                status: "ACTIVE",
                collection_date: {
                    [Op.gte]: today.toDate(),
                },
            },
        });

        const notTodayCollection = await db.CRMS_register_complain.sum("collection", {
            where: {
                isDeleted: false,
                status: "ACTIVE",
                collection_date: {
                    [Op.lt]: today.toDate(),
                },
            },
        });

        const amcCollection = await db.CRMS_register_complain.sum("collection", {
            where: {
                isDeleted: false,
                status: "ACTIVE",
                complaint_type: "AMC",
            },
        });

        const nonAmcCollection = await db.CRMS_register_complain.sum("collection", {
            where: {
                isDeleted: false,
                status: "ACTIVE",
                complaint_type: "NON-AMC",
            },
        });

        const nonAmcCollectionToday = await db.CRMS_register_complain.sum("collection", {
            where: {
                isDeleted: false,
                status: "ACTIVE",
                complaint_type: "NON-AMC",
                collection_date: {
                    [Op.gte]: today.toDate(),
                },
            },
        });

        const nonAmcCollectionYesterday = await db.CRMS_register_complain.sum("collection", {
            where: {
                isDeleted: false,
                status: "ACTIVE",
                complaint_type: "NON-AMC",
                collection_date: {
                    [Op.gte]: yesterday.toDate(),
                    [Op.lt]: today.toDate(),
                },
            },
        });

        const amcCollectionToday = await db.CRMS_register_complain.sum("collection", {
            where: {
                isDeleted: false,
                status: "ACTIVE",
                complaint_type: "AMC",
                collection_date: {
                    [Op.gte]: today.toDate(),
                },
            },
        });

        const amcCollectionYesterday = await db.CRMS_register_complain.sum("collection", {
            where: {
                isDeleted: false,
                status: "ACTIVE",
                complaint_type: "AMC",
                collection_date: {
                    [Op.gte]: yesterday.toDate(),
                    [Op.lt]: today.toDate(),
                },
            },
        });

        const dataCards = [
            {
                title: 'Complaints',
                color: '#2b5c92',
                icon: 'home',
                rows: [
                    { label: 'TOTAL', value: totalComplaints.toString() },
                    { label: 'ASSG', value: assignedComplaints.toString() },
                    { label: 'OPEN', value: openComplaints.toString() },
                ]
            },
            {
                title: 'Collection Status',
                color: '#2b5c92',
                icon: 'report_problem',
                rows: [
                    { label: 'TRUE', value: collectionStatusTrue.toString() },
                    { label: 'FALSE', value: collectionStatusFalse.toString() }
                ]
            },
            {
                title: 'Warranty Status',
                color: '#c0392b',
                icon: 'error',
                rows: [
                    { label: 'YES', value: inWarrantyYes.toString() },
                    { label: 'NO', value: inWarrantyNo.toString() }
                ]
            },
            {
                title: 'NON-AMC Collection',
                color: '#2b5c92',
                icon: 'credit_card',
                rows: [
                    { label: 'TOTAL COLLECTION', value: nonAmcCollection ? nonAmcCollection.toString() : '0' },
                    { label: 'TODAY', value: nonAmcCollectionToday ? nonAmcCollectionToday.toString() : '0' },
                    { label: 'YESTERDAY', value: nonAmcCollectionYesterday ? nonAmcCollectionYesterday.toString() : '0' },
                ]
            },
            
            {
                title: 'AMC Collection',
                color: '#3498db',
                icon: 'category',
                rows: [
                    { label: 'TOTAL COLLECTION', value: amcCollection ? amcCollection.toString() : '0' },
                    { label: 'TODAY', value: amcCollectionToday ? amcCollectionToday.toString() : '0' },
                    { label: 'YESTERDAY', value: amcCollectionYesterday ? amcCollectionYesterday.toString() : '0' },
                ]
            }
        ];

        if (totalComplaints > 0) {
            return res.status(201).send({
                code: 200,
                message: "Complain Status retrieved successfully",
                dataCards: dataCards
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "Data not found",
                dataCards: dataCards
            });
        }

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};



module.exports.complainListByServiceCenter = async (req, res) => {
    try {
        const service_center_id = req.params.service_center_id;
        const allData = await db.CRMS_register_complain.findAll({
            where: { isDeleted: false, service_center_id }
        });
        if (allData.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Data Successfully", data: allData });
        } else {
            return res.status(200).send({ code: 200, message: "No Data Found ", data: allData });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "server Error" });
    }
};

module.exports.getRegisterComplainById = async (req, res) => {
    try {
        const register_complain_id = req.params.register_complain_id;
        const allData = await db.CRMS_register_complain.findOne({
            where: { isDeleted: false, id: register_complain_id }
        });
        if (allData) {
            return res.status(200).send({ code: 200, message: "Get Data Successfully", data: allData });
        } else {
            return res.status(200).send({ code: 200, message: "No Data Found ", data: allData });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "server Error" });
    }
};

module.exports.createMaterialRequest = async (req, res) => {
    try {
        const { materialRequests, remark, register_complain_id
        } = req.body;
        let material_request_id;
        let response = [];
        let data;
        const random = generateRandomDigits(7);
        const request = 'REQ';
        const request_ID = request + random;
        const materialRequest = await db.CRMS_material_request.findOne({
            where: { register_complain_id, isDeleted: false },
        });
        if (materialRequest) {
            data = await db.CRMS_material_request.update(
                { remark },
                { where: { register_complain_id, isDeleted: false } }
            );
            if (data) {
                await db.CRMS_material_request_detail.update(
                    { isDeleted: true, status: 'INACTIVE' },
                    { where: { material_request_id: materialRequest.id, isDeleted: false } }
                );
            }
            material_request_id = materialRequest.id;
        } else {
            data = await db.CRMS_material_request.create({
                register_complain_id, remark, request_ID
            });
            material_request_id = data.id
        }
        await db.CRMS_register_complain.update(
            { complain_status: "Requested" },
            { where: { id: register_complain_id, isDeleted: false } }
        );
        if (data) {
            for (let i = 0; i < materialRequests.length; i++) {
                response = await db.CRMS_material_request_detail.create({
                    material_request_id: material_request_id,
                    item_category_id: materialRequests[i].asset_id,
                    item_master_id: materialRequests[i].item_id,
                    quantity: materialRequests[i].quantity,
                });
            }
            return res.status(201).send({ code: 200, message: "Request Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Request not Created" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };

};

module.exports.getMaterialRequestbyComplainId = async (req, res) => {
    try {
        const register_complain_id = req.params.register_complain_id;
        const allData = await db.CRMS_material_request.findOne({
            where: { isDeleted: false, register_complain_id },
            include: [
                {
                    model: db.CRMS_material_request_detail,
                    where: { isDeleted: false },
                    include: [
                        {
                            model: db.ItemMaster,
                            attributes: ['id', 'item_name', 'item_code', 'B2C_price']
                        },
                        {
                            model: db.asset,
                            attributes: ['id', 'asset_category_name']
                        }
                    ],
                },
            ]
        });

        const [availableInven] = await db.sequelize.query(
            `SELECT mr.id, rd.id, sim.Item_id, sim.Total_inventory FROM 
                CRMS_MATERIAL_REQUEST AS mr 
                INNER JOIN CRMS_MATERIAL_REQUEST_DETAILS AS rd 
                ON mr.id = rd.material_request_id
                LEFT JOIN (
                    SELECT Item_id, Total_inventory 
                    FROM SYS_INVENTORY_MASTER
                    WHERE (Item_id, createdAt) IN (
                        SELECT Item_id, MAX(createdAt) AS createdAt
                        FROM SYS_INVENTORY_MASTER
                        GROUP BY Item_id
                    )
                ) AS sim ON sim.Item_id = rd.item_master_id 
            WHERE mr.register_complain_id=${register_complain_id}`);


        if (!availableInven || !allData) {
            return res.status(200).send({ code: 200, message: "No Data Found", data: allData });
        }

        allData.CRMS_MATERIAL_REQUEST_DETAILs.forEach(detail => {
            const inventory = availableInven.find(inven => inven.Item_id === detail.ItemMaster.id);
            if (inventory) {
                const name = detail.ItemMaster.dataValues;
                name.Total_inventory = inventory.Total_inventory;
            } else {
                detail.ItemMaster.Total_inventory = 0;
            }
        });

        return res.status(200).send({ code: 200, message: "Get Data Successfully", data: allData });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "server Error" });
    }
};

module.exports.allMaterialRequestList = async (req, res) => {
    try {
        const allData = await db.CRMS_material_request.findAll({
            attributes: ['id', 'request_ID'],
            where: { isDeleted: false },
            include: [{
                model: db.CRMS_register_complain,
                attributes: [['id', 'register_complain_id'], 'system_serial_no', 'complain_ID', 'complain_status'],
                where: { isDeleted: false },
                include: [
                    {
                        model: db.Service_Center,
                        attributes: ['sc_name'],
                        where: { isDeleted: false },
                    }
                ]
            }
            ]
        });
        if (allData.length > 0) {
            return res.status(201).send({ code: 200, message: "Requests get successfully", data: allData });
        } else {
            return res.status(404).send({ code: 404, message: "Request not Created", data: allData });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };

};

module.exports.complainStatusList = async (req, res) => {
    try {
        const allData = await db.CRMS_complain_status.findAll({
            where: { isDeleted: false, status: "ACTIVE" },
        });
        if (allData.length > 0) {
            return res.status(201).send({ code: 200, message: "Complain Status get successfully", data: allData });
        } else {
            return res.status(404).send({ code: 404, message: "Data not found", data: allData });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    };

};

module.exports.materialRequestAllocate = async (req, res) => {
    try {
        const { allocate_quantity,lifo_fifo,awb_mup,material_request_detail_id } = req.body;
        const random = generateRandomDigits(7);
        const alloc = 'ALLOC';
        const allocation_ID = alloc + random;
        const created = await db.CRMS_material_request_allocate.create({ material_request_detail_id,allocate_quantity, lifo_fifo,awb_mup,allocation_ID: allocation_ID});

        if (created) {
            // await db.CRMS_complain_log.create({ register_complain_id: created.id, complain_status: "Open" });
            return res.status(200).send({ code: 200, message: "Allocated Successfully", data: created });
        } else {
            return res.status(403).send({ code: 403, message: "Something went wrong" });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

module.exports.todayLogDashboard = async (req, res) => {
    try {
        const statusData = await db.CRMS_register_complain.findAll({
            attributes: [
                'complain_status',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('complain_status')), 'value']
            ],
            group: ['complain_status'], 
            raw: true 
        });
        const resolvedData = await db.CRMS_register_complain.findAll({
            where:[{complain_status:"Resolved"}],
            attributes: [
                'complain_status', 
                [db.Sequelize.fn('COUNT', db.Sequelize.col('complain_status')), 'count'],
                [db.Sequelize.fn('SUM', db.Sequelize.literal("CASE WHEN complain_status = 'Resolved' AND in_warranty = 'Yes' THEN 1 ELSE 0 END")), 'resolved_in_warranty_yes'],
                [db.Sequelize.fn('SUM', db.Sequelize.literal("CASE WHEN complain_status = 'Resolved' AND in_warranty = 'No' THEN 1 ELSE 0 END")), 'resolved_in_warranty_no']
            ],
            group: ['complain_status'],
            raw: true 
        });
        const todaysLog = [
            { title: 'Open', value: 0 },
            { title: 'Assigned', value: 0 },
            { title: 'Resolved', value: 0 },
            { title: 'CLOSED(I/W)', value: 0 },
            { title: 'CLOSED(O/W)', value: 0 },
            { title: 'COLLECTION', value: '0.00 L' },
            { title: 'FALSE', value: 7 },
          ];
          statusData.forEach(status => {
            const log = todaysLog.find(item => item.title.toLowerCase() === status.complain_status.toLowerCase());
            if (log) {
                log.value = status.value;
            }
        });

        // Update values for 'CLOSED(I/W)' and 'CLOSED(O/W)' based on resolvedData
        const resolved = resolvedData.find(item => item.complain_status === 'Resolved');
        if (resolved) {
            const closedInWarranty = resolved['resolved_in_warranty_yes'];
            const closedOutWarranty = resolved['resolved_in_warranty_no'];
            // console.log(resolved);
            // return
            const closedLog = todaysLog.find(item => item.title === 'CLOSED');
            const closedInWarrantyLog = todaysLog.find(item => item.title === 'CLOSED(I/W)');
            const closedOutWarrantyLog = todaysLog.find(item => item.title === 'CLOSED(O/W)');

            
            if (closedInWarrantyLog) {
                closedInWarrantyLog.value = closedInWarranty; 
            }
            if (closedOutWarrantyLog) {
                closedOutWarrantyLog.value = closedOutWarranty; 
            }
        }
        if (todaysLog) {
            return res.status(200).send({
                code: 200,
                message: "Data fetched successfully",
                data: todaysLog
            });
        } else {
            return res.status(403).send({
                code: 403,
                message: "Something went wrong",
                data: statusCounts
            });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
}

module.exports.dashboardData = async (req, res) => {
    try {
        const data = await db.CRMS_register_complain.findAll({
            where:[{status:"ACTIVE"}]
        });
        if (data) {
            return res.status(200).send({
                code: 200,
                message: "Data fetched successfully",
                data: todaysLog
            });
        } else {
            return res.status(403).send({
                code: 403,
                message: "Something went wrong",
                data: statusCounts
            });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
}


function generateRandomDigits(length) {
    let result = '';
    const digits = '0123456789';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        result += digits[randomIndex];
    }
    return result;
}
