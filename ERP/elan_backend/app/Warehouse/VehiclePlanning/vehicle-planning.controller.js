const db = require("../../models/index");
const moment = require("moment");
const mailQueue = require("../../CRM/utils/mail/mailQueue");
const { Op } = require('sequelize');
class VehiclePlanningController {
  constructor() {
    this.getPlanningWithTransporter = this.getPlanningWithTransporter.bind(this);
    this.getPlanningByTransporter = this.getPlanningByTransporter.bind(this);
    this.getPlanningByTransporterForRFQ = this.getPlanningByTransporterForRFQ.bind(this);
    this.generateNumber = this.generateNumber.bind(this);
    this.updateDriverDetail = this.updateDriverDetail.bind(this);
  }

  async createVehiclePlan(req, res) {
    const transaction = await db.sequelize.transaction();
    try {
      const {
        saleOrders,
        transport_type_id,
        transportor_id,
        transportor_mobile,
        vehicle_type_id,
        created_by,
        via_warehouse_id,
        vehicle_category_id,
        status,
        vehicle_root_status,
        transported_by_id,
        entity_id,
        financial_year_id,
        rate_agreement
      } = req.body;

      // Generate unique planning code
      const today = moment().format("YYYY-MM-DD");
      const todayCount = await db.vehiclePlanningMst.count({
        where: db.Sequelize.where(
          db.Sequelize.fn("DATE", db.Sequelize.col("createdAt")),
          today
        ),
        transaction,
      });
      const counter = String(todayCount + 1).padStart(3, "0");
      const planningCode = `VPC${moment().format("DDMMYY")}${counter}`;

      // Create vehicle plan
      const created = await db.vehiclePlanningMst.create(
        {
          transported_by_id,
          transport_type_id,
          transportor_id,
          transportor_mobile,
          vehicle_type_id,
          planning_code: planningCode,
          created_by,
          vehicle_root_status,
          via_warehouse_id,
          vehicle_category_id,
          status,
          entity_id,
          financial_year_id,
          organization_id: req.user?.organization_id,
        },
        { transaction }
      );

      if (!created) throw new Error("Failed to create vehicle plan");

      // Create sale orders
      for (const data of saleOrders) {
        const wh_gate_by_pass = (
          await db.warehouse.findOne({
            where: { id: data.warehouse_id },
            attributes: ["inOut"],
            raw: true
          })
        )?.inOut || "NO";

        await db.vehiclePlanningSo.create(
          {
            pickup_date: data.pickup_date,
            sale_order_id: data.sale_order_id,
            priority: data.priority,
            expected_delivery_date: data.expected_delivery_date,
            pickup_warehouse: data.pickup_warehouse,
            pickup_address: data.pickup_address,
            delivery_address: data.delivery_address,
            warehouse_id: data.warehouse_id,
            gate_by_pass: wh_gate_by_pass,
            planning_id: created.id,
          },
          { transaction }
        );
      }

      // Prepare transporter rows
      const transporterIds = Array.isArray(transportor_id) ? transportor_id : [transportor_id];

      const transporterRows = transporterIds.map((elem) => ({
        vehicle_planing_id: created.id,
        transportor_id: elem,
        transporter_status: "PENDING",
        admin_status: "PENDING",
        rate_agreement_id: rate_agreement[0]?.trip_id
      }));
      // const transporterRows = transportor_id.map((elem) => ({
      //   vehicle_planing_id: created.id,
      //   transportor_id: elem,
      //   transporter_status: "PENDING",
      //   admin_status: "PENDING",
      //   rate_agreement_id: rate_agreement[0]?.trip_id
      // }));

      // Bulk insert transporters (inside transaction)
      const createdTransporters = await db.vehiclePlanningTransporter.bulkCreate(transporterRows, {
        transaction,
        ignoreDuplicates: true, // Prevent duplicates
        returning: true,
      }, { transaction });

      if (rate_agreement && rate_agreement.length) {
        for (const element of rate_agreement) {
          await db.vehiclePlanningTransporterAgreement.create({
            vh_transporter_id: createdTransporters[0].id,
            rate_agree_details_id: element.details_id
          }, { transaction });
        }
      }

      await transaction.commit();
      for (const transporterRow of createdTransporters) {
        const transporter = await db.transport_master.findOne({
          where: { id: transporterRow.transportor_id },
          attributes: ["tm_contact_person_name", "tm_email", "entity_id"],
        });
        if (!transporter?.tm_email) continue;

        const link = `${req.headers.origin}/transporter-request-link?planning=${transporterRow.vehicle_planing_id}&transporter=${transporterRow.id}`;

        await mailQueue.add({
          type: "TRANSPORTER_LINK",
          transporter_email: transporter.tm_email,
          contact_person_name: transporter.tm_contact_person_name,
          link,
          entity_id: transporter.entity_id,
          planning_code: created.planning_code
        });
      }

      return res.status(201).json({ message: "Vehicle plan created successfully." });
    } catch (error) {
      await transaction.rollback();
      console.error("Vehicle Plan Creation Error:", error);
      return res.status(500).json({ message: "Error creating vehicle plan" });
    }
  }

