const db = require('../../../models/index');

const salesInvoice = db.salesInvoice;
const invoiceApprovalLevel = db.salesInvoiceApprovalLevel;
const userDetails = db.user;
const { Op, where } = require("sequelize");

module.exports.createSalesInvoice = async (req, res) => {

    try {

        let id = req.params?.id;
        const {
            invoice_doc_code, supply_now, sales_invoice_create_date, payment_due_days, due_charges, department_id, details_photo, entity_id, proforma_id, user_id } = req.body;
        if (id != undefined && id != null && id != '' && id != 'undefined') {
            let updateSalesInvoice = await db.salesInvoice.update({

                supply_now,
                sales_invoice_create_date,
                payment_due_days,
                department_id,
                details_photo,
                due_charges,
                entity_id,
                proforma_id
            }, { where: { id: id } });

            if (updateSalesInvoice) {
                return res.status(200).send({ code: 200, message: 'Invoice Updated Successfully' });
            }
            else {
                return res.status(400).send({ code: 400, message: 'Update Failed!' });
            }

        }
        else {

            const [query] = await db.sequelize.query(`
                SELECT WFM.job_name, WR.employee_id, WR.role_id, WR.level, WR.id
                FROM ESS_WORK_FLOW_MASTER AS WFM
                LEFT JOIN ESS_WORKFLOW_RANGE AS WR ON WR.workflow_id = WFM.id
                WHERE WFM.status = 'ACTIVE' AND WFM.isDeleted = 0 AND WFM.department_id = ${department_id} AND
                WR.status = 'ACTIVE' AND WR.isDeleted = 0 AND WFM.job_name = 'Sales Invoice'
            `);

            if (query.length > 0) {
                console.log(query);

                let createSalesInvoice = await db.salesInvoice.create({

                    supply_now,
                    sales_invoice_create_date,
                    payment_due_days,
                    department_id,
                    details_photo,
                    due_charges,
                    entity_id,
                    proforma_id,
                    invoice_doc_code,
                    user_id,
                    status: 'PENDING'
                });

                if (createSalesInvoice) {

                    const newInvoiceId = createSalesInvoice.id;

                    const approvalLevels = query.map(item => ({
                        level: item.level,
                        employee_id: item.employee_id,
                        // role_id: item.role_id,
                        sales_invoice_id: newInvoiceId,
                        workflow_range_id: item.id
                    }));


                    await db.salesInvoiceApprovalLevel.bulkCreate(approvalLevels);
                    await db.proforma.update({ sales_created: true }, { where: { id: proforma_id, is_deleted: false } });


                    return res.status(200).send({ code: 200, message: 'Sales Invoice Created Successfully' });
                } else {
                    return res.status(400).send({ code: 400, message: 'Error creating Invoice' });
                }
            } else {
                return res.status(501).send({ code: 501, message: 'Sales invoice workflow is not created for your department.' });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: error.message });
    }
};

