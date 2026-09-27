const db = require("../../../app/models/index");
const logger = require("../../../logger/index");
const CryptoJS = require("crypto-js");
var bcrypt = require("bcryptjs");

exports.get_by_vendorID = async (req, res) => {
  try {
    const { id } = req.params;
    let query = `SELECT V.*,C.Currency_Type,C.symbols FROM VENDOR_BASIC_DETAILS AS V 
        LEFT JOIN MASTER_CURRENCY_CONVERT AS C ON C.Currency_Convert_id = V.currency_id
        WHERE V.id = :id`;
    const response = await db.sequelize.query(query, {
      replacements: { id },
      type: db.Sequelize.QueryTypes.SELECT,
    });
    //return res.status(200).send({code: 200,message: "Fetched Vendor Details Successfully!", data: response[0]});

    //     const [vendor_data] = await db.sequelize.query(
    //         `SELECT DISTINCT VB.id , VB.vendor_name,VB.vendor_address,VB.vendor_po,VB.vendor_contact_num,VB.vendor_alt_num,
    //    VB.vendor_email, VB.vendor_web_site,VB.vendor_auto_code,VB.number_code_alternative,VB.vendor_currency,VB.vendor_category,VB.cc_account_code,
    //    VB.sns_details_security,VB.pgc_account,VB.non_registered,VB.supplier_for_cash_pur,VB.item_categray_id, VB.contact_detail,VB.alt_contact_detail,
    //    VB.phone_code,VB.vendor_city_id,VB.vendor_state_id,VB.vendor_country_id,MA.asset_category_name,
    //    MC.city_name,MS.states_name,M.countryss_name,VB.vendor_type_id,VM.vendor_type,VB.advanced_chart_of_account_id,
    //    VB.replacement_clause,VB.resume_validi,VB.commission,CA.account_name,VB.chart_of_account_id,VB.isChecked,VB.rate,VB.time_periods_from,time_periods_to,VB.certificate_doc,VB.isChecked_194,VB.rate_194,VB.declaration_doc,VB.from_month,VB.to_month
    //    FROM VENDOR_BASIC_DETAILS AS VB
    //    LEFT JOIN MASTER_ASSET AS MA ON MA.id = VB.item_categray_id
    //    LEFT JOIN MASTER_CITY AS MC ON MC.city_id = VB.vendor_city_id
    //    LEFT JOIN MASTER_STATE AS MS ON MS.states_id = VB.vendor_state_id
    //    LEFT JOIN MASTER_COUNTRY AS M ON M.countryss_id = VB.vendor_country_id
    //    LEFT JOIN VENDOR_TYPE_MASTER as VM ON VB.vendor_type_id=VM.id
    //    LEFT JOIN CHART_OF_ACCOUNTS AS CA ON CA.id = VB.chart_of_account_id
    //    WHERE VB.id = ${id} AND VB.isDeleted = false`,
    //     );
    //     const [basic_details] = await db.sequelize.query(
    //         `SELECT DISTINCT VBD.id,VBD.name,VBD.contact_num,VBD.email,VBD.designation_name,
    //    VBD.department_name,VBD.vendor_basic_id,VBD.number_code_child
    //    FROM VENDOR_BASIC_DETAILS_MAPPING AS VBD
    //    WHERE VBD.vendor_basic_id = ${id} AND VBD.isDeleted = false`,
    //     );
    const [bank_details] = await db.sequelize.query(
      `SELECT DISTINCT V.id,V.branch_name,V.vendor_basic_id,V.account_holder_name,V.unique_number_bank,V.bank_address,
       V.bank_account_number,V.swift_code,V.iban_code,V.bank_state_id,V.bank_country_id,V.bank_city_id,
       MCB.city_name,MSB.states_name,MB.countryss_name,V.bank_name AS bank_id
       FROM VENDOR_BANK_DETAILS_MAPPING AS V
       INNER JOIN MASTER_CITY AS MCB ON MCB.city_id = V.bank_city_id
       INNER JOIN MASTER_STATE AS MSB ON MSB.states_id = V.bank_state_id
       INNER JOIN MASTER_COUNTRY AS MB ON MB.countryss_id = V.bank_country_id
       
       WHERE V.vendor_basic_id = ${id} AND V.isDeleted = false`,
    );
    const [doc_details] = await db.sequelize.query(
      `SELECT DISTINCT VM.id,VM.document_type,VM.document_name,VM.expired_date,VM.notification_required,
       VM.notice_day,VM.upload_doc,VM.remark,VM.vendor_basic_id
       FROM VENDOR_DOCUMENT_DETAILS_MAPPING AS VM
       WHERE VM.vendor_basic_id = ${id} AND VM.isDeleted = false`,
    );
    const [vendorTdsList] = await db.sequelize.query(
      `SELECT DISTINCT VT.vendor_id, VT.tds_id,VT.nature_id,T.section,T.nature,TL.maximum_amount,TL.nature_of_transaction,TL.threshold_limit,
        TL.new_rate,TL.from_date,
        CASE 
        WHEN DATE(TL.from_date) <= CURDATE() THEN TL.new_rate 
        ELSE TL.rate 
        END AS tds_rate
        FROM VENDOR_BASIC_DETAILS AS VB
        LEFT JOIN VENDOR_TDS_MST AS VT ON VT.vendor_id = VB.id
	    LEFT JOIN SYS_TDS_MST AS T ON T.id=VT.tds_id
        LEFT JOIN TDS_LIST_MST AS TL ON TL.id=VT.nature_id
        WHERE VB.id = ${id} `,
    );
    const [recordPaymentHistory] = await db.sequelize.query(
      `SELECT VRP.*,TL.rate,TL.threshold_limit,TL.maximum_amount
      FROM VENDOR_RECORD_PAYMENT AS VRP
      INNER JOIN VENDOR_BASIC_DETAILS AS VBD ON VRP.vendor_id = VBD.id
      LEFT JOIN PROCUREMENT_PURCHASE_ORDER AS P ON P.id = VRP.po_id
      LEFT JOIN GRN_MASTER AS G ON G.id = VRP.grn_id
      LEFT JOIN GRN_MASTER AS GM ON GM.id = VRP.invoice_id
      LEFT JOIN TDS_LIST_MST AS TL ON TL.id = VRP.nature_id
      WHERE  VRP.vendor_id = ${id} `,
    );
    const vendorData = response[0];
    if (vendorData && vendorData.trade_currency_ids) {
      if (typeof vendorData.trade_currency_ids === "string") {
        try {
          vendorData.trade_currency_ids = JSON.parse(
            vendorData.trade_currency_ids,
          );
        } catch (e) {
          logger.error(`Error parsing trade_currency_ids: ${e.message}`);
        }
      }
    }
    const Obj = {
      ...vendorData,
      bank_details,
      doc_details,
      tdsList: vendorTdsList,
      recordPaymentHistory: recordPaymentHistory,
    };

    if (response) {
      return res.status(200).send({
        code: 200,
        message: "Fetched Vendor Details Successfully!",
        data: Obj,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Vendor Details Found for the given entity_id!",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error     " });
  }
};
exports.get_vendor_bank_details = async (req, res) => {
  try {
    const query = `
           SELECT VBDM.id,VBDM.vendor_basic_id,VBDM.branch_name,VBDM.account_holder_name,
           VBDM.unique_number_bank,VBDM.bank_address,VBDM.bank_account_number,VBDM.swift_code,
           VBDM.iban_code,MB.city_name,MSB.states_name,MCB.countryss_name
           FROM VENDOR_BASIC_DETAILS AS VBD
           INNER JOIN VENDOR_BANK_DETAILS_MAPPING AS VBDM ON VBDM.vendor_basic_id = VBD.id
           INNER JOIN MASTER_CITY AS MB ON MB.city_id = VBDM.bank_city_id
           INNER JOIN MASTER_STATE AS MSB ON MSB.states_id = VBDM.bank_state_id
           INNER JOIN MASTER_COUNTRY AS MCB ON MCB.countryss_id = VBDM.bank_country_id `;

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Vendor Details Successfully!",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Vendor Details Found for the given entity_id!",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
exports.Code_create_cc = async (req, res) => {
  try {
    const id = req.body;
    if (!id) {
      return res.status(400).send({
        code: 400,
        message: "ID parameter is missing",
      });
    }
    const lastBank = await db.vendor_basic_details.findOne({
      order: [["cc_account_code", "DESC"]],
      attributes: ["cc_account_code"],
      where: {
        cc_account_code: {
          [db.Sequelize.Op.like]: "421%",
        },
      },
    });
    let nextCode;
    if (!lastBank) {
      nextCode = 1;
    } else {
      const lastCode = parseInt(lastBank.cc_account_code.slice(9), 10);
      nextCode = lastCode + 1;
    }

    const code = `421000000${nextCode.toString().padStart(3, "0")}`;

    if (code) {
      return res.status(200).send({
        code: 200,
        message: "Code generated successfully!",
        data: code,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Code generated not created!",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};
exports.Code_create_sns = async (req, res) => {
  try {
    const id = req.body;
    if (!id) {
      return res.status(400).send({
        code: 400,
        message: "ID parameter is missing",
      });
    }
    const lastBank = await db.vendor_basic_details.findOne({
      order: [["sns_details_security", "DESC"]],
      attributes: ["sns_details_security"],
      where: {
        sns_details_security: {
          [db.Sequelize.Op.like]: "422%",
        },
      },
    });
    let nextCode;
    if (!lastBank) {
      nextCode = 1;
    } else {
      const lastCode = parseInt(lastBank.sns_details_security.slice(9), 10);
      nextCode = lastCode + 1;
    }

    const code = `422000000${nextCode.toString().padStart(3, "0")}`;

    if (code) {
      return res.status(200).send({
        code: 200,
        message: "Code generated successfully!",
        data: code,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Code generated not created!",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};
exports.Code_create_pg = async (req, res) => {
  try {
    const id = req.body;
    if (!id) {
      return res.status(400).send({
        code: 400,
        message: "ID parameter is missing",
      });
    }
    const lastBank = await db.vendor_basic_details.findOne({
      order: [["pgc_account", "DESC"]],
      attributes: ["pgc_account"],
      where: {
        pgc_account: {
          [db.Sequelize.Op.like]: "429%",
        },
      },
    });
    let nextCode;
    if (!lastBank) {
      nextCode = 1;
    } else {
      const lastCode = parseInt(lastBank.pgc_account.slice(9), 10);
      nextCode = lastCode + 1;
    }

    const code = `429000000${nextCode.toString().padStart(3, "0")}`;

    if (code) {
      return res.status(200).send({
        code: 200,
        message: "Code generated successfully!",
        data: code,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Code generated not created!",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};
exports.get_all_vendor = async (req, res) => {
  try {
    const { entity_id } = req.query;
    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id parameter is required",
        data: [],
      });
    }
    const productions = await db.vendor_basic_details.findAll({
      where: {
        // entity_id,
        isDeleted: false,
      },
      // include: [
      //     {
      //         model: db.asset
      //     },
      //     {
      //         model: db.vendor_basic_details_map,
      //     },
      //     {
      //         model: db.vendor_bank_details_map,
      //     },
      //     {
      //         model: db.vendor_doc_details_map,
      //     }
      // ],
      order: [["id", "DESC"]],
    });

    if (productions.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Productions data successfully",
        data: productions,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Data found", data: [] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
exports.vendor_auto_code = async (req, res) => {
  try {
    const po_Variable = "V";
    const lastEntry = await db.vendor_basic_details.findOne({
      where: { status: "ACTIVE" },
      order: [["id", "DESC"]],
      attributes: ["vendor_auto_code", "id"],
    });

    if (lastEntry != null) {
      const last_digit = lastEntry.vendor_auto_code;
      if (last_digit) {
        const lastNumber = parseInt(last_digit.slice(-2), 10);
        var number = lastNumber + 1;
      } else if (last_digit.length == 0 || last_digit.length == null) {
        var number = 1;
      }
    } else {
      var number = 1;
    }
    const code = `${number}`.padStart(3, "0");
    const po_number = po_Variable + code;
    if (po_number === "") {
      return res
        .status(200)
        .send({ code: 200, message: "Please Select PO Type", data: null });
    } else {
      return res.status(200).send({
        code: 200,
        message: "Vendro Number has been Generated Purchase Order",
        data: po_number,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};
exports.delete_vendor_basic = async (req, res) => {
  try {
    const vendor_id = req.params.id;
    const getAllData = await db.vendor_basic_details_map.findOne({
      where: { id: vendor_id },
    });
    if (getAllData) {
      await db.vendor_basic_details_map.update(
        { isDeleted: true },
        { where: { id: vendor_id } },
      );
      return res.status(200).send({
        code: 200,
        message: "vendor_basic_details is Deleted Successfully!",
      });
    } else {
      return res.status(404).send({ code: 403, message: "id not found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};
exports.delete_vendor_bank = async (req, res) => {
  try {
    const vendor_id = req.params.id;
    const getAllData = await db.vendor_bank_details_map.findOne({
      where: { id: vendor_id },
    });
    if (getAllData) {
      await db.vendor_bank_details_map.update(
        { isDeleted: true },
        { where: { id: vendor_id } },
      );
      return res.status(200).send({
        code: 200,
        message: "vendor_bank_details is Deleted Successfully!",
      });
    } else {
      return res.status(404).send({ code: 403, message: "id not found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};
exports.delete_vendor_doc = async (req, res) => {
  try {
    const vendor_id = req.params.id;
    const getAllData = await db.vendor_doc_details_map.findOne({
      where: { id: vendor_id },
    });
    if (getAllData) {
      await db.vendor_doc_details_map.update(
        { isDeleted: true },
        { where: { id: vendor_id } },
      );
      return res.status(200).send({
        code: 200,
        message: "vendor_doc_details is Deleted Successfully!",
      });
    } else {
      return res.status(404).send({ code: 403, message: "id not found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

/*** Generate sequential code based on total record count, Example: DRV00001, TRP00025 */
async function generateSequentialCode(
  model,
  prefix,
  organization_id = null,
  digits = 3,
  where = {},
) {
  if (!model || !prefix) {
    throw new Error("model and prefix are required");
  }

  const finalWhere = { ...where };

  if (organization_id !== null && organization_id !== undefined) {
    finalWhere.organization_id = organization_id;
  } else {
    finalWhere.organization_id = null;
  }

  const totalCount = await model.count({ where: finalWhere });

  const nextNumber = totalCount + 1;
  const code = String(nextNumber).padStart(digits, "0");
  const clientPart =
    organization_id === null || organization_id === undefined
      ? "EP0"
      : `TP${organization_id}`;

  return `${prefix}-${clientPart}-${code}`;
}

exports.createVendor_Details = async (req, res) => {
  try {
    const {
      tab_type,
      entity_id,
      financial_year_id,
      notification_required,
      notice_day,
      advanced_chart_of_account_id,
      bank_item,
      id,
      doc_item,
      chart_of_account_id,
      tdsList,
      isChecked,
      rate,
      time_periods_from,
      time_periods_to,
      certificate_doc,
      isChecked_194,
      rate_194,
      declaration_doc,
      from_month,
      to_month,
    } = req.body;

    if (tab_type === "Basic_Details") {
      if (id) {
        const {
          parent_company_id,
          vendor_code,
          vendor_email,
          rcm_charge,
          entity_id,
          financial_year_id,
          organization_id,
          ...updateData
        } = req.body;
        const vendor = await db.vendor_basic_details.findByPk(id);

        if (!vendor) {
          return res
            .status(404)
            .send({ code: 404, message: "Vendor not found" });
        }

        if (updateData.contact_number) {
          const existingContact = await db.vendor_basic_details.findOne({
            where: {
              contact_number: updateData.contact_number,
              id: { [db.Sequelize.Op.ne]: id },
            },
          });
          if (existingContact) {
            return res.status(400).send({
              code: 400,
              message: "A vendor with this contact number already exists",
            });
          }
        }

        updateData.rcm_charge = rcm_charge;

        await vendor.update(updateData);

        return res.status(200).send({
          code: 200,
          message: "Vendor Basic Details updated successfully",
          data: vendor.id,
        });
      } else {
        const { vendor_email, contact_number } = req.body;
        if (!vendor_email) {
          return res
            .status(404)
            .send({ code: 404, message: "Mandatory fields are required!" });
        }

        const existingVendor = await db.vendor_basic_details.findOne({
          where: { vendor_email },
        });
        if (existingVendor) {
          return res.status(404).send({
            code: 404,
            message: "A vendor with this email already exists",
          });
        }

        if (contact_number) {
          const existingContact = await db.vendor_basic_details.findOne({
            where: { contact_number },
          });
          if (existingContact) {
            return res.status(400).send({
              code: 400,
              message: "A vendor with this contact number already exists",
            });
          }
        }

        let organization_id = req.user?.organization_id;

        const data = {
          ...req.body,
          organization_id: organization_id,
          rcm_charge: req.body.rcm_charge || 0,
          createdBy: req.user?.employee_id,
          vendor_code: await generateSequentialCode(
            db.vendor_basic_details,
            "VC",
            organization_id,
          ),
        };

        const vendor = await db.vendor_basic_details.create(data);

        return res.status(201).send({
          code: 201,
          message: "Vendor created successfully",
          data: vendor.id,
        });
      }
    } else if (tab_type === "Bank_Details") {
      if (id) {
        await db.vendor_bank_details_map.destroy({
          where: { vendor_basic_id: id },
        });
        if (bank_item && bank_item.length > 0) {
          await Promise.all(
            bank_item.map(async (details) => {
              const {
                bank_id,
                branch_name,
                account_holder_name,
                bank_address,
                bank_city_id,
                bank_state_id,
                bank_country_id,
                bank_account_number,
                unique_number_bank,
                swift_code,
                iban_code,
              } = details;
              if (
                bank_id ||
                branch_name ||
                account_holder_name ||
                bank_address ||
                bank_city_id ||
                bank_state_id ||
                bank_country_id ||
                bank_account_number ||
                unique_number_bank ||
                swift_code ||
                iban_code
              ) {
                await db.vendor_bank_details_map.create({
                  bank_id,
                  branch_name,
                  account_holder_name,
                  vendor_basic_id: id,
                  bank_address,
                  bank_city_id,
                  bank_state_id,
                  bank_country_id,
                  bank_account_number,
                  unique_number_bank,
                  swift_code,
                  iban_code,
                  financial_year_id: financial_year_id,
                  entity_id: entity_id,
                });
              }
            }),
          );
        }

        return res.status(200).send({
          code: 200,
          message: "Bank Details Updated Successfully!",
          data: id,
        });
      }
    } else if (tab_type === "Document_Details") {
      if (id) {
        if (notification_required === "YES") {
          await db.vendor_doc_details_map.update(
            { notice_day },
            { where: { vendor_basic_id: id } },
          );
        }
        await db.vendor_doc_details_map.destroy({
          where: { vendor_basic_id: id },
        });
        if (doc_item && doc_item.length > 0) {
          await Promise.all(
            doc_item.map(async (details) => {
              let {
                document_type,
                document_name,
                expired_date,
                upload_doc,
                remark,
                notification_required,
                notice_day,
              } = details;
              if (expired_date === "Invalid date") {
                expired_date = null;
              }
              if (
                document_type ||
                document_name ||
                expired_date ||
                upload_doc ||
                remark ||
                notification_required ||
                notice_day
              ) {
                await db.vendor_doc_details_map.create({
                  vendor_basic_id: id,
                  document_type,
                  document_name,
                  expired_date,
                  upload_doc,
                  remark,
                  notification_required,
                  notice_day,
                  financial_year_id: financial_year_id,
                  entity_id: entity_id,
                });
              }
            }),
          );
        }

        return res.status(200).send({
          code: 200,
          message: "Vendor Document Details Updated Successfully!",
          data: id,
        });
      }
    } else if (tab_type === "Account_Details") {
      if (id) {
        await db.vendor_basic_details.update(
          {
            chart_of_account_id,
            advanced_chart_of_account_id,
          },
          { where: { id } },
        );

        return res.status(200).send({
          code: 200,
          message: "Vendor Account Details Updated Successfully!",
          data: id,
        });
      }
    } else if (tab_type === "tds_section") {
      const vendorExist = await db.vendorTDS.findOne({
        where: { vendor_id: id },
      });
      if (!vendorExist) {
        await db.vendor_basic_details.update(
          {
            isChecked,
            rate,
            time_periods_from,
            time_periods_to,
            certificate_doc,
            isChecked_194,
            rate_194,
            declaration_doc,
            from_month,
            to_month,
          },
          { where: { id } },
        );
        await Promise.all(
          tdsList.map(async (item) => {
            const { tds_id, threshold_limit, tds_rate, nature_id } = item;
            await db.vendorTDS.create({
              tds_id,
              threshold_limit,
              tds_rate,
              nature_id,
              vendor_id: id,
            });
          }),
        );

        return res
          .status(200)
          .send({ code: 200, message: "TDS Updated Successfully!" });
      } else {
        await db.vendorTDS.destroy({ where: { vendor_id: id } });
        await Promise.all(
          tdsList.map(async (item) => {
            const { tds_id, threshold_limit, tds_rate, nature_id } = item;
            await db.vendorTDS.create({
              tds_id,
              threshold_limit,
              tds_rate,
              nature_id,
              vendor_id: id,
            });
          }),
        );

        if (isChecked) {
          await db.vendor_basic_details.update(
            {
              isChecked,
              rate,
              time_periods_from,
              time_periods_to,
              certificate_doc,
              isChecked_194: null,
              rate_194: null,
              from_month: null,
              to_month: null,
              declaration_doc: null,
            },
            { where: { id } },
          );
        } else if (isChecked_194) {
          await db.vendor_basic_details.update(
            {
              isChecked_194,
              rate_194,
              from_month,
              to_month,
              declaration_doc: declaration_doc,
              isChecked: null,
              rate: null,
              time_periods_from: null,
              time_periods_to: null,
              certificate_doc: null,
            },
            { where: { id } },
          );
        } else {
          await db.vendor_basic_details.update(
            {
              isChecked: null,
              rate: null,
              time_periods_from: null,
              time_periods_to: null,
              certificate_doc: null,
              isChecked_194: null,
              rate_194: null,
              from_month: null,
              to_month: null,
              declaration_doc: null,
            },
            { where: { id } },
          );
        }

        return res
          .status(200)
          .send({ code: 200, message: "TDS Updated Successfully!" });
      }
    }
    return res.status(400).send({ code: 400, message: "Invalid tab_type" });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAll_Vendor_type = async (req, res) => {
  try {
    let [response] = await db.sequelize.query(
      `select * from VENDOR_TYPE_MASTER where status='ACTIVE';`,
    );
    if (response) {
      return res
        .status(200)
        .send({ code: 200, data: response, message: "fetch successfully" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
exports.getAll_Vendor_by_Type = async (req, res) => {
  try {
    const [response] = await db.sequelize.query(
      `SELECT V.vendor_name,V.id,VT.vendor_type 
        FROM VENDOR_BASIC_DETAILS AS V 
        INNER JOIN VENDOR_TYPE_MASTER AS VT ON V.vendor_type_id = VT.id 
        WHERE VT.vendor_type !='Procurement'`,
    );

    if (response) {
      return res.status(200).json({
        code: 200,
        data: response,
        message: "Fetched successfully.",
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: "No data found for the given status.",
      });
    }
  } catch (error) {
    logger.error(`Error: ${error.message}`, { error });
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
exports.getVendorAccListByCode = async (req, res) => {
  try {
    let cc_account_code = req.query?.cc_account_code;
    let sns_details_security = req.query?.sns_details_security;
    let pgc_account = req.query?.pgc_account;
    const query = `
          SELECT id, CONCAT(account_code, ' - ', account_name) AS account_name 
          FROM CHART_OF_ACCOUNTS 
          WHERE account_code = ${cc_account_code} OR account_code = ${sns_details_security}
          OR account_code = ${pgc_account} AND isDeleted = 0;
`;

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Vendor A/C Successfully!",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Vendor A/C Found !",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_Chart_Of_Account_List_vendor = async (req, res) => {
  try {
    let entity_id = req.params?.id;
    const query = `SELECT CA.*, 
        MCC.Currency_Type AS currency, 
        PARENT_CA.account_name AS parent_account_name  
        FROM CHART_OF_ACCOUNTS AS CA
        LEFT JOIN MASTER_CURRENCY_CONVERT AS MCC ON MCC.Currency_Convert_id = CA.currency_id
        LEFT JOIN CHART_OF_ACCOUNTS AS PARENT_CA ON PARENT_CA.id = CA.parent_account
        WHERE CA.isDeleted = '0' AND CA.entity_id = ${entity_id} AND CA.is_group = 'no'
        ORDER BY CA.id DESC`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (data.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched Data Successfully !",
        data: data,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.get_all_vendor_name = async (req, res) => {
  try {
    const { entity_id } = req.query;
    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id parameter is required",
        data: [],
      });
    }
    const productions = await db.vendor_basic_details.findAll({
      where: {
        entity_id,
        isDeleted: false,
      },
      attributes: ["id", "vendor_name", "vendor_code"],
      order: [["id", "DESC"]],
    });

    if (productions.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get All Productions data successfully",
        data: productions,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Data found", data: [] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
exports.createVendorAddressInfo = async (req, res) => {
  try {
    await db.sequelize.transaction(async (transaction) => {
      const {
        shipping_address_data,
        billing_address_data,
        contact_info_data,
        vendor_id,
      } = req.body;

      const vendor = await db.vendor_basic_details.findOne({
        where: { id: vendor_id },
        transaction,
      });

      if (!vendor) {
        throw new Error("Vendor not found!");
      }

      if (
        Array.isArray(billing_address_data) &&
        billing_address_data.length > 0
      ) {
        const billingAddress = await db.vendorBillingAddress.findAll({
          where: { vendor_id },
          transaction,
        });

        const billingIds = billingAddress.map((x) => x.id);
        const billingAddressIds = billing_address_data
          .map((x) => x.id)
          .filter(Boolean);

        const notExistingIds = billingIds.filter(
          (id) => !billingAddressIds.includes(id),
        );

        for (const elem of notExistingIds) {
          await db.vendorBillingAddress.update(
            { is_Deleted: true, status: "INACTIVE" },
            { where: { id: elem }, transaction },
          );
        }

        for (const el of billing_address_data) {
          if (el.id && el.id.toString().trim() !== "") {
            await db.vendorBillingAddress.update(
              {
                billing_pin_code: el.billing_pin_code,
                billing_address: el.billing_address,
                billing_postal_address: el.billing_postal_address,
                billing_city_id: el.billing_city_id,
                billing_state_id: el.billing_state_id,
                billing_country_id: el.billing_country_id,
                gst_category: el.gst_category,
                gst_in: el.gst_in,
                isGstType: el.isGstType,
              },
              { where: { id: el.id }, transaction },
            );
          } else {
            delete el.id;

            await db.vendorBillingAddress.create(
              {
                ...el,
                vendor_id,
              },
              { transaction },
            );
          }
        }
      }

      if (
        Array.isArray(shipping_address_data) &&
        shipping_address_data.length > 0
      ) {
        const shippingAddress = await db.vendorShippingAddress.findAll({
          where: { vendor_id },
          transaction,
        });

        const shippingIds = shippingAddress.map((x) => x.id);
        const shippingAddressIds = shipping_address_data
          .map((x) => x.id)
          .filter(Boolean);

        const notExistingIds = shippingIds.filter(
          (id) => !shippingAddressIds.includes(id),
        );

        for (const elem of notExistingIds) {
          await db.vendorShippingAddress.update(
            { is_Deleted: true, status: "INACTIVE" },
            { where: { id: elem }, transaction },
          );
        }

        for (const el of shipping_address_data) {
          if (el.id && el.id.toString().trim() !== "") {
            await db.vendorShippingAddress.update(
              { ...el },
              { where: { id: el.id }, transaction },
            );
          } else {
            delete el.id;

            await db.vendorShippingAddress.create(
              {
                ...el,
                vendor_id,
              },
              { transaction },
            );
          }
        }
      }

      if (Array.isArray(contact_info_data) && contact_info_data.length > 0) {
        const contactPersons = await db.vendorContactPerson.findAll({
          where: { vendor_id },
          transaction,
        });

        const contactIds = contactPersons.map((x) => x.id);
        const contactPersonIds = contact_info_data
          .map((x) => x.id)
          .filter(Boolean);

        const notExistingIds = contactIds.filter(
          (id) => !contactPersonIds.includes(id),
        );

        for (const elem of notExistingIds) {
          await db.vendorContactPerson.update(
            { is_Deleted: true, status: "INACTIVE" },
            { where: { id: elem }, transaction },
          );
        }

        for (const el of contact_info_data) {
          if (el.id && el.id.toString().trim() !== "") {
            await db.vendorContactPerson.update(
              {
                title: el.title,
                contact_person_name: el.contact_person_name,
                mobile: el.mobile,
                email_id: el.email_id,
                designation: el.designation,
                department: el.department,
                is_primary_contact: el.is_primary_contact,
              },
              { where: { id: el.id }, transaction },
            );
          } else {
            delete el.id;

            await db.vendorContactPerson.create(
              {
                ...el,
                vendor_id,
              },
              { transaction },
            );
          }
        }
      }
    });

    return res.status(200).send({
      code: 200,
      message: "Vendor address successfully added",
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });

    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getVendorAddressInfoById = async (req, res) => {
  try {
    const vendor_id = req.params.id;
    const vendor = await db.vendor_basic_details.findOne({
      where: { id: vendor_id },
    });
    if (!vendor) {
      return res.status(404).send({ code: 404, message: "Vendor not found!" });
    }
    const vendorBillingAddress = await db.vendorBillingAddress.findAll({
      where: { vendor_id, is_Deleted: false, status: "ACTIVE" },
    });
    const vendorShippingAddress = await db.vendorShippingAddress.findAll({
      where: { vendor_id, is_Deleted: false, status: "ACTIVE" },
    });
    const vendorContactPerson = await db.vendorContactPerson.findAll({
      where: { vendor_id, is_Deleted: false, status: "ACTIVE" },
    });

    return res.status(200).send({
      code: 200,
      message: "Vendor address list ",
      data: {
        shipping_address_data: vendorShippingAddress,
        billing_address_data: vendorBillingAddress,
        vendorContactPerson,
      },
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

module.exports.createVendorAdvanceAmount = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      vendor_id,
      current_advance,
      transaction_type,
      advance_amount,
      payment_mode,
      bank_account_id,
      chart_account_id,
      cheque_number,
      entity_id,
      financial_id,
      terms_conditions,
      tab_type,
    } = req.body;

    const Obj = {
      vendor_id,
      transaction_type,
      advance_amount,
      payment_mode,
      cheque_number,
      entity_id,
      financial_id,
      terms_conditions,
      tab_type,
    };

    if (current_advance) {
      Obj.current_advance = current_advance;
    }

    if (chart_account_id) {
      Obj.chart_account_id = chart_account_id;
    }
    if (bank_account_id) {
      Obj.bank_account_id = bank_account_id;
    }

    const customerExist = await db.vendor_basic_details.findOne({
      where: { id: vendor_id },
      attributes: ["advance_amount"],
      transaction,
    });

    const currentAdvance = parseFloat(customerExist?.advance_amount || 0);
    const changeAmount = parseFloat(advance_amount || 0);

    let updatedAdvance = currentAdvance;

    if (transaction_type === "increase") {
      updatedAdvance += changeAmount;
    }

    if (transaction_type === "reduce") {
      if (changeAmount > currentAdvance) {
        await transaction.rollback();
        return res.status(400).send({
          code: 400,
          message: "Advance cannot be reduced below 0",
        });
      }

      updatedAdvance -= changeAmount;
    }

    const paymentChartAccount =
      payment_mode === "cash" ? 147 : chart_account_id;

    const journalData = [
      {
        chart_account_id: paymentChartAccount,
        credit_amount: transaction_type === "increase" ? changeAmount : 0.0,
        debit_amount: transaction_type === "reduce" ? changeAmount : 0.0,
        entity_id,
        entry_status: "Advance Payment",
        document_number: "Advance Payment",
        financial_id,
      },
      {
        chart_account_id: 164,
        credit_amount: transaction_type === "reduce" ? changeAmount : 0.0,
        debit_amount: transaction_type === "increase" ? changeAmount : 0.0,
        entity_id,
        entry_status: "Advance Payment",
        document_number: "Advance Payment",
        vendor_id,
        party_type: "VENDOR",
        financial_id,
      },
    ];

    await db.financial_And_Account_Journal_List.bulkCreate(journalData, {
      transaction,
    });

    await db.vendor_basic_details.update(
      {
        advance_amount: updatedAdvance,
      },
      {
        where: { id: vendor_id },
        transaction,
      },
    );

    await db.advanceVendorAmount.create(Obj, { transaction });

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: "Successfully Created",
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.advanceVendorPaymentById = async (req, res) => {
  try {
    const { id } = req.query;

    const customerExist = await db.vendor_basic_details.findOne({
      where: { id },
      attributes: ["advance_amount", "id"],
    });

    if (customerExist) {
      return res
        .status(200)
        .send({ code: 200, message: "Success", data: customerExist });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Data Not Found", data: [] });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};
