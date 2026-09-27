const db = require("../../../../app/models/index");
const userDetails = db.user;
const { Op, where } = require("sequelize");
const transportRequest = require("../model/transportRequest");

exports.createTransportRequest = async (req, res) => {
    try {
        let {
            requestDateTime,
            requestedBy,
            department,
            priority,
            pickaddress,
            pickcountry_id,
            pickstate_id,
            pick_city_id,
            remarks,
            pickup_pincode,
            picktDateTime,
            entity_id,
            financial_year_id,
            address,
            delivery_country_id,
            delivery_state_id,
            delivery_city_id,
            vendor_id,
            delivery_pincode,
            deliverDateTime,
            type_of_supply,
            type_of_delivey,
            type_of_sub_delivey,
            vehicle_category_id,
            via,
            isItem,
            isProduct,
            productItems,
            vehicle_master_id,
            ItemDetails,
            product_description,
            transported_by
        } = req.body;

        const [workflow_data] = await db.sequelize.query(`
                SELECT WFM.job_name, WR.employee_id, WR.role_id, WR.level, WR.id
                FROM ESS_WORK_FLOW_MASTER AS WFM
                LEFT JOIN ESS_WORKFLOW_RANGE AS WR ON WR.workflow_id = WFM.id
                WHERE WFM.status = 'ACTIVE' AND WFM.isDeleted = 0 AND WFM.department_id = ${department} AND
                WR.status = 'ACTIVE' AND WR.isDeleted = 0 AND WFM.job_name = 'Transport' AND WFM.entity_id=${entity_id}
            `);

        if (workflow_data.length == 0) {
            return res.status(401).json({ message: 'Workflow for this department is not created for transport!', code: 401 });
        }
        const lastReqId = await db.transportRequest.findOne({
            order: [["id", "DESC"]],
        });

        let request_number = "REQ000";
        if (lastReqId) {
            const lastREQ_id = lastReqId.id;
            request_number += lastREQ_id + 1;
        } else {
            request_number += "1";
        }
        vehicle_category_id = null;
        if (vehicle_master_id) {
            const vehicleMaster = await db.vehicle_master.findOne({
                where: { id: vehicle_master_id },
                attributes: ['vehicle_category_id']
            });

            if (!vehicleMaster) {
                return res.status(404).json({
                    code: 404,
                    message: 'Vehicle master not found'
                });
            }

            vehicle_category_id = vehicleMaster.vehicle_category_id;
        }
        const newRequest = await db.transportRequest.create({
            request_id: request_number,
            requested_by: requestedBy,
            priority_level: priority,
            vendor_id,
            pickup_location: pickaddress,
            delivery_location: address,
            via,
            requested_pickup_datetime: requestDateTime,
            requested_delivery_datetime: deliverDateTime,
            vehicle_category_id: vehicle_category_id,
            delivery_type: type_of_delivey,
            subdelivery_type: type_of_sub_delivey,
            supply_type: type_of_supply,
            item_category: "abcd",
            item_description: product_description,
            quantity: productItems.quantity,
            hsn: productItems.hsn_code,
            uom: productItems.uom_name,
            amount: productItems.price_per_unit,
            gst: 18,
            total_amount: 1000,
            remark: remarks,
            delivery_pincode,
            delivery_country_id,
            delivery_state_id,
            delivery_city_id,
            vehicle_master_id,
            pickup_pincode,
            isItem,
            isProduct,
            pick_country_id: pickcountry_id,
            pick_city_id,
            pick_state_id: pickstate_id,
            department_id: department,
            entity_id,
            financial_year_id,
            transported_by
        });

        if (productItems[0].product_master_id !== null) {
            await Promise.all(
                productItems.map(async (item) => {
                    let {
                        product_master_id,
                        variant_id,
                        hsn_code,
                        price_per_unit,
                        quantity,
                        total_price,
                        product_category_id,
                        delivered_qty,
                        discount_approved,
                        discount_request,
                        maximum_discount,
                        tax,
                        product_description,
                        uom_name
                    } = item;
                    await db.transportReqProductDetail.create({
                        product_master_id,
                        variant_id,
                        hsn_code,
                        price_per_unit,
                        quantity,
                        total_price,
                        product_cat_id: product_category_id,
                        delivered_qty,
                        discount_approved,
                        discount_request,
                        maximum_discount,
                        tax,
                        product_description,
                        uom_name,
                        tran_req_id: newRequest.id
                    });
                })

            );
        }
        if (ItemDetails[0].item_type_id !== null) {
            await Promise.all(
                ItemDetails.map(async (item) => {
                    let {
                        item_type_id, asset_id, item_master_id, item_code, bom_qty, type, price, uom_id
                    } = item;
                    await db.transItemDetail.create({
                        item_type_id, asset_id, item_master_id, item_code, bom_qty, type, price, uom_id: 1,
                        tran_req_id: newRequest.id
                    });
                })

            );
        }

        if (newRequest) {
            const trans_id = newRequest.id;
            const transportLevels = workflow_data.map(item => ({
                level: item.level,
                employee_id: item.employee_id,
                trans_id: trans_id,
                workflow_range_id: item.id
            }));
            await db.transportApprovalLevel.bulkCreate(transportLevels);

            return res.status(201).json({
                message: 'Transport request created successfully!',
            });
        } else {
            return res.status(400).send({ code: 400, message: 'Error while creating!' });
        }


    } catch (error) {
        console.error('Transport Request Create Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}


exports.editTransportRequest = async (req, res) => {
    const { id } = req.params;
    const {
        requestDateTime,
        requestedBy,
        department,
        priority,
        pickaddress,
        pickcountry_id,
        pickstate_id,
        vendor_id,
        pick_city_id,
        remarks,
        pickup_pincode,
        picktDateTime,
        entity_id,
        vehicle_master_id,
        financial_year_id,
        address,
        delivery_country_id,
        isItem,
        isProduct,
        delivery_state_id,
        delivery_city_id,
        delivery_pincode,
        deliverDateTime,
        type_of_supply,
        type_of_delivey,
        ItemDetails,
        type_of_sub_delivey,
        vehicle_category_id,
        via,
        productItems,
        product_description,
        transported_by
    } = req.body;

    const [workflow_data] = await db.sequelize.query(`
        SELECT WFM.job_name, WR.employee_id, WR.role_id, WR.level, WR.id
        FROM ESS_WORK_FLOW_MASTER AS WFM
        LEFT JOIN ESS_WORKFLOW_RANGE AS WR ON WR.workflow_id = WFM.id
        WHERE WFM.status = 'ACTIVE' AND WFM.isDeleted = 0 AND WFM.department_id = ${department}
        AND WR.status = 'ACTIVE' AND WR.isDeleted = 0 AND WFM.job_name = 'Transport'
        AND WFM.entity_id=${entity_id}
    `);

    if (workflow_data.length === 0) {
        return res.status(401).json({ message: 'Workflow for this department is not created for transport!', code: 401 });
    }

    const existingRequest = await db.transportRequest.findOne({
        where: {
            id: id,
            isDeleted: false
        }
    });

    if (!existingRequest) {
        return res.status(404).json({ message: 'Transport request not found.', code: 404 });
    }

    const trans_id = existingRequest.id;

    try {
        const newRequest = await db.transportRequest.update({
            requested_by: requestedBy,
            priority_level: priority,
            pickup_location: pickaddress,
            delivery_location: address,
            via,
            vendor_id,
            requested_pickup_datetime: requestDateTime,
            requested_delivery_datetime: deliverDateTime,
            vehicle_category_id,
            delivery_type: type_of_delivey,
            subdelivery_type: type_of_sub_delivey,
            supply_type: type_of_supply,
            item_category: "abcd",
            isItem,
            isProduct,
            item_description: product_description,
            quantity: productItems?.[0]?.quantity || null,
            hsn: productItems?.[0]?.hsn_code || null,
            uom: productItems?.[0]?.uom_name || null,
            amount: productItems?.[0]?.price_per_unit || null,
            gst: 18,
            total_amount: 1000,
            remark: remarks,
            delivery_pincode,
            vehicle_master_id,
            delivery_country_id,
            delivery_state_id,
            delivery_city_id,
            pickup_pincode,
            pick_country_id: pickcountry_id,
            pick_city_id,
            pick_state_id: pickstate_id,
            department_id: department,
            entity_id,
            financial_year_id,
            transported_by
        }, {
            where: { id: trans_id }
        });

        if (productItems[0].product_master_id !== null) {

            await db.transportReqProductDetail.destroy({
                where: { tran_req_id: trans_id }
            });

            await Promise.all(
                productItems.map(item =>
                    db.transportReqProductDetail.create({
                        product_master_id: item.product_master_id,
                        variant_id: item.variant_id,
                        hsn_code: item.hsn_code,
                        price_per_unit: item.price_per_unit,
                        quantity: item.quantity,
                        total_price: item.total_price,
                        product_cat_id: item.product_category_id,
                        delivered_qty: item.delivered_qty,
                        discount_approved: item.discount_approved,
                        discount_request: item.discount_request,
                        maximum_discount: item.maximum_discount,
                        tax: item.tax,
                        product_description: item.product_description,
                        uom_name: item.uom_name,
                        tran_req_id: trans_id
                    })
                )
            );
        }

        if (ItemDetails[0].item_type_id !== null) {

            await db.transItemDetail.destroy({
                where: { tran_req_id: trans_id }
            });


            await Promise.all(
                ItemDetails.map(async (item) => {
                    let {
                        item_type_id, asset_id, item_master_id, item_code, bom_qty, type, price, uom_id
                    } = item;
                    await db.transItemDetail.create({
                        item_type_id, asset_id, item_master_id, item_code, bom_qty, type, price, uom_id: 1,
                        tran_req_id: newRequest.id
                    });
                })

            );
        }

        if (workflow_data.length > 0) {
            await db.transportApprovalLevel.destroy({ where: { trans_id } });

            const transportLevels = workflow_data.map(item => ({
                level: item.level,
                employee_id: item.employee_id,
                trans_id: trans_id,
                workflow_range_id: item.id
            }));
            await db.transportApprovalLevel.bulkCreate(transportLevels);
        }

        return res.status(200).json({
            message: 'Transport request updated successfully!'
        });

    } catch (error) {
        console.error('Transport Request Update Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};


exports.getAll_TransportRequest = async (req, res) => {
    try {
        const { financial_year_id, entity_id, login_id } = req.params;
        const data = await db.transportRequest.findAll({
            where: {
                isDeleted: false,
                financial_year_id,
                entity_id
            },
            include: [{
                model: db.vehical_category,
                attributes: ["vehical_category_name"]
            },
            {
                model: db.vehicle_master,
                attributes: ["vehicle_number"]
            }
            ]
        });

        const approverData = await db.transportApprovalLevel.findAll({
            where: {
                status: "ACTIVE",
                employee_id: login_id
            }
        });
        if (!data || data.length <= 0) {
            return res.status(200).json({ message: "No data found", data })
        }
        else if (approverData) {
            return res.status(200).json({ message: "Data fetched successfully!", data, approverData, code: 200 })
        }

    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Can not fetch data!" })
    }
}
exports.deleteTransportRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await db.transportRequest.findOne({
            where: {
                id: id
            }
        })

        if (!data) {
            return res.status(404).send({
                message: "Record Not Found"
            })
        } else {
            const deletedData = await db.transportRequest.update(
                { isDeleted: true },
                {
                    where: {
                        id: id
                    }
                })
            return res.status(200).send({
                message: "Asset Warranty Deleted Successfully",
                deletedData
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error "
        })
    }
}


exports.get_request_byId = async (req, res) => {
    const reqId = req.params.id;
    try {
        if (!reqId) {
            return res.status(400).send({ code: 400, message: "Request Id Not Found or Invalid!" });
        }
        const data = await db.transportRequest.findOne({ where: { id: reqId } });
        if (data) {
            // const productData = await db.transportReqProductDetail.findAll({ where: { tran_req_id: reqId } });
            const itemData = await db.transItemDetail.findAll({
                where:
                    { tran_req_id: reqId },
                include: {
                    model: db.uom,
                    attributes:["uom_name"]
                }
            });

            return res.status(200).send({ code: 200, message: "Fetch Data Successfully", data: data, itemData: itemData, });

        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.approvedRequestById = async (req, res) => {
    try {


        const transport_id = req.params.transport_id;
        const {

            remarks, emp_id,
            approval_status,
            //  progress_status,
        } = req.body;
        let updateData;

        if (approval_status == 'REJECTED') {

            const currentApprovelStatus = await db.transportRequest.findOne({
                where: { id: transport_id },
            });

            if (currentApprovelStatus !== null) {

                await db.transportRequest.update({ status_type: 'REJECTED', remarks: remarks }, { where: { id: transport_id } });

                updateData = await db.transportApprovalLevel.update(
                    {
                        approval_status: approval_status,
                        // progress_status: progress_status,
                        remarks: remarks
                    },
                    {
                        where: {
                            employee_id: emp_id,
                            trans_id: transport_id
                        },
                    }
                );

            }
        }

        if (approval_status == 'APPROVED') {
            const allLevelsData = await db.transportApprovalLevel.findAll({
                where: {
                    employee_id: emp_id,
                    trans_id: transport_id
                },
                order: [["level", "ASC"]],
            });

            let maxLevel;
            if (allLevelsData !== null) {
                maxLevel = await db.transportApprovalLevel.max('level', {
                    where: { trans_id: transport_id }
                });
            }

            const currentLevel = await db.transportApprovalLevel.findOne({
                attributes: ["level"],
                where: {
                    employee_id: emp_id,
                    trans_id: transport_id
                },
            });

            const maxLevelValue = maxLevel;

            const currentLevelValue = currentLevel.level;

            if (maxLevelValue !== null && currentLevelValue !== null && currentLevelValue === maxLevelValue) { // issue in this line
                const currentApprovelStatus = await db.transportRequest.findOne({
                    where: { id: transport_id },
                });

                if (currentApprovelStatus !== null) {
                    const finalApproved = await db.transportRequest.update(
                        {
                            status_type: "APPROVED",
                            remarks: remarks
                        },
                        { where: { id: transport_id } }
                    );
                    updateData = await db.transportApprovalLevel.update(
                        {
                            approval_status: approval_status,
                            // progress_status: progress_status,
                            remarks: remarks
                        },
                        {
                            where: {
                                employee_id: emp_id,
                                trans_id: transport_id
                            },
                        }
                    );

                    return res.status(200).send({
                        code: 200,
                        message: "Quotation Approved Successfully. This One must be the last level.",
                        data: finalApproved,
                    });
                }
            }
            else {
                updateData = await db.transportApprovalLevel.update(
                    {
                        approval_status: approval_status,
                        // progress_status: progress_status,
                        remarks: remarks
                    },
                    {
                        where: {
                            employee_id: emp_id,
                            trans_id: transport_id
                        },
                    }
                );
            }
        }

        if (updateData !== 0) {
            return res.status(200).send({ code: 200, message: "Quotation Approval Successfully", data: updateData });
        }
        else {
            return res.status(200).send({ code: 200, message: "Unable to Update", data: updateData });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getAll_Approval_level = async (req, res) => {
    try {

        const transport_id = req.params.transport_id;

        const getData = await db.transportApprovalLevel.findAll({
            where: {
                [Op.and]: [
                    { trans_id: transport_id },
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
                remarks: levelInfo.remarks ? levelInfo.remarks : "No Remarks Available!"
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


module.exports.dispatchedOrderLists = async (req, res) => {
    try {
        const login_id = req.params.employee_id;
        let condition;
        if (login_id === 23 || login_id == "23" || login_id == "Super Admin") {
            condition = `1=1`;
        } else {
            condition = `CL.login_id=${login_id} OR CP.employee_id=${login_id}`;
        }
        const [getDealClose] = await db.sequelize.query(
            `SELECT 
      CP.proposal_no,
      CP.grand_total, 
      CONCAT(R.first_name, ' ', R.last_name) AS lead_owner,
      CL.contact_person_name,
      CADM.do_no,
      CADM.do_date,
      CADM.id AS order_no_id,
      DATE_FORMAT(CP.createdAt,'%Y-%m-%d') AS createdAt,
      CL.company_name,
      C.proposal_id,
      DO.vehicle_number,
      DO.vehicle_type,
      'complete' AS status
    FROM CRM_PROPOSAL_DEAL_CLOSE_MST AS C
    INNER JOIN CRM_CREATE_PROPOSAL_MST AS CP ON CP.id = C.proposal_id
    INNER JOIN CRM_VERSION_PROPOSAL_MST AS CV ON CV.id = C.version_id 
    INNER JOIN CRM_CREATE_LEAD_MST AS CL ON CL.id = CP.create_lead_id
    INNER JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = CL.login_id
    LEFT JOIN CRM_DELIVERY_CHALLAN_MST AS CADM ON CADM.proposal_id = CP.id
    LEFT JOIN DISPATCH_ORDER AS DO ON DO.addDO_id = CADM.id
    WHERE ${condition}
      AND CADM.do_no IS NOT NULL
      AND CADM.do_no <> ''
      AND is_dispatch_status = "APPROVED"`
        );




        const [dataList] = await db.sequelize.query(`
   SELECT C.id AS proposal_id,C.lead_owner,C.company_name,C.proposal_no,CADM.do_no,CADM.do_date,CADM.id  AS order_no_id,C.contact_person_name,
                DATE_FORMAT(C.createdAt,'%Y-%m-%d') AS createdAt,C.grand_total,'pending'
                AS status FROM CRM_CREATE_PROPOSAL_MST AS C
                  LEFT JOIN CRM_DELIVERY_CHALLAN_MST AS CADM ON CADM.proposal_id=C.id
                WHERE C.existing_client = true AND is_dispatch_status='APPROVED' AND proposal_status='approved' 
                AND CADM.do_no IS  NOT NULL AND CADM.do_no <> '' ORDER BY C.id DESC;   
                `);

        const Obj = [...getDealClose, ...dataList];
        const sortedResults = Obj.sort((a, b) => b.proposal_id - a.proposal_id);
        if (getDealClose) {
            return res
                .status(200)
                .send({ code: 200, message: "success", data: sortedResults });
        } else {
            return res
                .status(200)
                .send({ code: 404, message: " not data found", data: sortedResults });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

exports.approvedTransportRequest = async (req, res) => {
    const { entity_id } = req.params;

    try {

        const dataList = await db.sequelize.query(`
          SELECT
            TR.id, 
            TR.request_id,
            TR.priority_level,
            TR.via,
            TR.pickup_location,
            MC.countryss_name AS pickup_country,
            TR.pickup_pincode,
            TR.transported_by,
            TR.delivery_location,
            MCC.countryss_name AS delivery_country,
            TR.delivery_pincode,
            TR.transported_by,
            TR.request_datetime,
            TR.delivery_type,
            TR.supply_type,
            MCC.countryss_name AS delivery_country,
            VC.vehical_category_name,
            VM.vehicle_number,
            TR.status_type
          FROM TRANSPORT_REQUEST AS TR 
          INNER JOIN MASTER_COUNTRY AS MC ON TR.pick_country_id = MC.countryss_id
          INNER JOIN MASTER_COUNTRY AS MCC ON TR.delivery_country_id = MCC.countryss_id
          INNER JOIN TM_VEHICAL_CATEGORY AS VC ON TR.vehicle_category_id = VC.id
          INNER JOIN TM_VEHICLE_MASTER AS VM ON  TR.vehicle_master_id = VM.id
          WHERE TR.status_type = 'APPROVED' AND TR.entity_id = :entity_id
        `, {
            replacements: { entity_id },
            type: db.Sequelize.QueryTypes.SELECT
        });

        return res.status(200).send({ code: 200, data: dataList });

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}


module.exports.getApprovedProductItemData = async (req, res) => {
    const id = req.params.id;
    const status = req.query.status;
    try {

        const [transportRequestData] = await db.sequelize.query(`
     SELECT 
    tr.*, 
    tvm.rc_number 
FROM 
    TRANSPORT_REQUEST AS tr
LEFT JOIN 
    TM_VEHICLE_MASTER AS tvm 
ON 
    tr.vehicle_master_id = tvm.id
WHERE 
    tr.id = :id 
    AND tr.status_type = :status
    AND tr.isDeleted = FALSE;

        `, {
            replacements: { id,status},
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!transportRequestData) {
            return res.status(404).send({ code: 404,
                message: "Transport request not found or not approved"
            });
        }

        // const productData = await db.sequelize.query(`
        //     SELECT TRP.hsn_code,
        //     TRP.price_per_unit,
        //     TRP.quantity,
        //     TRP.total_price,
        //     TRP.uom_name,
        //     MP.product_name,
        //     MP.product_code,PC.category_name,MPV.variant_name
        //     FROM TRANSPORT_REQUEST_PRODUCT_DETAILS AS TRP
        //     INNER JOIN MASTER_PRODUCT AS MP ON TRP.product_master_id = MP.id
        //     INNER JOIN PRODUCT_CATEGORY AS PC ON MP.product_category_id = PC.id
        //     INNER JOIN MASTER_PRODUCT_VARIANT AS MPV ON MP.id = MPV.product_master_id
        //     WHERE TRP.tran_req_id = :id;
        // `, {
        //     replacements: { id },
        //     type: db.sequelize.QueryTypes.SELECT
        // });

        const itemData = await db.sequelize.query(`
           SELECT TRI.*, MI.item_name,MI.item_code,MA.asset_category_name,MIT.itemType,MU.uom_name
            FROM TRANSPORT_REQUEST_ITEM_DETAILS AS TRI
            LEFT JOIN MASTER_ITEM AS MI ON MI.id = TRI.item_master_id
            LEFT JOIN MASTER_ASSET AS MA ON MA.id = TRI.asset_id
            LEFT JOIN MASTER_ITEM_ITEMTYPE AS MIT ON MIT.id = TRI.item_type_id
            LEFT JOIN MASTER_UOM AS MU ON MU.uom_id = TRI.uom_id
            WHERE TRI.tran_req_id = :id;
        `, {
            replacements: { id },
            type: db.sequelize.QueryTypes.SELECT
        });

        return res.status(200).send({
            code: 200,
            message: "Data fetched successfully", transportRequestData,
            // productData,
            itemData
        });

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};
