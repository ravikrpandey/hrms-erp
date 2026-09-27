const { sendPerformaInoviceReMail } = require('../../../CRM/utils/mail/mail');
const db = require('../../../models/index');
const { Op } = require('sequelize');

module.exports.getDeliveryList = async (req, res) => {
    try {
        let status = req.params.status;
        const currentDate = new Date();
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 5);

        const x = futureDate.toISOString().split('T')[0];
       

        let [data] = await db.sequelize.query(`
           SELECT 
                MAX(VP.planning_code) AS planning_code,
                CONCAT_WS(
                    ', ',
                    MAX(SO.address),
                    MAX(SO.postal_address),
                    MAX(SO.pincode)
                ) AS address,
               -- GROUP_CONCAT(SOI.id) AS item_id,
              --  GROUP_CONCAT(SOI.sales_order_id) AS sales_order_ids,
                SUM(SOI.qty) AS total_quantity,
                MAX(P.proposal_no) AS proposal_no,
                MAX(P.id) AS proposal_id,
                MAX(CU.company_name) AS company_name,
                MAX(CA.contact_person_name) AS contact_person_name,
                MAX(SO.sales_order_no) AS sales_order_no,
                MAX(SO.dispatch_status) AS dispatch_status,
                MAX(SO.id) AS salesOrderId,
                MAX(SO.sales_order_date) AS sales_order_date,
                MAX(SO.customisation_branding_date) AS customisationDate,
                MAX(SO.is_dispatched) AS is_dispatched,
                MAX(SO.invoice_no) AS invoice_no,
                MAX(SO.delivered_on_date) AS delivered_on_date,
                MAX(SO.file) AS file
            FROM SALES_ORDER_ITEM_LIST_NEW AS SOI
            INNER JOIN SALES_ORDER_MST AS SO
                ON SOI.sales_order_id = SO.id
            INNER JOIN CRM_CREATE_PROPOSAL_MST AS P
                ON SO.proposal_id = P.id
            INNER JOIN CUSTOMER_PROFILE_MST AS CU 
                ON P.customer_id = CU.id
            INNER JOIN CUSTOMER_ADDRESS_CONTACT_MST AS CA 
                ON SO.customer_contact_id = CA.id
            INNER JOIN  CRM_PROPOSAL_LIST_MST AS PI 
                ON P.id = PI.proposal_id
            LEFT JOIN  CRM_PROPOSAL_BRANDING AS PB 
                ON PI.id = PB.proposal_item_id
            LEFT JOIN  CRM_PROPOSAL_CUSTOMISATION_TYPE AS PC 
                ON PI.id = PC.proposal_item_id
            INNER JOIN WH_VH_PLANNING_SO AS VPSO 
            	 ON SO.id = VPSO.sale_order_id
            INNER JOIN WH_VH_PLANNING_MST AS VP
            	 ON VPSO.planning_id = VP.id
            INNER JOIN WH_VH_PLANNING_TRANSPORTER AS PT ON PT.vehicle_planing_id = VP.id
           -- WHERE SO.dispatch_status='APPROVED'          
            GROUP BY  SOI.sales_order_id
            ORDER BY SO.sales_order_no DESC;
        `)    

    // console.log(data, "=========formattedList==========");
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
};

module.exports.updatePodStatus = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { so_id, dispatch_status, pod_remark } = req.body;

    if (!so_id) {
      return res.status(400).send({
        code: 400,
        message: "SO ID is required"
      });
    }

    if (!dispatch_status) {
      return res.status(400).send({
        code: 400,
        message: "Dispatch status is required"
      });
    }

    if (
      dispatch_status === 'REJECTED' &&
      (!pod_remark || !pod_remark.trim())
    ) {
      return res.status(400).send({
        code: 400,
        message: "Rejection reason is required"
      });
    }

    const soData = await db.salesOrder.findOne({
      where: { id: so_id },
      transaction: t
    });

    if (!soData) {
      return res.status(404).send({
        code: 404,
        message: "Sales Order not found"
      });
    }

    const updateData = {
        dispatch_status
    };

    if (dispatch_status === 'REJECTED') {
        updateData.pod_remark = pod_remark || null;
    }

    await db.salesOrder.update(
      updateData,
      {
        where: { id: so_id },
        transaction: t
      }
    );

    await t.commit();

    return res.status(200).send({
      code: 200,
      message: `POD ${dispatch_status === 'APPROVED' ? 'approved' : 'rejected'} successfully`
    });

  } catch (error) {
    await t.rollback();

    console.error(error);

    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error"
    });
  }
};