  async getVehiclePlannedData(req, res) {
    try {
      const { entity_id } = req.query;
      const organization_id = req.user?.organization_id ?? null;
      
      const dataList = await db.sequelize.query(`SELECT 
          VP.id,VP.vehicle_root_status,
          VP.planning_code AS planningCode,
          VT.vehicle_type_name AS vehicleType,
          TTM.typeName AS transportedBy,
          TPT.typeName AS transportType,
          VP.status,
          DATE_FORMAT(VP.createdAt, '%Y-%m-%d') AS createdAt,
          IFNULL(T.total_transporter, 0) AS total_transporter,
          IFNULL(T.accepted_transporter, 0) AS accepted_transporter,
          IFNULL(T.admin_accepted_status, 0) AS admin_accepted_status
        FROM WH_VH_PLANNING_MST AS VP
        INNER JOIN TM_VEHICLETYPE_MASTER AS VT 
          ON VP.vehicle_type_id = VT.vehicle_type_id
        INNER JOIN TM_TRANSPORTERTYPE_MASTER AS TTM 
          ON VP.transported_by_id = TTM.id
        INNER JOIN TM_TRANSPORTTYPE_MASTER AS TPT 
          ON VP.transport_type_id = TPT.id
        LEFT JOIN (
            SELECT 
              vehicle_planing_id,
              COUNT(id) AS total_transporter,
              SUM(transporter_status = 'ACCEPTED') AS accepted_transporter,
              SUM(admin_status = 'ACCEPTED') AS admin_accepted_status
            FROM WH_VH_PLANNING_TRANSPORTER
            WHERE isDeleted = FALSE
            GROUP BY vehicle_planing_id
        ) T ON T.vehicle_planing_id = VP.id
        WHERE 
          VP.entity_id = :entity_id
          AND (:organization_id IS NULL OR VP.organization_id = :organization_id)
        ORDER BY VP.id DESC;
        `,
        {
          replacements: {
            entity_id,
            organization_id,
          },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      return res.status(200).send({
        code: 200,
        message: "Data Retrieved Successfully",
        data: dataList,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ code: 500, message: error.message });
    }
  }

  async getVehiclePlanById(req, res) {
    try {
      const id = req.params.id;

      const vehiclePlan = await db.vehiclePlanningMst.findOne({
        where: {
          id: id, isDeleted: false
        },
        include: [
          {
            model: db.vehiclePlanningSo, as: "saleOrders",
            where: { isDeleted: false },
            required: false
          },

        ],
      });
      if (!vehiclePlan) {
        return res.status(404).json({ message: "Vehicle Plan not found" });
      }
      const transporter = await db.vehiclePlanningTransporter.findAll({ where: { vehicle_planing_id: id, isDeleted: false }, attributes: ['transportor_id', 'rate_agreement_id'] });


      const transporterIds = transporter.map(t => t.transportor_id);

      const responseData = {
        ...vehiclePlan.toJSON(),
        transportor_id: transporterIds,
        rate_agreement_id: transporter[0].rate_agreement_id
      };

      return res.status(200).json({
        message: "Vehicle Plan Retrieved Successfully",
        data: responseData,
      });

    } catch (error) {
      console.log(error);
      res.status(500).send({ code: 500, message: error.message });
    }
  }

  async updateVehiclePlanById(req, res) {
    const transaction = await db.sequelize.transaction();
    try {
      const id = req.params.id;

      const {
        saleOrders,
        transport_type_id,
        transportor_id,
        vehicle_type_id,
        created_by,
        via_warehouse_id,
        vehicle_category_id,
        status,
        vehicle_root_status,
        transported_by_id,
        rate_agreement
      } = req.body;

      // Update vehicle plan
      const updatedVehiclePlan = await db.vehiclePlanningMst.update(
        {
          transported_by_id,
          transport_type_id,
          vehicle_type_id,
          vehicle_root_status,
          via_warehouse_id,
          vehicle_category_id,
          status
        },
        {
          where: { id },
          transaction,
        }
      );

      if (!updatedVehiclePlan) {
        await transaction.rollback();
        return res.status(404).json({ message: "Vehicle Plan not found" });
      }

      if (saleOrders && saleOrders.length) {
        const soList = await db.vehiclePlanningSo.update({ isDeleted: true }, { where: { planning_id: id }, transaction })
        for (const data of saleOrders) {
          const payload = {
            pickup_date: data.pickup_date,
            sale_order_id: data.sale_order_id,
            priority: data.priority,
            expected_delivery_date: data.expected_delivery_date,
            pickup_warehouse: data.pickup_warehouse,
            pickup_address: data.pickup_address,
            delivery_address: data.delivery_address,
            warehouse_id: data.warehouse_id,

            planning_id: id,
          };

          const isExist = await db.vehiclePlanningSo.findOne({ where: { sale_order_id: data.sale_order_id, planning_id: id } })
          if (isExist) {
            await db.vehiclePlanningSo.update({ payload, isDeleted: false, }, { where: { id: isExist.id }, transaction })
          } else {
            await db.vehiclePlanningSo.create(payload, { transaction, });
          }
        }
      }
      const records = await db.vehiclePlanningTransporter.findAll({
        where: { vehicle_planing_id: id, isDeleted: false },
        attributes: ['id'],
        transaction
      });

      const updatedIds = records.map(r => r.id);

      await db.vehiclePlanningTransporter.update(
        { isDeleted: true },
        {
          where: { vehicle_planing_id: id },
          transaction
        }
      );

      const transporterRows = transportor_id.map((elem) => ({
        vehicle_planing_id: id,
        transportor_id: elem,
        transporter_status: "PENDING",
        admin_status: "PENDING",
        rate_agreement_id: rate_agreement[0]?.trip_id
      }));
      const createdTransporters = await db.vehiclePlanningTransporter.bulkCreate(transporterRows, {
        transaction,
        ignoreDuplicates: true,
        returning: true,
      });

      await db.vehiclePlanningTransporterAgreement.update({ isDeleted: true, status: "INACTIVE" }, {
        where: {
          vh_transporter_id: {
            [db.Sequelize.Op.in]: updatedIds
          }
        }
      })
      if (rate_agreement && rate_agreement.length) {
        for (const element of rate_agreement) {
          await db.vehiclePlanningTransporterAgreement.create({
            vh_transporter_id: createdTransporters[0].id,
            rate_agree_details_id: element.details_id
          }, { transaction });
        }
      }

      await transaction.commit();


      for (const transporterRow of createdTransporters) {
        const transporter = await db.transport_master.findOne({
          where: { id: transporterRow.transportor_id },
          attributes: ["tm_contact_person_name", "tm_email", "entity_id"],
        });
        if (!transporter?.tm_email) continue;

        const link = `${req.headers.origin}/transporter-request-link?planning=${transporterRow.vehicle_planing_id}&transporter=${transporterRow.id}`;

        const plan = await db.vehiclePlanningMst.findOne({ where: { id: id } });
        await mailQueue.add({
          type: "TRANSPORTER_LINK",
          transporter_email: transporter.tm_email,
          contact_person_name: transporter.tm_contact_person_name,
          link,
          entity_id: transporter.entity_id,
          planning_code: plan.planning_code
        });
      }

      //await transaction.commit();

      return res.status(200).json({
        message: "Vehicle Plan Updated Successfully",
        data: updatedVehiclePlan,
      });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  async getSOFORDispatch(req, res) {
    try {
      let condition = ``;
      let dynamicColumns = "";
      dynamicColumns = `,'proceedToDispatch' AS status`;
      condition = `SO.is_proceed_to_dispatched=1`;

      let [data] = await db.sequelize.query(`
           SELECT 
                SOI.address,
                GROUP_CONCAT(SOI.id) AS item_id,
                GROUP_CONCAT(SOI.sales_order_id) AS sales_order_ids,
                SUM(SOI.quantity) AS total_quantity,
                MAX(P.proposal_no) AS proposal_no,
                MAX(P.id) AS proposal_id,
                MAX(CU.company_name) AS company_name,
                MAX(CA.contact_person_name) AS contact_person_name,
                MAX(SO.sales_order_no) AS sales_order_no,
                MAX(SO.id) AS salesOrderId,
                MAX(SO.sales_order_date) AS sales_order_date,
                MAX(SO.customisation_branding_date) AS customisationDate,
                MAX(SO.is_dispatched) AS is_dispatched
                ${dynamicColumns}
            FROM SALES_ORDER_ITEM_LIST AS SOI
            INNER JOIN SALES_ORDER_MST AS SO
                ON SOI.sales_order_id = SO.id
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS P
                ON SO.proposal_id = P.id
            INNER JOIN CUSTOMER_PROFILE_MST AS CU 
                ON P.customer_id = CU.id
            INNER JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CA 
                ON P.contact_person_id = CA.id
            INNER JOIN  CRM_PROPOSAL_LIST_MST AS PI 
                ON P.id = PI.proposal_id
            LEFT JOIN  CRM_PROPOSAL_BRANDING AS PB 
                ON PI.id = PB.proposal_item_id
            LEFT JOIN  CRM_PROPOSAL_CUSTOMISATION_TYPE AS PC 
                ON PI.id = PC.proposal_item_id
            WHERE SO.is_dispatched = 0 
            AND ${condition}           
            GROUP BY SOI.address, SOI.sales_order_id
            ORDER BY SO.sales_order_no DESC;
        `);
      if (Array.isArray(data)) {
        return res
          .status(200)
          .send({ code: 200, message: "Order list data", data: data });
      } else {
        return res.status(200).send({ code: 200, message: "data not found" });
      }
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
    }
  }

  async generateNumber (fieldName, prefixCode){
      const year = new Date().getFullYear();
      const prefix = `SL/${prefixCode}/${year}`;

      const lastRecord = await db.vehicleGateInOutword.findOne({
          where: {
              [fieldName]: {
                  [Op.like]: `${prefix}/%`
              }
          },
          order: [['id', 'DESC']]
      });

      let nextNumber = 1;

      if (lastRecord?.[fieldName]) {
          const lastNumber = parseInt(
              lastRecord[fieldName].split('/').pop(),
              10
          );

          if (!isNaN(lastNumber)) {
              nextNumber = lastNumber + 1;
          }
      }

      return `${prefix}/${String(nextNumber).padStart(4, '0')}`;
  }

  async updateDriverDetail(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const loginId = req.user?.employee_id;
      data.gate_inward_status = 'Approved';
      data.gate_inward_date = new Date();
      data.gateIn_updated_by = loginId;
      const gatePassNumber = await this.generateNumber('gate_pass_number', 'GPN');
      data.gate_pass_number = gatePassNumber;

      if (data.buttonAction === 'VERIFY') {
        // extra fields remove
        delete data.driver_name;
        delete data.driver_contact;
        delete data.vehicle_number;
      }

      const driverData = await db.vehicleGateInOutword.update(data, {
        where: { id: id }
      });

      if (!driverData || driverData[0] === 0) {
        return res.status(404).json({ message: "Vehicle Plan not found" });
      }

      return res.status(200).json(data.buttonAction === 'VERIFY'
        ? 'Gate Inward Verified Successfully'
        : 'Gate Inward Saved & Verified Successfully'
      );
    } catch (error) {
      console.log(error);
      res.status(500).send({ code: 500, message: error.message });
    }
  }

  async getPlanningWithTransporter(planning_id, transporter_id) {

    const planningData = await db.sequelize.query(`
      SELECT 
        VP.id AS planning_id,
        VP.transport_type_id,
        VP.transported_by_id,
        VP.vehicle_type_id,                        
        VP.planning_code AS planningCode,
        VT.vehicle_type_name AS vehicleType,
        TTM.typeName AS transportedBy,
        T.typeName AS transportType,
        VP.status,                        
        DATE_FORMAT(VP.createdAt, '%Y-%m-%d') AS createdAt,                        
        TP.tm_name,
        TP.tm_code,
        TR.remark,
        TR.amount,
        TR.transporter_status,
        TR.transporter_status_date,
        TR.admin_status,
        TR.admin_status_date
      FROM WH_VH_PLANNING_MST AS VP
      INNER JOIN TM_VEHICLETYPE_MASTER AS VT ON VP.vehicle_type_id = VT.vehicle_type_id
      INNER JOIN TM_TRANSPORTERTYPE_MASTER AS TTM ON VP.transported_by_id = TTM.id
      INNER JOIN TM_TRANSPORTTYPE_MASTER AS T ON VP.transport_type_id = T.id
      INNER JOIN WH_VH_PLANNING_TRANSPORTER AS TR ON VP.id = TR.vehicle_planing_id
      INNER JOIN TM_TRANSPORTER_MASTER AS TP ON TR.transportor_id = TP.id
      WHERE VP.id = :planning_id
        AND TR.id = :transporter_id
        AND TR.isDeleted = FALSE
      ORDER BY VP.id DESC
    `, {
      replacements: { planning_id, transporter_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    if (!planningData) {
      return null;
    }

    const soList = await db.vehiclePlanningSo.findAll({
      where: { planning_id },
      include: [
        {
          model: db.salesOrder,
          as: "warehousePlaningPickup",
          attributes: ["elan_sales_order_no", "address", "postal_address", "pincode", "sales_order_no"]
        },
        {
          model: db.warehouse,
          attributes: ["name", "address"]
        }
      ],
      attributes: ["priority", "expected_delivery_date", "pickup_date"]
    });

    const rateAgreementDetails = await db.vehiclePlanningTransporter.findOne({
      where: { vehicle_planing_id: planning_id, isDeleted: false },
      include: [
        {
          model: db.rateAgreement_master,
          as: "rateAgreement"
        },
        {
          model: db.vehiclePlanningTransporterAgreement,
          include: [
            {
              model: db.rateAgreementDetails_mapping,
              include: [
                {
                  model: db.city,
                  as: 'fromCity',
                  attributes: ['city_id', 'city_name']
                },
                {
                  model: db.city,
                  as: 'toCity',
                  attributes: ['city_id', 'city_name']
                }
              ],
              as: "rateAgreementDetails"
            }
          ],
          where: { vh_transporter_id: transporter_id },
          as: 'vehiclePlanningTransporter'
        }
      ]
    })

    const charges = await db.sequelize.query(`
      SELECT MC.charge_name,TC.amount
      FROM WH_VH_PLANNING_TRANS_CHARGES AS TC
      INNER JOIN MASTER_TRANSPORT_CHARGE AS MC ON MC.id = TC.charge_id
      WHERE TC.vp_trans_id = :transporter_id
        AND TC.isDeleted = 0
    `, {
      replacements: { transporter_id },
      type: db.Sequelize.QueryTypes.SELECT
    });

    return {
      ...planningData[0],
      soList,
      charges,
      rateAgreement: {
        ...rateAgreementDetails?.rateAgreement?.dataValues,
        rate: rateAgreementDetails?.vehiclePlanningTransporter
      }
    };
  }

  async getPlanningByTransporter(req, res) {
    try {
      const { planning_id, transporter_id } = req.query;
      const mergeData = await this.getPlanningWithTransporter(planning_id, transporter_id);
      if (!mergeData) {
        return res.status(404).json({ message: "Please be informed that this planning has been cancelled by the administrator." });
      }
      if (mergeData.transporter_status !== 'PENDING') {
        let x = mergeData.transporter_status.toLowerCase()
        return res.status(200).json({ code: 200, type: mergeData.transporter_status, message: `This planning request has already been ${x}.` });
      }
      return res.status(200).json({
        message: "Record fetched successfully",
        data: mergeData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ code: 500, message: error.message });
    }
  }

  // use for transport management RFQ List
  async getPlanningByTransporterForRFQ(req, res) {
    try {
      const { planning_id, transporter_id } = req.query;
      const mergeData = await this.getPlanningWithTransporter(planning_id, transporter_id);
      return res.status(200).json({
        message: "Record fetched successfully",
        data: mergeData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ code: 500, message: error.message });
    }
  }
  async transporterAcceptance(req, res) {
    const transaction = await db.sequelize.transaction();

    try {
      const { amount, remark, transporter_status, transporter_status_date, charges = [], } = req.body;
      const request_id = req.params.treq_id;
      const [updatedCount] = await db.vehiclePlanningTransporter.update({ amount, remark, transporter_status, transporter_status_date, },
        {
          where: { id: request_id }, transaction,
        });
      if (updatedCount === 0) {
        await transaction.rollback();
        return res.status(400).json({ message: "Failed transporter action! No record updated.", });
      }
      await db.vehiclePlanningTransCharge.destroy({ where: { vp_trans_id: request_id, }, transaction, });
      if (charges.length > 0) {
        const chargeData = charges.map((item) => ({ vp_trans_id: request_id, charge_id: item.charge_id, amount: item.amount, }));
        await db.vehiclePlanningTransCharge.bulkCreate(chargeData, { transaction, });
      }
      await transaction.commit();
      return res.status(200).json({
        message: `Transporter request has been successfully ${transporter_status}!`,
      });
    } catch (error) {
      await transaction.rollback();

      console.error(error);

      return res.status(500).json({
        code: 500,
        message: error.message,
      });
    }
  }
  // async transporterAcceptance(req, res) {
  //   try {
  //     const { amount, remark, transporter_status, transporter_status_date, charges } = req.body;

  //     const request_id = req.params.treq_id;
  //     return;
  //     const [updatedCount] = await db.vehiclePlanningTransporter.update({
  //       amount,
  //       remark,
  //       transporter_status,
  //       transporter_status_date
  //     }, { where: { id: request_id } });
  //     if (updatedCount === 0) {
  //       return res.status(400).json({
  //         message: "Failed transporter action! No record updated."
  //       });
  //     }
  //     for (const element of charges) {

  //       await db.vehiclePlanningTransCharge.create({
  //         charge_id: element.charge_id,
  //         amount: element.amount,
  //         vp_trans_id: request_id
  //       })
  //     }
  //     return res.status(200).json({
  //       message: `Transporter request has been successfully ${transporter_status}!.`
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send({ code: 500, message: error.message });
  //   }
  // }
  async getsTransAdminApprovel(req, res) {
    try {
      const vpId = req.params.vpId;


      const transporter = await db.vehiclePlanningTransporter.findAll({
        where: { vehicle_planing_id: vpId, isDeleted: false },
        include: [
          {
            model: db.transport_master,
            as: "transporterDetails"
          },
          {
            model: db.vehiclePlanningTransCharge,
            as: "transporters",
            include:[
              {
                model:db.transportChargeMst,
                as:"chargeList"
              }
            ]
          }
        ]
      });

      transporter.sort((a, b) => {
        const aAmount =
          a.transporters?.find(x => Number(x.charge_id) === 2)?.amount ?? Number.MAX_VALUE;

        const bAmount =
          b.transporters?.find(x => Number(x.charge_id) === 2)?.amount ?? Number.MAX_VALUE;

        return Number(aAmount) - Number(bAmount);
      });

      transporter.forEach((item, index) => {
        item.setDataValue("level", `L${index + 1}`);
      });

      if (!transporter.length) {
        return res.status(400).json({
          message: "This vehicle planning transporter not found!"
        });
      }
      return res.status(200).json({
        message: `Transporter details.`,
        data: transporter
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ code: 500, message: error.message });
    }
  }

  async updateTransporterAdminStatus(req, res) {
    try {
      const { id, admin_status, admin_status_date } = req.body;
      console.log(id, admin_status, admin_status_date)

      const [isUpdated] = await db.vehiclePlanningTransporter.update({
        admin_status, admin_status_date
      }, { where: { id: id } });
      if (isUpdated === 0) {
        return res.status(400).json({
          message: "This vehicle planning transporter not found!"
        });
      }
      const transporter = await db.vehiclePlanningTransporter.findByPk(id);
      const transporterName = await db.transport_master.findOne({ where: { id: transporter?.transportor_id } })
      const planData = await db.vehiclePlanningMst.findOne({ where: { id: transporter?.vehicle_planing_id } });
      if (admin_status === 'ACCEPT') {
        await mailQueue.add({
          type: "ADMIN_TRANSPORTER_ACCEPT",
          transporter_email: transporterName.tm_email,
          contact_person_name: transporterName.tm_contact_person_name,
          entity_id: transporterName.entity_id,
          planning_code: planData.planning_code,
          request_data: transporter?.transporter_status_date,
          admin_status: transporter?.admin_status
        });
      }
      return res.status(200).json({
        message: `The transporter has been successfully approved by the Admin.`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ code: 500, message: error.message });
    }
  }
  async approvedVehiclePlanning(req, res) {
    try {
      const { id, status } = req.body;

      const [isUpdated] = await db.vehiclePlanningMst.update({
        status
      }, { where: { id: id } });
      if (isUpdated === 0) {
        return res.status(400).json({
          message: "This vehicle planning not found!"
        });
      }

      // Start Gate In Out Table Entry For Planning
      const loginId = req.user?.employee_id;
      const planningSOList = await db.vehiclePlanningSo.findAll({
        where: {
          planning_id: id,
          isDeleted: 0
        },
        attributes: [
          'warehouse_id',
          [db.Sequelize.fn('MAX', db.Sequelize.col('gate_by_pass')), 'gate_by_pass']
        ],

        group: ["warehouse_id"]
      });

      if (!planningSOList.length) {
        return res.status(200).json({
          code: 200,
          message: "No data found"
        });
      }

      const insertPayload = planningSOList.map(item => {
        const isByPassYes = item.gate_by_pass === "YES";
        return {
          vehicle_planing_id: id,
          warehouse_id: item.warehouse_id,
          gate_pass_number: isByPassYes ? "N/A" : null,
          gate_inward_status: isByPassYes ? "Approved" : "Pending",
          gate_inward_date: isByPassYes ? moment().toDate() : null,
          gateIn_updated_by: isByPassYes ? loginId : null
        };
      });
      await db.vehicleGateInOutword.bulkCreate(insertPayload);
      // End Gate In Out Table Entry For Planning

      const transporter = await db.vehiclePlanningTransporter.findOne({ where: { vehicle_planing_id: id, admin_status: "ACCEPTED", transporter_status: "ACCEPTED" } });
      const transporterName = await db.transport_master.findOne({ where: { id: transporter?.transportor_id } })
      const planData = await db.vehiclePlanningMst.findOne({ where: { id: id } });

      await mailQueue.add({
        type: "ADMIN_TRANSPORTER_ACCEPT",
        transporter_email: transporterName.tm_email,
        contact_person_name: transporterName.tm_contact_person_name,
        entity_id: transporterName.entity_id,
        planning_code: planData.planning_code,
        request_data: transporter?.transporter_status_date,
        admin_status: transporter?.admin_status
      });

      return res.status(200).json({
        message: `The vehicle plan has been successfully approved.`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ code: 500, message: error.message });
    }
  }
  async getsRateAgreementByTransporter(req, res) {
    try {
      const { transporter_id, vehicle_type_id, soList } = req.query;

      const parseSO = JSON.parse(soList);

      const pickupCityIds = [
        ...new Set(parseSO.map(so => so.pickup_city_id).filter(Boolean))
      ];

      const deliveryCityIds = [
        ...new Set(parseSO.map(so => so.delivery_city_id).filter(Boolean))
      ];

      const today = parseSO[0]?.pickup_date;
      // const today = new Date().toISOString().split('T')[0];;

      const agreements = await db.rateAgreement_master.findAll({
        where: {
          transporter_id,
          valid_from: { [Op.lte]: today },
          valid_to: { [Op.gte]: today },
          isDeleted: false,
          status: "ACTIVE"
        },
        attributes: ["id", "agreement_no", "agreement_type", "valid_from", "valid_to"],
        include: [
          {
            model: db.rateAgreementDetails_mapping,
            where: {
              vehicle_type_id: vehicle_type_id,
              from_city_id: { [Op.in]: pickupCityIds },
              to_city_id: { [Op.in]: deliveryCityIds },
              isDeleted: false,
              status: "ACTIVE"
            },
            required: true,
            include: [
              {
                model: db.vehicleType_master
              },
              {
                model: db.city,
                as: 'fromCity',
                attributes: ['city_id', 'city_name']
              },
              {
                model: db.city,
                as: 'toCity',
                attributes: ['city_id', 'city_name']
              }
            ]
          }
        ]
      });

      if (!agreements.length) {
        return res.status(400).json({
          message: "Rate agreement not found of this transporter!"
        });
      }
      const formattedData = agreements.map(parent => ({
        id: parent.id,
        name: parent.agreement_no + '-' + parent.agreement_type + ' (' + parent.valid_from + ' To ' + parent.valid_to + ')',
        children: parent.TM_RATE_AGREEMENT_DETAILs.map(child => ({
          rate: child.rate,
          rate_agreement_details_id: child.id,
          // valid_from: parent.valid_from,
          // valid_to: parent.valid_to,
          extraCharge: child.extra_charge,
          remark: child.remark,
          validFromCity: child?.fromCity?.city_name,
          validToCity: child?.toCity?.city_name,
          validFromCity_id: child?.from_city_id,
          validToCity_id: child?.to_city_id,
          vehicleType: child?.vehicle_type_id
        }))
      }));

      const filterdData = formattedData.filter(x => x.children.length > 0);

      return res.status(200).json({
        message: `Rate agreement list`,
        data: filterdData
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ code: 500, message: error.message });
    }
  }
}

module.exports = new VehiclePlanningController();



