const db = require('../../../models/index');

const proforma = db.proforma;
const proformaApprovalLevel = db.proformaApprovalLevel;
const userDetails = db.user;

const { Op, where } = require("sequelize");

exports.getAllProformaApprovalLevel = async (req, res) => {
    try {

        const proforma_id = req.params.proforma_id;

        const getData = await proformaApprovalLevel.findAll({
            where: {
                [Op.and]: [
                    { proforma_id: proforma_id },
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

exports.approvedProformaById = async (req, res) => {
    try {


        const proforma_id = req.params.proforma_id;
        const {

            remarks, emp_id, approval_status, progress_status
        } = req.body;
        let updateData;
        if (approval_status == 'REJECTED') {
            await proforma.update({ status: 'REJECTED' }, { where: { id: proforma_id } });
            updateData = await proformaApprovalLevel.update(
                {
                    approval_status: approval_status,
                    progress_status: progress_status,
                    remarks: remarks
                },
                {
                    where: {
                        employee_id: emp_id,
                        proforma_id: proforma_id
                    },
                }
            );

        } else {
            updateData = await proformaApprovalLevel.update(
                {
                    approval_status: approval_status,
                    progress_status: progress_status,
                    remarks: remarks
                },
                {
                    where: {
                        employee_id: emp_id,
                        proforma_id: proforma_id
                    },
                }
            );
        }

        if (approval_status == 'APPROVED') {
            const allLevelsData = await proformaApprovalLevel.findAll({
                where: {
                    employee_id: emp_id,
                    proforma_id: proforma_id
                },
                order: [["level", "ASC"]],
            });

            let maxLevel;
            if (allLevelsData !== null) {
                maxLevel = await proformaApprovalLevel.max('level', {
                    where: { proforma_id: proforma_id }
                });
            }

            const currentLevel = await proformaApprovalLevel.findOne({
                attributes: ["level"],
                where: {
                    employee_id: emp_id,
                    proforma_id: proforma_id
                },
            });

            const maxLevelValue = maxLevel;

            const currentLevelValue = currentLevel.level;

            if (maxLevelValue !== null && currentLevelValue !== null && currentLevelValue === maxLevelValue) {
                const currentApprovelStatus = await proforma.findOne({
                    where: { id: proforma_id },
                });

                if (currentApprovelStatus !== null) {
                    const finalApproved = await proforma.update(
                        { status: "APPROVED" },
                        { where: { id: proforma_id } }
                    );

                    return res.status(200).send({
                        code: 200,
                        message: "Proforma Approved Successfully. This One must be the last level.",
                        data: finalApproved,
                    });
                }
            }
        }

        if (updateData !== 0) {
            return res.status(200).send({
                code: 200,
                message: "Proforma Approval Successfully",
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

module.exports.createProforma = async (req, res) => {
    try {
        let id = req.params?.id;
        let { proforma_doc_code, delivery_date,proforma_create_date, department_id, entity_id, quotation_id,details_photo, user_id } = req.body;
        if (id !== undefined && id !== null && id !== '' && id !== 'undefined') {
            // Update existing proforma
            let updateProforma = await db.proforma.update({

                delivery_date,
                proforma_create_date,
                department_id,
                entity_id,
                details_photo,
                quotation_id
            }, { where: { id: id } });

            if (updateProforma) {
                return res.status(200).send({ code: 200, message: 'Quotation Updated Successfully' });
            } else {
                return res.status(400).send({ code: 400, message: 'Update Failed!' });
            }
        } else {

            const [query] = await db.sequelize.query(`
                SELECT WFM.job_name, WR.employee_id, WR.role_id, WR.level, WR.id
                FROM ESS_WORK_FLOW_MASTER AS WFM
                LEFT JOIN ESS_WORKFLOW_RANGE AS WR ON WR.workflow_id = WFM.id
                WHERE WFM.status = 'ACTIVE' AND WFM.isDeleted = 0 AND WFM.department_id = ${department_id} AND
                WR.status = 'ACTIVE' AND WR.isDeleted = 0  AND WFM.job_name = 'Proforma'
            `);


            if (query.length > 0) {
                let createProforma = await db.proforma.create({

                    delivery_date,
                    proforma_create_date,
                    department_id,
                    entity_id,
                    details_photo,
                    quotation_id,
                    proforma_doc_code,
                    user_id,
                    status: 'PENDING'
                });

                if (createProforma) {

                    const newProformaId = createProforma.id;

                    const approvalLevels = query.map(item => ({
                        level: item.level,
                        employee_id: item.employee_id,
                        proforma_id: newProformaId,
                        workflow_range_id: item.id
                    }));
                    await db.proformaApprovalLevel.bulkCreate(approvalLevels);

                    // Update the quotation to indicate proforma was created

                    await db.quotation.update({ proforma_created: true }, { where: { id: quotation_id, is_deleted: false } });
                    return res.status(200).send({ code: 200, message: 'Proforma Created Successfully' });
                } else {
                    return res.status(400).send({ code: 400, message: 'Error creating proforma' });
                }
            } else {
                return res.status(501).send({ code: 501, message: 'Proforma workflow is not created for your department.' });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getPendingProformaByDepId = async (req, res) => {
    try {

        let entity_id = req.params?.entity_id;
        let dep_id = req.params?.dep_id;
        const [query] = await db.sequelize.query(`SELECT SFM.* , SSUM.business_name, SQM.quotation_doc_code  FROM SALES_PROFORMA_MST AS SFM
LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SFM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
WHERE SFM.is_deleted = 0 AND SFM.entity_id = ${entity_id} AND SFM.department_id = ${dep_id} AND SFM.status = 'PENDING' 
`);


        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {
            return res
                .status(200)
                .send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};




module.exports.deleteProformaById = async (req, res) => {

    try {
        let id = req.params?.id;
        const deleteProforma = await db.proforma.update({ is_deleted: true }, { where: { id: id } });
        if (deleteProforma) {
            return res.status(200).send({ code: 200, message: 'Proforma Deleted Successfully' });
        } else {
            return res.status(200).send({ code: 404, message: 'No proforma found!!' });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}

module.exports.getQuotationById = async (req, res) => {
    try {
        const quotation = await db.quotation.findOne({ where: { quotation_doc_code: req.params.id, is_deleted: false } });

        if (quotation) {
            const tempQuotId = quotation.dataValues.id
            if (tempQuotId) {
                const itemsData = await db.quotation_Items.findAll({ where: { quotation_id: tempQuotId, is_deleted: false } });
                if (itemsData) {
                    const newData = {
                        ...quotation.dataValues,
                        items: itemsData.map(item => item.dataValues),
                    };
                    return res.status(200).send({ code: 200, massege: 'Success', data: newData });

                }

            }
        } else {
            return res.status(200).send({ code: 404, message: 'No Quotation Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}

module.exports.getQuotationByMainId = async (req, res) => {
    try {
        const quotations = await db.quotation.findAll({
            where: { sales_rep_id: req.params.id, is_deleted: false },
            include: [
                {
                    model: db.superUser,
                    as: 'customer',
                    attributes: ['id', 'business_name'],
                },
                {
                    model: db.user,
                    as: 'employee',
                    attributes: ['employee_id', 'first_name', 'last_name'],
                }
            ]
        });

        if (quotations && quotations.length > 0) {
            const formattedQuotations = quotations.map(quotation => ({
                ...quotation.dataValues,
                temp_customer_name: quotation.customer ? quotation.customer.business_name : null,
                temp_sales_rep_name: quotation.employee
                    ? `${quotation.employee.first_name} ${quotation.employee.last_name}`
                    : null,
            }));

            return res.status(200).send({ code: 200, message: 'Success', data: formattedQuotations });
        } else {
            return res.status(200).send({ code: 404, message: 'No Quotation Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


module.exports.getApprovedDataByCustomerId = async (req, res) => {
    try {

        let entity_id = req.params?.entity_id;
        let customer_id = req.params?.customer_id;
        const [query] = await db.sequelize.query(`SELECT SFM.* , SSUM.business_name, SQM.quotation_doc_code  FROM SALES_PROFORMA_MST AS SFM
LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SFM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SFM.customer_id
WHERE SFM.is_deleted = 0 AND SFM.entity_id = ${entity_id} AND SFM.user_id = ${customer_id} AND SFM.status = 'APPROVED' `);


        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {
            return res
                .status(200)
                .send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getRejectedDataByCustomerId = async (req, res) => {
    try {

        let entity_id = req.params?.entity_id;
        let customer_id = req.params?.customer_id;
        const [query] = await db.sequelize.query(`SELECT SFM.* , SSUM.business_name, SQM.quotation_doc_code  FROM SALES_PROFORMA_MST AS SFM
LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SFM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SFM.customer_id
WHERE SFM.is_deleted = 0 AND SFM.entity_id = ${entity_id} AND SFM.user_id = ${customer_id} AND SFM.status = 'REJECTED' `);


        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {
            return res
                .status(200)
                .send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.getPendingByDepId = async (req, res) => {
    try {
        const quotations = await db.quotation.findAll({
            where: { department_id: req.params.id, status: "PENDING", is_deleted: false },
            include: [
                {
                    model: db.superUser,
                    as: 'customer',
                    attributes: ['id', 'business_name'],
                },
                {
                    model: db.user,
                    as: 'employee',
                    attributes: ['employee_id', 'first_name', 'last_name'],
                }
            ]
        });

        if (quotations && quotations.length > 0) {
            const formattedQuotations = quotations.map(quotation => ({
                ...quotation.dataValues,
                temp_customer_name: quotation.customer ? quotation.customer.business_name : null,
                temp_sales_rep_name: quotation.employee
                    ? `${quotation.employee.first_name} ${quotation.employee.last_name}`
                    : null,
            }));

            return res.status(200).send({ code: 200, message: 'Success', data: formattedQuotations });
        } else {
            return res.status(200).send({ code: 404, message: 'No Quotation Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};

module.exports.updateProformaStatus = async (req, res) => {
    try {

        const updateStatus = await db.proforma.update({ status: req.params.status },
            { where: { id: req.params.id } });
        if (updateStatus) {
            return res.status(200).send({ code: 200, message: 'Status Updated Successfully' });
        } else {
            return res.status(200).send({ code: 404, message: 'No Proforma Found with given ID' });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}




module.exports.getApprovedQuotationDetailById = async (req, res) => {
    try {

        let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT SQM.*, MA.asset_category_name, SSUM.business_name, concat(HRU.first_name, ' ', HRU.last_name) AS employee_name FROM SALES_QUOTATIONS_MST AS SQM 
LEFT JOIN MASTER_ASSET AS MA ON MA.id = SQM.category_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id 
LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = SQM.sales_rep_id 
WHERE SQM.is_deleted = 0 AND SQM.id = ${id}`);


        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {
            return res
                .status(200)
                .send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};







// proforma code start from here


module.exports.getQuotationDocCode = async (req, res) => {
    try {
        const entity_id = req.params?.entity_id;
        const getApprovedQuotations = await db.quotation.findAll({
            where: { is_deleted: false, status: 'APPROVED', entity_id: entity_id },
            order: [
                ['id', 'DESC']
            ]
        });
        if (getApprovedQuotations) {
            return res.status(200).send({ code: 200, massege: 'Success', data: getApprovedQuotations });
        } else {
            return res.status(200).send({ code: 404, message: 'No Quotations Found' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
};




module.exports.getApprovedQuotationItemDetailById = async (req, res) => {
    try {

        let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT SQIM.*, MI.item_name FROM SALES_QUOTATIONS_ITEMS_MST AS SQIM
LEFT JOIN MASTER_ITEM AS MI ON MI.id = SQIM.item_id
WHERE SQIM.quotation_id = ${id}`);


        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {
            return res
                .status(200)
                .send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};




module.exports.getProformaById = async (req, res) => {
    try {

        let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT SPM.*, SPM.customer_id AS ship_to,SPM.details_photo AS photo,SQM.*, MA.asset_category_name, SSUM.business_name, concat(HRU.first_name, ' ', HRU.last_name) AS employee_name FROM SALES_PROFORMA_MST AS SPM 
LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
LEFT JOIN MASTER_ASSET AS MA ON MA.id = SQM.category_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id 
LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = SQM.sales_rep_id 
WHERE SPM.id = ${id}`);


        if (query.length > 0) {
            return res
                .status(200)
                .send({
                    code: 200,
                    message: "Fetched Data Successfully !",
                    data: query,
                });
        } else {
            return res
                .status(200)
                .send({ code: 404, message: "Record Not Found", data: query });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


module.exports.getAllProforma = async (req, res) => {
    try {
        const loggedEmployeeId = req.params.id;
        const loggedUserRole = req.query?.role;

        const { id } = req.params;
        const { status, entity_id } = req.query;

        if (status == "PENDING") {
            const query = `SELECT SPM.* , SSUM.business_name, SQM.quotation_doc_code FROM SALES_PROFORMA_MST AS SPM 
            LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
    LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
          LEFT JOIN SALES_PROFORMA_APPROVAL_LEVEL as la ON la.proforma_id=SPM.id and la.employee_id= ${loggedEmployeeId} WHERE la.approval_status='PENDING' AND SPM.id IN (
              SELECT pa.proforma_id FROM SALES_PROFORMA_APPROVAL_LEVEL AS pa 
              WHERE pa.employee_id = ${loggedEmployeeId} 
              AND (
                  (pa.level = 1)
                  OR 
                  (
                      pa.level > 1 
                      AND 
                      (
                          SELECT COUNT(pl.id) 
                          FROM SALES_PROFORMA_APPROVAL_LEVEL AS pl 
                          WHERE pl.proforma_id = pa.proforma_id 
                          AND pl.level = (pa.level - 1)  
                          AND pl.approval_status = 'APPROVED' 
                          AND pl.progress_status = 'CLOSE'
                      ) > 0
                  )
              )
          ) AND SPM.entity_id = ${entity_id} ORDER BY SPM.id DESC
      `;
            const data = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
            });
            return res.status(200).json({ code: 200, message: "Success", data: data });
        }


        if (status == "ALL") {
            const [query] = await db.sequelize.query(`SELECT SFM.* , SQM.quotation_doc_code,SSUM.business_name FROM SALES_PROFORMA_MST AS SFM
                LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SFM.quotation_id
                LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
                WHERE SFM.is_deleted = 0 AND SFM.entity_id = ${entity_id} AND SFM.user_id = ${loggedEmployeeId} ORDER BY SFM.id DESC`);


            if (query.length > 0) {
                return res
                    .status(200)
                    .send({
                        code: 200,
                        message: "Fetched Data Successfully !",
                        data: query,
                    });
            } else {
                return res
                    .status(200)
                    .send({ code: 404, message: "Record Not Found", data: query });
            }
        }
        if (status == "APPROVED") {
            let getAllData;

            if (loggedUserRole === "Super Admin") {
                const query = `SELECT SPM.*, SSUM.business_name, SPAL.approval_status, SQM.quotation_doc_code  FROM SALES_PROFORMA_MST AS SPM
             LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
            INNER JOIN SALES_PROFORMA_APPROVAL_LEVEL as SPAL ON SPAL.proforma_id = SPM.id WHERE SPM.is_deleted = 0 and SPAL.approval_status = 'APPROVED' AND SPAL.progress_status='CLOSE' 
            AND SPM.entity_id = ${entity_id}
            ORDER BY SPM.id DESC `;

                getAllData = await db.sequelize.query(query, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
            } else {
                const query = `SELECT SPM.*, SSUM.business_name, SPAL.approval_status, SQM.quotation_doc_code FROM SALES_PROFORMA_MST AS SPM 
  LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
            INNER JOIN SALES_PROFORMA_APPROVAL_LEVEL AS SPAL ON SPAL.proforma_id = SPM.id 
            WHERE SPAL.employee_id = ${loggedEmployeeId} AND SPAL.approval_status = 'APPROVED' AND SPAL.progress_status='CLOSE'
            AND SPM.entity_id = ${entity_id}
            ORDER BY SPM.id DESC `;

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
                const query = `SELECT SPM.*, SSUM.business_name, SPAL.approval_status, SQM.quotation_doc_code  FROM SALES_PROFORMA_MST AS SPM
                  LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
    LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
                INNER JOIN SALES_PROFORMA_APPROVAL_LEVEL as SPAL ON SPAL.proforma_id = SPM.id WHERE SPM.is_deleted = 0 and SPAL.approval_status = 'REJECTED' AND SPAL.progress_status='CLOSE'
                AND SPM.entity_id = ${entity_id}
                ORDER BY SPM.id DESC`;

                getAllData = await db.sequelize.query(query, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
            }


            else {
                const query = `SELECT SPM.* , SSUM.business_name, SPAL.approval_status, SQM.quotation_doc_code  FROM SALES_PROFORMA_MST AS SPM 
                LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id 
    LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id 
                INNER JOIN SALES_PROFORMA_APPROVAL_LEVEL AS SPAL ON SPAL.proforma_id = SPM.id 
                WHERE SPAL.employee_id = ${loggedEmployeeId} AND SPAL.approval_status = 'REJECTED' AND SPAL.progress_status='CLOSE'
                AND SPM.entity_id = ${entity_id}
                ORDER BY SPM.id DESC `;

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