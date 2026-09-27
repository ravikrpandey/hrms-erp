const db = require("../../../models");
const logger = require("../../../../logger");
const { Op } = require("sequelize");
const { sendRFPMailNegoItem } = require("../../../Recruitment/utils/mail/mail");

class NegotiationController {
  constructor() {}

  async GetAll_Initiate_Nego(req, res) {
    try {
      const { entity_id, financial_year_id } = req.body;
      const getAllData1 = await db.sequelize.query(
        `SELECT DISTINCT PR.pr_number, PR.pr_category, PR.pr_type, PR.pr_date, MD.department_name, PR.id, PR.createdAt,
      VP.purchase_request_id, VP.rfp_status, PR.nego_status, VP.rfp_number
       FROM PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM AS VP
       INNER JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON VP.purchase_request_id = PR.id
       INNER JOIN MASTER_DEPARTMENT AS MD ON PR.department_id = MD.dept_id
       WHERE PR.status = 'ACTIVE' 
       AND VP.rfp_status = 'CLOSE RFP' 
       AND VP.rfp_number NOT IN (
           SELECT VN.rfp_number FROM PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION AS VN WHERE VN.rfp_number IS NOT NULL
       )
       AND VP.rfp_number NOT IN (
           SELECT VQ.rfp_number FROM PROCUREMENT_PURCHASE_VENDOR_QUOTATION AS VQ WHERE VQ.rfp_number IS NOT NULL
       )
       AND PR.entity_id = ${entity_id} 
       AND PR.financial_year_id = ${financial_year_id} 
       ORDER BY PR.id DESC`,
        { type: db.Sequelize.QueryTypes.SELECT },
      );

      const allData = [...getAllData1];
      let unique_id = new Set();
      let uniqueArr = [];

      allData.forEach((i) => {
        const key = i.rfp_number || i.purchase_request_id;
        if (!unique_id.has(key)) {
          unique_id.add(key);
          uniqueArr.push(i);
        }
      });

      uniqueArr = uniqueArr.filter(
        (item) => item.rfp_approvel_status !== "APPROVED",
      );

      if (uniqueArr.length > 0) {
        return res.status(200).json({
          code: 200,
          message: "Data retrieved successfully",
          data: uniqueArr,
        });
      } else {
        return res.status(404).json({ code: 404, message: "No records found" });
      }
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.log(error);
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Internal server error" });
    }
  }

  async generate_Negotiation_id(req, res) {
    try {
      const result = await db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.findOne({
        attributes: ["id"],
        order: [["createdAt", "DESC"]],
      });

      let Negotiation_id;
      if (result === null || result === undefined) {
        Negotiation_id = `Nego-01`;
      } else {
        Negotiation_id = `Nego-${result.id + 1}`;
      }

      return res.status(200).send({
        code: 200,
        message: "Unique Negotiation_id has been Generated",
        data: Negotiation_id,
      });
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Server Error" });
    }
  }

