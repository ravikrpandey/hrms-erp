const db = require('../../../models/index');
const deliveryOrder = db.delivery_order;
const deliveryOrderApprovalLevel = db.deliveryOrderApprovalLevel;
const userDetails = db.user;
const { Op, where } = require("sequelize");


module.exports.createDeliveryOrder = async (req, res) => {
    try {
        const {
            delivery_doc_code, customer_name, entity_id, sales_rep_id, ref_invoice_no, sales_id_invoice,
            department_id, create_date, source_warehouse_id, shipping_address, city,
            state, pincode, country, receiving_person_name, receiving_person_contact, transport, vehicle_number, driver, driver_contact_number,
            remarks, upload_photo,items,quotation_id
        } = req.body;
       
        const [query] = await db.sequelize.query(`
                SELECT WFM.job_name, WR.employee_id, WR.role_id, WR.level, WR.id
                FROM ESS_WORK_FLOW_MASTER AS WFM
                LEFT JOIN ESS_WORKFLOW_RANGE AS WR ON WR.workflow_id = WFM.id
                WHERE WFM.status = 'ACTIVE' AND WFM.isDeleted = 0 AND WFM.department_id = ${department_id} AND
                WR.status = 'ACTIVE' AND WR.isDeleted = 0 AND WFM.job_name = 'Delivery Order'
            `);

        if (query.length > 0) {
            let createDeliveryOrder = await db.delivery_order.create({
                delivery_doc_code, customer_name, entity_id, sales_rep_id, ref_invoice_no, sales_id_invoice,
                department_id, create_date, source_warehouse_id, shipping_address, city,
                state, pincode, country, receiving_person_name, receiving_person_contact, transport, vehicle_number, driver, driver_contact_number,
                remarks, upload_photo
            });

            if (createDeliveryOrder) {
                const deliveryOrderId = createDeliveryOrder.id;

                const approvalLevels = query.map(item => ({
                    level: item.level,
                    employee_id: item.employee_id,
                    delivery_order_id: deliveryOrderId,
                    workflow_range_id: item.id
                }));

                await db.deliveryOrderApprovalLevel.bulkCreate(approvalLevels);
                await db.salesInvoice.update({ delivery_created: true }, { where: { id: sales_id_invoice, is_deleted: false } });

                await items?.forEach(async element => {
                    const currentItem = await db.quotation_Items.findOne({
                        attributes: ['deliveryQty'],
                        where: { quotation_id: quotation_id, item_id: element.item_id }
                    });
                    if (currentItem) {
                        const updatedDeliveryQty = parseInt(currentItem.deliveryQty) + parseInt(element.deliveryQty);
                        await db.quotation_Items.update({
                            deliveryQty: updatedDeliveryQty
                        }, {
                            where: { quotation_id: quotation_id, item_id: element.item_id }
                        });
                    }
                });
                

                return res.status(200).send({ code: 200, message: 'Delivery Order Created Successfully' });
            } else {
                return res.status(200).send({ code: 400, message: 'Error creating delivery order' });
            }
        } else {
            return res.status(501).send({ code: 501, message: 'Delivery order workflow is not created for your department.' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getApprovedDeliveryByMainId = async (req, res) => {
    try {
        const delivryOrders = await db.delivery_order.findAll({
            where: { sales_rep_id: req.params.id, is_deleted: false, status: "APPROVED", entity_id: req.params.entity_id },
            include: [
                {
                    model: db.warehouse,
                    as: 'warehouse',
                    attributes: ['id', 'name'],
                },
            ]
        });

        if (delivryOrders && delivryOrders.length > 0) {
            const formattedDelivery = delivryOrders.map(delivery => ({
                ...delivery.dataValues,
                temp_source_warehouse: delivery.warehouse ? delivery.warehouse.name : null,

            }));
            return res.status(200).send({ code: 200, message: 'Success', data: formattedDelivery });
        } else {
            return res.status(200).send({ code: 404, message: 'No Delivery Order Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getRejectededDeliveryByMainId = async (req, res) => {
    try {
        const delivryOrders = await db.delivery_order.findAll({
            where: { sales_rep_id: req.params.id, is_deleted: false, status: "REJECTED", entity_id: req.params.entity_id },
            include: [
                {
                    model: db.warehouse,
                    as: 'warehouse',
                    attributes: ['id', 'name'],
                },
            ]
        });

        if (delivryOrders && delivryOrders.length > 0) {
            const formattedDelivery = delivryOrders.map(delivery => ({
                ...delivery.dataValues,
                temp_source_warehouse: delivery.warehouse ? delivery.warehouse.name : null,

            }));


            return res.status(200).send({ code: 200, message: 'Success', data: formattedDelivery });
        } else {
            return res.status(200).send({ code: 404, message: 'No Delivery Order Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getPendingDeliveryByDepId = async (req, res) => {
    try {
        const delivryOrders = await db.delivery_order.findAll({
            where: { department_id: req.params.id, is_deleted: false, status: "PENDING", entity_id: req.params.entity_id },
            include: [
                {
                    model: db.warehouse,
                    as: 'warehouse',
                    attributes: ['id', 'name'],
                },
            ]
        });

        if (delivryOrders && delivryOrders.length > 0) {
            const formattedDelivery = delivryOrders.map(delivery => ({
                ...delivery.dataValues,
                temp_source_warehouse: delivery.warehouse ? delivery.warehouse.name : null,

            }));


            return res.status(200).send({ code: 200, message: 'Success', data: formattedDelivery });
        } else {
            return res.status(200).send({ code: 404, message: 'No Delivery Order Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


module.exports.getDeliveryById = async (req, res) => {
    try {
        const delivery = await db.delivery_order.findOne({ where: { id: req.params.id, is_deleted: false, entity_id: req.params.entity_id } });

        if (delivery) {
            return res.status(200).send({ code: 200, massege: 'Success', data: delivery });

        } else {
            return res.status(200).send({ code: 404, message: 'No Delivery Order Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}


exports.approvedDeliveryOrderById = async (req, res) => {
    try {

        const delivery_order_id = req.params?.delivery_order_id;
        const {

            remarks, emp_id, approval_status, progress_status
        } = req.body;
        let updateData;


        if (approval_status == 'REJECTED') {


            await deliveryOrder.update({ status: 'REJECTED' }, { where: { id: delivery_order_id } });

            updateData = await deliveryOrderApprovalLevel.update(
                {
                    approval_status: approval_status,
                    progress_status: progress_status,
                    remarks: remarks
                },
                {
                    where: {
                        employee_id: emp_id,
                        delivery_order_id: delivery_order_id
                    },
                }
            );

        } else {
            updateData = await deliveryOrderApprovalLevel.update(
                {
                    approval_status: approval_status,
                    progress_status: progress_status,
                    remarks: remarks
                },
                {
                    where: {
                        employee_id: emp_id,
                        delivery_order_id: delivery_order_id
                    },
                }
            );
        }

        if (approval_status == 'APPROVED') {
            const allLevelsData = await deliveryOrderApprovalLevel.findAll({
                where: {
                    employee_id: emp_id,
                    delivery_order_id: delivery_order_id
                },
                order: [["level", "ASC"]],
            });

            let maxLevel;
            if (allLevelsData !== null) {
                maxLevel = await deliveryOrderApprovalLevel.max('level', {
                    where: { delivery_order_id: delivery_order_id }
                });
            }

            const currentLevel = await deliveryOrderApprovalLevel.findOne({
                attributes: ["level"],
                where: {
                    employee_id: emp_id,
                    delivery_order_id: delivery_order_id
                },
            });

            const maxLevelValue = maxLevel;

            const currentLevelValue = currentLevel.level;

            if (maxLevelValue !== null && currentLevelValue !== null && currentLevelValue === maxLevelValue) {
                const currentApprovelStatus = await deliveryOrder.findOne({
                    where: { id: delivery_order_id },
                });

                if (currentApprovelStatus !== null) {
                    const finalApproved = await deliveryOrder.update(
                        { status: "APPROVED" },
                        { where: { id: delivery_order_id } }
                    );

                    return res.status(200).send({
                        code: 200,
                        message: "Delivery Order Approved Successfully. This One must be the last level.",
                        data: finalApproved,
                    });
                }
            }
        }

        if (updateData !== 0) {
            return res.status(200).send({
                code: 200,
                message: "Delivery Order Approval Successfully",
                data: updateData,
            });
        }

        else {
            return res.status(200).send({ code: 200, message: "Unable to Update", data: updateData });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Server Error" });
    }
}


exports.getAllDeliveryOrderApprovalLevel = async (req, res) => {
    try {

        const delivery_order_id = req.params?.delivery_order_id;

        const getData = await deliveryOrderApprovalLevel.findAll({
            where: {
                [Op.and]: [
                    { delivery_order_id: delivery_order_id },
                ],
            },
            attributes: ["approval_status", "level", "employee_id", "remarks"],
        });

        if (!getData || getData.length === 0) {
            return res.status(200).send({ code: 400, message: "Data not found" });
        }

        const levelsWithNames = [];
        for (const levelInfo of getData) {
            const employeeInfo = await userDetails.findOne({
                where: {
                    employee_id: levelInfo.employee_id,
                },
                attributes: ["first_name", "last_name"],
            });

            if (!employeeInfo) {
                return res.status(400).send({
                    code: 400,
                    message: "User not found for level " + levelInfo.level,
                });
            }

            const fullName = `${employeeInfo.first_name} ${employeeInfo.last_name}`;
            const levelWithName = {
                level: levelInfo.level,
                name: fullName,
                status: levelInfo.approval_status,
                remarks: levelInfo.remarks

            };
            levelsWithNames.push(levelWithName);
        }

        return res.status(200).send({
            code: 200,
            message: "Data Fetched Successfully!",
            data: levelsWithNames,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Server Error" });
    }
}

module.exports.updateDelStatusByDepId = async (req, res) => {
    try {
        const checkDelivery = await db.delivery_order.findOne({ where: { department_id: req.params.id, delivery_doc_code: req.params.del_id, status: "PENDING", is_deleted: false } });
        if (checkDelivery) {
            const updateStatus = await db.delivery_order.update({ status: req.params.status }, { where: { delivery_doc_code: req.params.del_id, department_id: req.params.id } });
            if (updateStatus) {
                return res.status(200).send({ code: 200, message: 'Delivery Order Status Updated Successfully' });
            } else {
                return res.status(200).send({ code: 404, message: 'No Delivery Found with given ID' });
            }
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}

module.exports.deleteDeliveryById = async (req, res) => {
    try {
        const checkDelivery = await db.delivery_order.findOne({ where: { id: req.params.id, is_deleted: false } });
        if (checkDelivery) {
            const deleteDelivery = await db.delivery_order.update({ is_deleted: true }, { where: { id: req.params.id } });
            const deleteDeliveryItems = await db.delivery_order_items.update({ is_deleted: true }, { where: { delivery_id: checkDelivery.id } });
            if (deleteDelivery && deleteDeliveryItems) {
                return res.status(200).send({ code: 200, message: 'Delivery Order Deleted Successfully' });
            } else {
                return res.status(200).send({ code: 404, message: 'No Delivery Order Found with given ID' });
            }
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}

module.exports.getDeliveryByMainId = async (req, res) => {
    try {
        const loggedEmployeeId = req.params.id;
        const loggedUserRole = req.query.role;
        const { id } = req.params;
        const { status, entity_id } = req.query;

        if (status == "PENDING") {
            const query = `SELECT SDOM.*, SPM.delivery_date, SSUM.business_name, SIM.invoice_doc_code, 
                                  WH.id AS warehouse_id, WH.name AS warehouse_name
                           FROM SALES_DELIVERY_ORDER_MST AS SDOM
                           LEFT JOIN SALES_INVOICE_MST AS SIM ON SIM.id = SDOM.sales_id_invoice
                           LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
                           LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
                           LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
                           LEFT JOIN SALES_DELIVERY_ORDER_APPROVAL_LEVEL AS la 
                                  ON la.delivery_order_id = SDOM.id AND la.employee_id = ${loggedEmployeeId}
                           LEFT JOIN WAREHOUSE_MASTER AS WH ON WH.id = SDOM.source_warehouse_id
                           WHERE la.approval_status = 'PENDING' 
                           AND SDOM.id IN (
                               SELECT pa.delivery_order_id 
                               FROM SALES_DELIVERY_ORDER_APPROVAL_LEVEL AS pa 
                               WHERE pa.employee_id = ${loggedEmployeeId} 
                               AND (
                                   (pa.level = 1)
                                   OR 
                                   (
                                       pa.level > 1 
                                       AND 
                                       (
                                           SELECT COUNT(pl.id) 
                                           FROM SALES_DELIVERY_ORDER_APPROVAL_LEVEL AS pl 
                                           WHERE pl.delivery_order_id = pa.delivery_order_id 
                                           AND pl.level = (pa.level - 1)  
                                           AND pl.approval_status = 'APPROVED' 
                                           AND pl.progress_status = 'CLOSE'
                                       ) > 0
                                   )
                               )
                           ) 
                           AND SDOM.entity_id = ${entity_id}`;
            const data = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
            });
            return res.status(200).json({ code: 200, message: "Success", data: data });
        }


        if (status == "ALL") {
            const delivryOrders = await db.delivery_order.findAll({
                where: { sales_rep_id: id, is_deleted: false, entity_id: entity_id },
                include: [
                    {
                        model: db.warehouse,
                        as: 'warehouse',
                        attributes: ['id', 'name'],
                    },
                ]
            });

            if (delivryOrders && delivryOrders.length > 0) {
                const formattedDelivery = delivryOrders.map(delivery => ({
                    ...delivery.dataValues,
                    temp_source_warehouse: delivery.warehouse ? delivery.warehouse.name : null,
                }));


                return res.status(200).send({ code: 200, message: 'Success', data: formattedDelivery });
            } else {
                return res.status(200).send({ code: 404, message: 'No Delivery Order Found with given ID' });
            }
        }
        if (status == "APPROVED") {
            let getAllData;
            if (loggedUserRole === "Super Admin") {
                const query = `SELECT SDOM.*, SPM.delivery_date, WM.name AS warehouse_name, SSUM.business_name, SDOAL.approval_status, SPM.proforma_doc_code  FROM SALES_DELIVERY_ORDER_MST AS SDOM
               LEFT JOIN SALES_INVOICE_MST AS SIM ON SIM.id = SDOM.sales_id_invoice
                LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
                LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
                LEFT JOIN WAREHOUSE_MASTER AS WM ON WM.id = SDOM.source_warehouse_id
    LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
                INNER JOIN SALES_DELIVERY_ORDER_APPROVAL_LEVEL AS SDOAL ON SDOAL.delivery_order_id = SDOM.id WHERE SDOM.is_deleted = 0 and SDOAL.approval_status = 'APPROVED' AND SDOAL.progress_status='CLOSE'
                AND SDOM.entity_id = ${entity_id}
                ORDER BY SDOM.id DESC `;

                getAllData = await db.sequelize.query(query, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
            } else {
                const query = `SELECT SDOM.*, SPM.delivery_date,  WM.name AS warehouse_name, SSUM.business_name, SDOAL.approval_status, SPM.proforma_doc_code FROM SALES_DELIVERY_ORDER_MST AS SDOM
                LEFT JOIN SALES_INVOICE_MST AS SIM ON SIM.id = SDOM.sales_id_invoice  
                LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
                  LEFT JOIN WAREHOUSE_MASTER AS WM ON WM.id = SDOM.source_warehouse_id
                  LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
    LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
                 INNER JOIN SALES_DELIVERY_ORDER_APPROVAL_LEVEL AS SDOAL ON SDOAL.delivery_order_id = SDOM.id
                WHERE SDOAL.employee_id = ${loggedEmployeeId} AND SDOAL.approval_status = 'APPROVED' AND SDOAL.progress_status='CLOSE'
                   AND SDOM.entity_id = ${entity_id}
                ORDER BY SDOM.id DESC `;

                getAllData = await db.sequelize.query(query, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
            }

            if (getAllData.length > 0) {
                return res.status(200).send({
                    code: 200,
                    message: "Fetch All Data Successfully",
                    data: getAllData,
                });
            } else {
                return res.status(200).send({ code: 200, message: "No Records Found", data: getAllData });
            }
        }
        if (status == "REJECTED") {
            let getAllData;
            if (loggedUserRole === "Super Admin") {
                const query = `SELECT SDOM.*, SPM.delivery_date, WM.name AS warehouse_name, SSUM.business_name, SDOAL.approval_status, SPM.proforma_doc_code  FROM SALES_DELIVERY_ORDER_MST AS SDOM
           LEFT JOIN SALES_INVOICE_MST AS SIM ON SIM.id = SDOM.sales_id_invoice
            LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
            LEFT JOIN WAREHOUSE_MASTER AS WM ON WM.id = SDOM.source_warehouse_id
            LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
            INNER JOIN SALES_DELIVERY_ORDER_APPROVAL_LEVEL AS SDOAL ON SDOAL.delivery_order_id = SDOM.id WHERE SDOM.is_deleted = 0 and SDOAL.approval_status = 'REJECTED' AND SDOAL.progress_status='CLOSE'
                AND SDOM.entity_id = ${entity_id}
            ORDER BY SDOM.id DESC `;

                getAllData = await db.sequelize.query(query, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
            } else {
                const query = `SELECT SDOM.*, SPM.delivery_date, WM.name AS warehouse_name, SSUM.business_name, SDOAL.approval_status, SPM.proforma_doc_code FROM SALES_DELIVERY_ORDER_MST AS SDOM
            LEFT JOIN SALES_INVOICE_MST AS SIM ON SIM.id = SDOM.sales_id_invoice  
            LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
            LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
LEFT JOIN WAREHOUSE_MASTER AS WM ON WM.id = SDOM.source_warehouse_id
             INNER JOIN SALES_DELIVERY_ORDER_APPROVAL_LEVEL AS SDOAL ON SDOAL.delivery_order_id = SDOM.id
            WHERE SDOAL.employee_id = ${loggedEmployeeId} AND SDOAL.approval_status = 'REJECTED' AND SDOAL.progress_status='CLOSE'
                AND SDOM.entity_id = ${entity_id}
            ORDER BY SDOM.id DESC `;

                getAllData = await db.sequelize.query(query, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
            }

            if (getAllData.length > 0) {
                return res.status(200).send({
                    code: 200,
                    message: "Fetch All Data Successfully",
                    data: getAllData,
                });
            } else {
                return res.status(200).send({ code: 200, message: "No Records Found", data: getAllData });
            }
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};