exports.approvedSalesInvoiceById = async (req, res) => {
    try {
        const invoice_id = req.params?.invoice_id;
        const {
            remarks, emp_id, approval_status, progress_status
        } = req.body;
        let updateData;


        if (approval_status == 'REJECTED') {


            await salesInvoice.update({ status: 'REJECTED' }, { where: { id: invoice_id } });

            updateData = await invoiceApprovalLevel.update(
                {
                    approval_status: approval_status,
                    progress_status: progress_status,
                    remarks: remarks
                },
                {
                    where: {
                        employee_id: emp_id,
                        sales_invoice_id: invoice_id
                    },
                }
            );

        } else {
            updateData = await invoiceApprovalLevel.update(
                {
                    approval_status: approval_status,
                    progress_status: progress_status,
                    remarks: remarks
                },
                {
                    where: {
                        employee_id: emp_id,
                        sales_invoice_id: invoice_id
                    },
                }
            );
        }

        if (approval_status == 'APPROVED') {
            const allLevelsData = await invoiceApprovalLevel.findAll({
                where: {
                    employee_id: emp_id,
                    sales_invoice_id: invoice_id
                },
                order: [["level", "ASC"]],
            });

            let maxLevel;
            if (allLevelsData !== null) {
                maxLevel = await invoiceApprovalLevel.max('level', {
                    where: { sales_invoice_id: invoice_id }
                });
            }

            const currentLevel = await invoiceApprovalLevel.findOne({
                attributes: ["level"],
                where: {
                    employee_id: emp_id,
                    sales_invoice_id: invoice_id
                },
            });

            const maxLevelValue = maxLevel;

            const currentLevelValue = currentLevel.level;

            if (maxLevelValue !== null && currentLevelValue !== null && currentLevelValue === maxLevelValue) {
                const currentApprovelStatus = await salesInvoice.findOne({
                    where: { id: invoice_id },
                });

                if (currentApprovelStatus !== null) {
                    const finalApproved = await salesInvoice.update(
                        { status: "APPROVED" },
                        { where: { id: invoice_id } }
                    );

                    return res.status(200).send({
                        code: 200,
                        message: "Invoice Approved Successfully. This One must be the last level.",
                        data: finalApproved,
                    });
                }
            }
        }

        if (updateData !== 0) {
            return res.status(200).send({
                code: 200,
                message: "Sales Invoice Approval Successfully",
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

exports.getAllSalesInvoiceApprovalLevel = async (req, res) => {
    try {

        const sales_invoice_id = req.params?.sales_invoice_id;

        const getData = await invoiceApprovalLevel.findAll({
            where: {
                [Op.and]: [
                    { sales_invoice_id: sales_invoice_id },
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

module.exports.getPendingInvoiceByDepId = async (req, res) => {
    try {

        let entity_id = req.params?.entity_id;
        let dep_id = req.params?.dep_id;
        const [query] = await db.sequelize.query(`SELECT SIM.* , SFM.delivery_date, SSUM.business_name, SFM.proforma_doc_code  FROM SALES_INVOICE_MST AS SIM
LEFT JOIN SALES_PROFORMA_MST AS SFM ON SFM.id = SIM.proforma_id
LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SFM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SFM.customer_id
WHERE SIM.is_deleted = 0 AND SIM.entity_id = ${entity_id} AND SIM.department_id = ${dep_id} AND SIM.status = 'PENDING' `);



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
        return res.status(500).send({ code: 500, message: error.message });
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
                    return res.status(200).send({ code: 200, message: 'Success', data: newData });

                }

            }
        } else {
            return res.status(200).send({ code: 404, message: 'No Quotation Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
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


module.exports.getInvoiceApprovedDataByCustomerId = async (req, res) => {
    try {

        let entity_id = req.params?.entity_id;
        let customer_id = req.params?.customer_id;
        const [query] = await db.sequelize.query(`SELECT SIM.* , SFM.delivery_date, SSUM.business_name, SFM.proforma_doc_code  FROM SALES_INVOICE_MST AS SIM
LEFT JOIN SALES_PROFORMA_MST AS SFM ON SFM.id = SIM.proforma_id
LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SFM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SFM.customer_id
WHERE SIM.is_deleted = 0 AND SIM.entity_id = ${entity_id} AND SIM.user_id = ${customer_id} AND SIM.status = 'APPROVED' `);


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

module.exports.getInvoiceRejectedDataByCustomerId = async (req, res) => {
    try {

        let entity_id = req.params?.entity_id;
        let customer_id = req.params?.customer_id;
        const [query] = await db.sequelize.query(`SELECT SIM.* ,SFM.delivery_date, SSUM.business_name, SFM.proforma_doc_code  FROM SALES_INVOICE_MST AS SIM
LEFT JOIN SALES_PROFORMA_MST AS SFM ON SFM.id = SIM.proforma_id
LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SFM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SFM.customer_id
WHERE SIM.is_deleted = 0 AND SIM.entity_id = ${entity_id} AND SIM.user_id = ${customer_id} AND SIM.status = 'REJECTED'`);


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

module.exports.updateInvoiceStatus = async (req, res) => {
    try {

        const updateStatus = await db.salesInvoice.update({ status: req.params.status },
            { where: { id: req.params.id } });
        if (updateStatus) {
            return res.status(200).send({ code: 200, message: 'Status Updated Successfully' });
        } else {
            return res.status(200).send({ code: 404, message: 'No Invoice Found with given ID' });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}

module.exports.getPorformaDocCode = async (req, res) => {
    try {
        const entity_id = req.params?.entity_id;
        const getApprovedPorforma = await db.proforma.findAll({
            where: { is_deleted: false, status: 'APPROVED', entity_id: entity_id },
            order: [
                ['id', 'DESC']
            ]
        });
        if (getApprovedPorforma) {
            return res.status(200).send({ code: 200, message: 'Success', data: getApprovedPorforma });
        } else {
            return res.status(200).send({ code: 404, message: 'No Porforma Found' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};


module.exports.getApprovedProformaDetailById = async (req, res) => {
    try {

        let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT SQM.*,SPM.*, MA.asset_category_name, SSUM.business_name, concat(HRU.first_name, ' ', HRU.last_name) AS employee_name FROM SALES_PROFORMA_MST AS SPM 
LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
LEFT JOIN MASTER_ASSET AS MA ON MA.id = SQM.category_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id 
LEFT JOIN SALES_SUPER_USER_MST AS SSSM ON SSSM.id = SQM.customer_id 
LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = SQM.sales_rep_id 
WHERE SPM.is_deleted = 0 AND SPM.id = ${id}`);


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

module.exports.getQuotationItemDetailByPorformaId = async (req, res) => {
    try {
        let id = req.params?.id;
        const getApprovedQuotationsItem = await db.quotation_Items.findAll({ where: { quotation_id: id } });
        if (getApprovedQuotationsItem) {
            return res.status(200).send({ code: 200, message: 'Success', data: getApprovedQuotationsItem });
        } else {
            return res.status(200).send({ code: 404, message: 'No Quotations Found' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
};



module.exports.getApprovedSalesInvoiceDetailById = async (req, res) => {
    try {
        let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT SIM.*, SPM.quotation_id, SSUM.business_name AS customer_name, SSUM.shipping_address, SSUM.shipping_zip_code, MC.countryss_name, CITY.city_name, MS.states_name FROM SALES_INVOICE_MST AS SIM 
LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id 
LEFT JOIN MASTER_COUNTRY AS MC ON MC.countryss_id = SSUM.shipping_country_id
LEFT JOIN MASTER_CITY AS CITY ON CITY.city_id = SSUM.shipping_city_id
LEFT JOIN MASTER_STATE AS MS ON MS.states_id = SSUM.shipping_state_id
WHERE SIM.is_deleted = 0 AND SIM.id = ${id}`);


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



module.exports.getApprovedSalesInvoices = async (req, res) => {
    try {
        let id = req.params?.id;
        const [query] = await db.sequelize.query(`SELECT * FROM SALES_INVOICE_MST WHERE status = 'APPROVED' AND is_deleted= 0 AND entity_id=${id}`);


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


module.exports.getSaleInvoiceById = async (req, res) => {
    try {
        let id = req.params?.id;
        const [query] = await db.sequelize.query(`
  SELECT SIM.*,SIM.details_photo AS photo,SQM.*,SPM.*, MA.asset_category_name, SSUM.business_name,SSSM.business_name AS ship_to_customer_name, concat(HRU.first_name, ' ', HRU.last_name) AS employee_name FROM SALES_INVOICE_MST AS SIM 
  LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
  LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
  LEFT JOIN MASTER_ASSET AS MA ON MA.id = SQM.category_id
  LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id 
  LEFT JOIN SALES_SUPER_USER_MST AS SSSM ON SSSM.id = SQM.customer_id 
  LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = SQM.sales_rep_id 
  WHERE SIM.id = ${id}`);


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

module.exports.getAllInvoiceData = async (req, res) => {
    try {
        const loggedEmployeeId = req.params.id;
        const loggedUserRole = req.query.role;
        const { id } = req.params;
        const { status, entity_id } = req.query;

        if (status == "PENDING") {
            const query = `SELECT SIM.* , SPM.delivery_date, SSUM.business_name, SPM.proforma_doc_code FROM SALES_INVOICE_MST AS SIM 
            LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
            LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
    LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
          LEFT JOIN SALES_INVOICE_APPROVAL_LEVEL as la ON la.sales_invoice_id=SIM.id AND la.employee_id= ${loggedEmployeeId} WHERE la.approval_status='PENDING' AND SIM.id IN (
              SELECT pa.sales_invoice_id FROM SALES_INVOICE_APPROVAL_LEVEL AS pa 
              WHERE pa.employee_id = ${loggedEmployeeId} 
              AND (
                  (pa.level = 1)
                  OR 
                  (
                      pa.level > 1 
                      AND 
                      (
                          SELECT COUNT(pl.id) 
                          FROM SALES_INVOICE_APPROVAL_LEVEL AS pl 
                          WHERE pl.sales_invoice_id = pa.sales_invoice_id 
                          AND pl.level = (pa.level - 1)  
                          AND pl.approval_status = 'APPROVED' 
                          AND pl.progress_status = 'CLOSE'
                      ) > 0
                  )
              )
          )
              AND SIM.entity_id = ${entity_id} ORDER BY SIM.id DESC `;
            const data = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
            });
            return res.status(200).json({ code: 200, message: "Success", data: data });
        }


        if (status == "ALL") {
            const [query] = await db.sequelize.query(`SELECT SIM.* ,SFM.delivery_date, SFM.proforma_doc_code,SSUM.business_name,SQIM.deliveryQty,SQIM.quantity FROM SALES_INVOICE_MST AS SIM
LEFT JOIN SALES_PROFORMA_MST AS SFM ON SFM.id = SIM.proforma_id
LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SFM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id LEFT JOIN SALES_QUOTATIONS_ITEMS_MST AS SQIM ON SFM.quotation_id = SQIM.quotation_id
WHERE SIM.is_deleted = 0 AND SIM.entity_id = ${entity_id} AND SIM.user_id = ${loggedEmployeeId}`);


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
                const query = `SELECT SIM.*, SPM.delivery_date, SSUM.business_name, SIAL.approval_status, SPM.proforma_doc_code  FROM SALES_INVOICE_MST AS SIM
                LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
                LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
    LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
                INNER JOIN SALES_INVOICE_APPROVAL_LEVEL AS SIAL ON SIAL.sales_invoice_id = SIM.id WHERE SIM.is_deleted = 0 and SIAL.approval_status = 'APPROVED' AND SIAL.progress_status='CLOSE' 
                 AND SIM.entity_id = ${entity_id}
                ORDER BY SIM.id DESC `;

                getAllData = await db.sequelize.query(query, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
            } else {
                const query = `SELECT SIM.*, SPM.delivery_date, SSUM.business_name, SIAL.approval_status, SPM.proforma_doc_code FROM SALES_INVOICE_MST AS SIM 
                LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
                LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
    LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
    
                INNER JOIN SALES_INVOICE_APPROVAL_LEVEL AS SIAL ON SIAL.sales_invoice_id = SIM.id 
                WHERE SIAL.employee_id = ${loggedEmployeeId} AND SIAL.approval_status = 'APPROVED' AND SIAL.progress_status='CLOSE' 
                AND SIM.entity_id = ${entity_id}
                ORDER BY SIM.id DESC `;

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
                const query = `SELECT SIM.*, SSUM.business_name, SPM.delivery_date, SIAL.approval_status, SPM.proforma_doc_code  FROM SALES_INVOICE_MST AS SIM
            LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
            LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
            INNER JOIN SALES_INVOICE_APPROVAL_LEVEL AS SIAL ON SIAL.sales_invoice_id = SIM.id WHERE SIM.is_deleted = 0 and SIAL.approval_status = 'REJECTED' AND SIAL.progress_status='CLOSE' 
             AND SIM.entity_id = ${entity_id}
            ORDER BY SIM.id DESC `;

                getAllData = await db.sequelize.query(query, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
            } else {
                const query = `SELECT SIM.*, SIAL.approval_status, SPM.delivery_date, SSUM.business_name,SPM.proforma_doc_code FROM SALES_INVOICE_MST AS SIM 
            LEFT JOIN SALES_PROFORMA_MST AS SPM ON SPM.id = SIM.proforma_id
            LEFT JOIN SALES_QUOTATIONS_MST AS SQM ON SQM.id = SPM.quotation_id
LEFT JOIN SALES_SUPER_USER_MST AS SSUM ON SSUM.id = SQM.customer_id
            INNER JOIN SALES_INVOICE_APPROVAL_LEVEL AS SIAL ON SIAL.sales_invoice_id = SIM.id 
            WHERE SIAL.employee_id = ${loggedEmployeeId} AND SIAL.approval_status = 'REJECTED' AND SIAL.progress_status='CLOSE' 
             AND SIM.entity_id = ${entity_id}
            ORDER BY SIM.id DESC `;

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