  async sendMailForNegotiation(req, res) {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();
      const { id: procurement_id } = req.params;
      const {
        start_date_nego,
        end_date_nego,
        site_url,
        nego_status,
        item_detail,
        Negotiation_Id,
        procurement_type,
        entity_id,
        department_id,
        financial_year_id,
        rfp_number,
      } = req.body;

      if (!item_detail || item_detail.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          code: 400,
          message: "Item Details are Missing",
        });
      }

      const sentVendors = new Set();
      const emailRecipients = new Set();

      const createNegotiation =
        await db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.create(
          {
            negotiation_code: Negotiation_Id,
            start_date_nego: start_date_nego,
            end_date_nego: end_date_nego,
            nego_status: "LIVE NEGO",
            purchase_request_id: procurement_id,
            rfp_number: rfp_number,
          },
          { transaction },
        );

      for (const item of item_detail) {
        const { item_id, vendor_ids, target_amount } = item;
        if (!vendor_ids || vendor_ids.length === 0) continue;
        for (const vendor of vendor_ids) {
          const vendorId = vendor;
          const uniqueKey = `${item_id}-${vendorId}`;
          if (sentVendors.has(uniqueKey)) continue;
          sentVendors.add(uniqueKey);

          const getAllData = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
            where: {
              [Op.and]: [
                { vendors: vendorId },
                { purchase_request_id: procurement_id },
                { item_id: item_id },
                ...(rfp_number ? [{ rfp_number: rfp_number }] : []),
              ],
            },
            transaction,
          });

          const negotiationItems = [];
          for (const data of getAllData) {
            const item = {
              vendor_id: vendorId,
              negotiation_id: createNegotiation.id,
              price_amt: data.price_amt,
              target_amount: target_amount,
              igst: data.igst,
              sgst: data.sgst,
              cgst: data.cgst,
              delivery_charges: data.delivery_charges,
              additional_charges: data.additional_charges,
              item_id: data.item_id,
              procurement_product_id: data.procurement_product_id,
              // procurement_service_id: data.procurement_service_id,
              // service_id: data.service_id,
              vendor_uploaded_document: data.vendor_uploaded_document,
              currency_id: data.currency_id,
            };
            negotiationItems.push(item);
          }
          await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.bulkCreate(
            negotiationItems,
            { transaction },
          );
          emailRecipients.add(vendorId);
        }
      }

      await createNegotiation.update(
        {
          vendors_invited_count: emailRecipients.size,
        },
        { transaction },
      );

      await db.purchase_details.update(
        { nego_status: nego_status },
        { where: { id: procurement_id }, transaction },
      );

      await transaction.commit();

      for (const vendorId of emailRecipients) {
        const get_vendorData = await db.vendor_basic_details.findOne({
          where: { id: vendorId },
        });

        sendRFPMailNegoItem(
          site_url,
          vendorId,
          Negotiation_Id,
          procurement_id,
          get_vendorData,
          procurement_type,
        );
      }

      return res.status(200).json({
        code: 200,
        message: "Mail Sent Successfully",
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      logger.error(`Error in sendMailForNegotiation ${error.message}`, {
        error,
      });
      console.error(error);
      return res
        .status(500)
        .json({ code: 500, message: error.message || "Server Error" });
    }
  }

  async GetAll_live_Nego(req, res) {
    try {
      const { entity_id, financial_year_id } = req.body;

      const query = `SELECT PVN.id, PVN.stop_nego_date, PVN.approval_status, PVN.start_date_nego, PVN.end_date_nego, 
            PVN.negotiation_code, PVN.nego_status AS nego_status_pvn, MD.department_name, PR.pr_number, PR.pr_category, PVN.purchase_request_id,
            PVN.vendors_responded_count, PVN.vendors_invited_count
        FROM PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION AS PVN
        LEFT JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = PVN.purchase_request_id
        LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        WHERE PR.status = 'ACTIVE' AND 
        PVN.nego_status = 'LIVE NEGO' AND 
        PR.entity_id = ${entity_id} AND 
        PR.financial_year_id = ${financial_year_id}
        ORDER BY PVN.id DESC`;

      const data = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      let uniqueArr = [];
      let unique_id = new Set();
      data.forEach((i) => {
        if (!unique_id.has(i.negotiation_code)) {
          unique_id.add(i.negotiation_code);
          uniqueArr.push(i);
        }
      });

      if (uniqueArr.length > 0) {
        return res.status(200).json({
          code: 200,
          message: "Data retrieved successfully",
          data: uniqueArr,
        });
      } else {
        return res.status(404).json({
          code: 404,
          message: "No records found",
          data: [],
        });
      }
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: error.message || "Server Error",
      });
    }
  }

  async getAllVendorsForNegotiation(req, res) {
    try {
      const purchase_request_id = req.params.id;
      const data = await db.PROCUREMENT_PURCHASE_VENDOR_RFP.findAll({
        where: {
          purchase_request_id: purchase_request_id,
        },
      });

      if (!data || data.length === 0) {
        return res.status(404).json({
          code: 404,
          message: "No data found for the provided RFP number",
        });
      }

      const vendorsSet = new Set();
      data.forEach((item) => vendorsSet.add(item.vendors));
      const vendors = [...vendorsSet];

      const vendorName = await db.vendor_basic_details.findAll({
        where: {
          id: vendors,
        },
        attributes: ["vendor_name", "id"],
      });

      return res.status(200).json({
        code: 200,
        message: "Data retrieved successfully",
        data: vendorName,
      });
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res.status(500).json({ code: 500, message: "Server Error" });
    }
  }

  async stop_live_negotiation(req, res) {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();
      const procurement_id = req.params.id;
      const { nego_status, stop_nego_date } = req.body;

      if (!procurement_id) {
        return res
          .status(400)
          .send({ code: 400, message: "Procurement ID is required" });
      }
      await db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.update(
        { stop_nego_date: stop_nego_date, nego_status: nego_status },
        { where: { purchase_request_id: procurement_id } },
        { transaction },
      );

      await db.purchase_details.update(
        { nego_status: nego_status },
        { where: { id: procurement_id } },
        { transaction },
      );

      await transaction.commit();
      return res
        .status(200)
        .send({ code: 200, message: "RFP stopped successfully" });
    } catch (error) {
      if (transaction) await transaction.rollback();
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  async GetAll_CloseNego(req, res) {
    try {
      const { entity_id, financial_year_id } = req.body;

      const query = `SELECT VND.id, VND.stop_nego_date, VND.approval_status, VND.start_date_nego, VND.end_date_nego, VND.negotiation_code, VND.nego_status as nego_status_pvn, MD.department_name, PR.pr_number, PR.pr_category, VND.purchase_request_id
        FROM PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION AS VND
        LEFT JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = VND.purchase_request_id
        LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        WHERE PR.status = 'ACTIVE' AND 
        VND.nego_status = 'CLOSE Nego' AND 
        PR.entity_id = ${entity_id} AND 
        PR.financial_year_id = ${financial_year_id}
        ORDER BY VND.id DESC`;

      const data = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      let uniqueArr = [];
      let unique_id = new Set();
      data.forEach((i) => {
        if (!unique_id.has(i.negotiation_code)) {
          unique_id.add(i.negotiation_code);
          uniqueArr.push(i);
        }
      });

      if (uniqueArr.length > 0) {
        return res.status(200).json({
          code: 200,
          message: "Data retrieved successfully",
          data: uniqueArr,
        });
      } else {
        return res
          .status(404)
          .json({ code: 404, message: "No records found", data: [] });
      }
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.log(error);
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Internal server error" });
    }
  }

  async getAllNegoData(req, res) {
    try {
      const { entity_id, financial_year_id } = req.body;

      const query = `SELECT VND.id, VND.stop_nego_date, VND.approval_status, VND.start_date_nego, VND.end_date_nego, VND.negotiation_code, VND.nego_status, MD.department_name, PR.pr_number, PR.pr_category, VND.purchase_request_id
        FROM PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION AS VND
        LEFT JOIN PROCUREMENT_PURCHASE_REQUEST AS PR ON PR.id = VND.purchase_request_id
        LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        WHERE PR.status = 'ACTIVE' AND 
        PR.entity_id = ${entity_id} AND 
        PR.financial_year_id = ${financial_year_id}
        ORDER BY VND.id DESC`;

      const data = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      let uniqueArr = [];
      let unique_id = new Set();
      data.forEach((i) => {
        if (!unique_id.has(i.negotiation_code)) {
          unique_id.add(i.negotiation_code);
          uniqueArr.push(i);
        }
      });

      if (uniqueArr.length > 0) {
        return res.status(200).send({
          code: 200,
          message: "Data Fetched Successfully",
          data: uniqueArr,
        });
      } else {
        return res.status(404).send({
          code: 404,
          message: "No records found",
          data: [],
        });
      }
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Internal Server Error" });
    }
  }

  async generate_Nego_Approval_Id(req, res) {
    try {
      const result = await db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.findOne({
        attributes: ["quotation_code"],
        order: [["createdAt", "DESC"]],
      });

      let nego_approval_id;
      if (result && result.quotation_code) {
        let lastId = result.quotation_code.split("-").pop();
        let newId = parseInt(lastId) + 1;
        nego_approval_id = `Nego-Approval-${newId}`;
      } else {
        nego_approval_id = "Nego-Approval-1";
      }
      return res.status(200).send({
        code: 200,
        message: "Unique Nego-Approval Id has been Generated",
        data: nego_approval_id,
      });
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  async getAllDataForApprovalNegotiation(req, res) {
    try {
      const purchase_request_id = req.params.id;
      const { negotiation_code } = req.query;
      if (purchase_request_id) {
        const negoWhere = { purchase_request_id };
        if (negotiation_code) {
          negoWhere.negotiation_code = negotiation_code;
        }
        const negotiationData =
          await db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.findOne({
            where: negoWhere,
            order: [["id", "DESC"]],
          });
        const negotiationVendor =
          await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findAll({
            where: {
              negotiation_id: negotiationData.id,
            },
            attributes: [
              "vendor_id",
              "price_amt",
              "item_id",
              "service_id",
              "checked",
            ],
          });
        const vendorIds = [
          ...new Set(negotiationVendor.map((entry) => entry.vendor_id)),
        ];
        const vendorDetails = await db.vendor_basic_details.findAll({
          where: {
            id: vendorIds,
          },
          attributes: ["id", "vendor_name"],
        });
        const vendorNameMap = vendorDetails.reduce((map, vendor) => {
          map[vendor.id] = vendor.vendor_name;
          return map;
        }, {});
        const itemIds = [
          ...new Set(negotiationVendor.map((entry) => entry.item_id)),
        ];
        const productDetails = await db.ItemMaster.findAll({
          where: {
            id: itemIds,
          },
          attributes: ["id", "item_name"],
        });
        const itemDetailsMap = productDetails.reduce((map, item) => {
          map[item.id] = item.item_name;
          return map;
        }, {});

        const groupedData = vendorIds.map((vendorId) => {
          const vendorItems = negotiationVendor
            .filter((entry) => entry.vendor_id === vendorId)
            .map((entry) => ({
              item_name: itemDetailsMap[entry.item_id],
              price_amt: entry.price_amt,
              item_id: entry.item_id,
              service_id: entry.service_id,
              checked: entry.checked,
            }));
          return {
            vendor_id: vendorId,
            vendor_name: vendorNameMap[vendorId],
            items: vendorItems,
          };
        });
        return res.status(200).send({
          code: 200,
          message: "Data Fetched Successfully!",
          data: groupedData,
        });
      } else {
        return res.status(403).send({
          code: 403,
          message: "No Record Found !",
        });
      }
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  async getVendrosDataById(req, res) {
    try {
      const All_id = req.params.id;
      const splitData = All_id.split(",");
      const nego_id = splitData[0];
      const vendor_id = splitData.slice(1);

      const negotiation =
        await db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.findOne({
          where: {
            negotiation_code: nego_id,
          },
        });
      const vendorData = await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findAll(
        {
          where: {
            negotiation_id: negotiation.dataValues.id,
            vendor_id: vendor_id,
          },
          attributes: ["item_id"],
        },
      );
      const item_id = vendorData.map((data) => data.item_id);

      const query = `
        SELECT PR.id, PR.pr_number, PR.pr_category, PR.pr_type, PR.createdAt, PR.rfp_delivery_date, MD.department_name, PR.department_id, 
        CONCAT(HR.first_name, ' ', HR.last_name) AS employee_name, VP.negotiation_code, VP.id as negotiation_id
        FROM PROCUREMENT_PURCHASE_REQUEST AS PR
        LEFT JOIN PROCUREMENT_PURCHASE_REQUEST_ITEM AS PR_ITEM ON PR.id = PR_ITEM.purchase_request_id
        INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = PR.department_id
        INNER JOIN HRMS_REGISTERED_USER AS HR ON HR.employee_id = PR.employee_id
        INNER JOIN PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION AS VP ON VP.purchase_request_id = PR.id
        WHERE PR.id IN (${negotiation.dataValues.purchase_request_id}) AND 
        PR_ITEM.item_master_id IN (${item_id.join(",")})`;

      const [prData] = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      if (!prData) {
        return res.status(404).json({
          code: 404,
          message: "No records found",
          data: [],
        });
      }

      const query2 = `
        SELECT VND.*, MI.item_name, MI.item_code, PI.quantity, PI.priority
        FROM PROCUREMENT_PURCHASE_NEGOTIATION_ITEM AS VND
        INNER JOIN MASTER_ITEM AS MI ON MI.id = VND.item_id
        INNER JOIN PROCUREMENT_PURCHASE_REQUEST_ITEM AS PI ON PI.id = VND.procurement_product_id
        WHERE VND.negotiation_id = :negotiation_id AND VND.vendor_id IN (:vendor_id)
        `;
      const rawData = await db.sequelize.query(query2, {
        replacements: {
          negotiation_id: negotiation.dataValues.id,
          vendor_id: vendor_id,
        },
        type: db.sequelize.QueryTypes.SELECT,
      });

      const VData = rawData.map((v) => ({
        ...v,
        checked: !!v.checked,
        vendor_responded: !!v.vendor_responded,
        // re_negotiation: !!v.re_negotiation,
      }));

      return res.status(200).send({
        code: 200,
        message: "Fetch data successfully",
        data: {
          prData: prData,
          itemData: VData,
        },
      });
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.error(error);
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Server Error" });
    }
  }

  async updateVendorsBid(req, res) {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();
      const vendor_id = req.params.id;
      const { item_details, is_submitted, vendor_remarks, negotiation_id } =
        req.body;

      if (!Array.isArray(item_details)) {
        if (transaction) await transaction.rollback();
        return res
          .status(400)
          .json({ code: 400, message: "item_details should be an array" });
      }

      // Update each item Detail with the new bid values
      for (const item of item_details) {
        await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.update(
          {
            price_amt: item.price_amt,
            igst: item.igst,
            cgst: item.cgst, // Added for completeness
            sgst: item.sgst, // Added for completeness
            delivery_charges: item.delivery_charges,
            additional_charges: item.additional_charges,
            vendor_responded: is_submitted,
            vendor_remarks: vendor_remarks,
          },
          {
            where: {
              vendor_id: vendor_id,
              negotiation_id: negotiation_id,
              item_id: item.item_id,
            },
            transaction,
          },
        );
      }

      // Calculate the total unique vendors who have responded to this specific negotiation
      const respondedVendorsCount =
        await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.count({
          where: {
            negotiation_id: negotiation_id,
            vendor_responded: true,
          },
          distinct: true,
          col: "vendor_id",
          transaction,
        });

      // Update the master negotiation record with the updated response count
      await db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.update(
        { vendors_responded_count: respondedVendorsCount },
        {
          where: { id: negotiation_id },
          transaction,
        },
      );

      await transaction.commit();

      return res.status(200).json({
        code: 200,
        message: "Negotiation Quotation Submitted Successfully",
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      logger.error(`Error in updateVendorsBid: ${error.message}`, { error });
      console.error(error);
      return res
        .status(500)
        .json({ code: 500, message: error.message || "Server Error" });
    }
  }

  async update_endDate_for_negotiation(req, res) {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();
      const procurement_id = req.params.id;
      const { end_date_nego } = req.body;

      const updateData1 =
        await db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.update(
          { end_date_nego: end_date_nego },
          { where: { purchase_request_id: procurement_id } },
          transaction,
        );
      if (updateData1[0]) {
        await transaction.commit();
        return res
          .status(200)
          .send({ code: 200, message: "End Date Updated Successfully" });
      } else {
        await transaction.rollback();
        return res.status(403).send({ code: 403, message: "Record Not Found" });
      }
    } catch (error) {
      if (transaction) await transaction.rollback();
      logger.error(`Error ${error.message}`, { error });
      console.log(error);
      return res.status(500).send({ code: 500, message: "Server Error" });
    }
  }

  async getItemByLowestPriceForNego(req, res) {
    try {
      const procurement_id = req.params.id;
      const { negotiation_code, negotiation_id } = req.query;
      const negoWhere = { purchase_request_id: procurement_id };
      if (negotiation_id) {
        negoWhere.id = negotiation_id;
      } else if (negotiation_code) {
        negoWhere.negotiation_code = negotiation_code;
      }
      const negotiationData =
        await db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.findOne({
          where: negoWhere,
          order: [["id", "DESC"]],
        });
      const negotiationVendor =
        await db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.findAll({
          where: {
            negotiation_id: negotiationData.id,
          },
          attributes: [
            "vendor_id",
            "procurement_product_id",
            // "procurement_service_id",
            "createdAt",
            "price_amt",
            "delivery_charges",
            "additional_charges",
            "igst",
          ],
          order: [["price_amt", "ASC"]],
        });
      const vendorIds = negotiationVendor.map((vendor) => vendor.vendor_id);

      const vendorNames = await db.vendor_basic_details.findAll({
        where: {
          id: vendorIds,
        },
        attributes: ["vendor_name", "id"],
      });

      const vendorNameMap = {};
      vendorNames.forEach((vendor) => {
        vendorNameMap[vendor.id] = vendor.vendor_name;
      });

      const getItemName = async (vendor) => {
        if (vendor.procurement_product_id) {
          const ItemName = await db.purchase_item.findOne({
            where: {
              id: vendor.procurement_product_id,
            },
            attributes: ["item_master_id"],
          });
          if (ItemName) {
            const itemNameDetails = await db.ItemMaster.findOne({
              where: {
                id: ItemName.item_master_id,
              },
              attributes: ["item_name"],
            });
            return itemNameDetails ? itemNameDetails.item_name : null;
          }
        }
        return null;
      };

      // const getServiceName = async (vendor) => {
      //   if (vendor.procurement_service_id) {
      //     const ServiceName = await db.purchase_service.findOne({
      //       where: {
      //         id: vendor.procurement_service_id,
      //       },
      //       attributes: ["service_master_id"],
      //     });
      //     if (ServiceName) {
      //       const serviceNameDetails = await db.Service_master.findOne({
      //         where: {
      //           service_id: ServiceName.service_master_id,
      //         },
      //         attributes: ["service_name"],
      //       });
      //       return serviceNameDetails ? serviceNameDetails.service_name : null;
      //     }
      //   }
      //   return null;
      // };

      // const getBOMName = async (vendor) => {
      //   if (vendor.procurement_bomItem_id) {
      //     const bomItem = await Procurement_BomItemDetails.findOne({
      //       where: {
      //         procurement_bomItem_id: vendor.procurement_bomItem_id,
      //       },
      //       attributes: ["product_name"],
      //     });
      //     return bomItem ? bomItem.product_name : null;
      //   }
      //   return null;
      // };

      const groupedData = {};

      for (const vendor of negotiationVendor) {
        const itemName = await getItemName(vendor);
        // const serviceName = await getServiceName(vendor);
        // const bomName = await getBOMName(vendor);

        const vendorData = {
          vendor_id: vendor.vendor_id,
          vendor_name: vendorNameMap[vendor.vendor_id],
          price_amt: vendor.price_amt,
          delivery_charges: vendor.delivery_charges,
          additional_charges: vendor.additional_charges,
          igst: vendor.igst,
          currency_type: vendor.currency_type || "INR",
          itemName,
          // serviceName,
          // bomName,
          createdAt: vendor.createdAt,
        };

        // const key = itemName || serviceName || bomName;
        const key = itemName || serviceName;

        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push(vendorData);
      }

      const levelsWithData = {
        Level1: [],
        Level2: [],
        Level3: [],
        Extra: [],
      };

      for (const key in groupedData) {
        const filteredVendors = groupedData[key].filter(
          (vendor) => vendor.price_amt !== null || 0,
        );
        const sortedVendors = filteredVendors.sort(
          (a, b) => a.price_amt - b.price_amt,
        );

        if (sortedVendors.length > 0) {
          levelsWithData.Level1.push(sortedVendors[0]);
        }
        if (sortedVendors.length > 1) {
          levelsWithData.Level2.push(sortedVendors[1]);
        }
        if (sortedVendors.length > 2) {
          levelsWithData.Level3.push(sortedVendors[2]);
        }
        if (sortedVendors.length > 3) {
          for (let i = 3; i < sortedVendors.length; i++) {
            levelsWithData.Extra.push(sortedVendors[i]);
          }
        }
      }

      const additionalInfo = {
        createdAt: negotiationData.createdAt,
        stop_nego_date: negotiationData.stop_nego_date,
        start_date_nego: negotiationData.start_date_nego,
        end_date_nego: negotiationData.end_date_nego,
        remarks_approval: negotiationData.remarks_approval,
        approval_status: negotiationData.approval_status,
      };

      return res.status(200).send({
        code: 200,
        message: "Data Fetched Successfully",
        data: levelsWithData,
        additionalInfo,
      });
    } catch (error) {
      logger.error(`Error ${error.message}`, { error });
      console.log(error);
      return res
        .status(500)
        .send({ code: 500, message: error.message || "Internal Server Error" });
    }
  }
}

module.exports = new NegotiationController();
