const db = require("../../../models/index");

module.exports.createDeliverychallan = async (req, res) => {
  const { entity_id, financial_year_id } = req.params;
  try {
    let {
      do_type,
      proposal_id,
      supply_type,
      do_date,
      do_no,
      customer_id,
      customer_name,
      customer_code,
      transition_type,
      billing_branch,
      billing_country,
      billing_state,
      billing_city,
      billing_pin,
      billing_add1,
      billing_add2,
      supplier_gst,
      gst_supplier_name,
      trade_name,
      shipping_country,
      shipping_state,
      shipping_city,
      shipping_pin,
      shipping_add1,
      shipping_add2,
      notes,
      terms_and_conditions,
      items,
      returnableItems,
      challanDoc,
      states_code,
      customer_billing_country,
      customer_billing_state,
      customer_billing_city,
      customer_billing_pin,
      customer_billing_add1,
      customer_billing_add2,
      customer_gst_number,
      challan_type_status,
      delChallan_supply_type
    } = req.body;
    if (transition_type == 1) {
      (shipping_country = null),
        (shipping_state = null),
        (shipping_city = null),
        (shipping_pin = null),
        (shipping_add1 = null),
        (shipping_add2 = null);
    }
    const createData = await db.sales_delivery_challan.create({
      do_type_id: do_type,
      supply_type_id: supply_type,
      do_date,
      do_no,
      so_id:proposal_id,
      customer_name,
      customer_id,
      customer_code,
      trans_type_id: transition_type,
      billing_branch_id: billing_branch,
      billing_country_id: billing_country,
      billing_state_id: billing_state,
      billing_city_id: billing_city,
      billing_pin,
      billing_add1,
      billing_add2,
      supplier_gst,
      gst_supplier_name,
      trade_name,
      shipping_country_id: shipping_country,
      shipping_state_id: shipping_state,
      shipping_city_id: shipping_city,
      shipping_pin,
      shipping_add1,
      shipping_add2,
      customer_billing_country_id: customer_billing_country,
      customer_billing_state_id: customer_billing_state,
      customer_billing_city_id: customer_billing_city,
      customer_billing_pin,
      customer_billing_add1,
      customer_billing_add2,
      notes,
      terms_and_conditions,
      entity_id,
      financial_year_id,
      challanDoc,
      states_code,
      customer_gst_number,
      challan_type_status,
      delChallan_supply_type
    });

    await Promise.all(
      items.map(async (item) => {
        const {
          product_category_id,
          product_master_id,
          product_sub_category_id,
          
          hsn_code,
          quantity,
          maximum_discount,
          discount_request,
          igst,
          sgst,
          cgst,
          price_per_unit,
        } = item;
        await db.sales_delivery_challan_item.create({
          sales_delivery_challan_id: createData.id,
          product_category_id,
          product_master_id,
          pro_sub_cat_id:product_sub_category_id ,
          hsn_code,
          quantity: quantity,
          maximum_discount,
          discount_request,
          igst,
          sgst,
          cgst,
          price_per_unit,
        });
      })
    );

    await Promise.all(
      returnableItems.map(async (product) => {
        const {
          product_category_id,
          product_master_id,
          variant_id,
          hsn_code,
          proposed_quantity,
        } = product;
        product_category_id ? product_category_id : null;
        product_master_id ? product_master_id : null;
        variant_id ? variant_id : null;
        hsn_code ? hsn_code : null;

        await db.sales_delivery_challan_returnable_item.create({
          sales_delivery_challan_id: createData.id,
          product_category_id,
          product_master_id,
          variant_id,
          hsn_code,
          quantity: proposed_quantity,
        });
      })
    );

    if (createData) {
     
          const currentDate = new Date();
          const formattedDate = currentDate
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, '');
          const randomNumber = Math.floor(1000 + Math.random() * 9000);
         let invoiceNo= 'INV' + formattedDate + randomNumber;
        
      
        await db.salesInvoiceData.create({
                  sales_invoice_no :invoiceNo, sales_invoice_date:do_date, do_no, do_id:createData.id, so_id:proposal_id
              });
      return res
        .status(201)
        .send({ code: 201, message: "Invoice has been created successFully" });
    } else {
      return res.status(200).send({ code: 400, message: "Not Created " });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.getCustomerDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT   CP.gst_in AS gst_number ,CA.* 
    FROM CUSTOMER_PROFILE_MST AS CP
    INNER JOIN CUSTOMER_ADDRESS_MST AS CA ON CP.id = CA.customer_id
    WHERE CA.id = ${id} AND CP.is_Deleted = false`;

    const result = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    res
      .status(200)
      .send({ code: 200, message: "Available list", data: result });
  } catch (error) {
    res
      .status(500)
      .send({ code: 500, message: error?.message || "Internal server error" });
  }
};


module.exports.getAllDeliveryChallan = async (req, res) => {
  try {
      const { entity_id, financial_year_id } = req.params;
      const [getData] = await db.sequelize.query(`
          SELECT DCM.*,DTM.name AS do_type_name,MB.branch_name AS billing_branch_name
          FROM CRM_DELIVERY_CHALLAN_MST DCM
          LEFT JOIN CRM_DOCUMENT_TYPE_MST DTM ON DCM.do_type_id = DTM.id
          LEFT JOIN MASTER_BRANCH MB ON DCM.billing_branch_id = MB.id
          WHERE DCM.is_deleted = false AND DCM.entity_id = ${entity_id} AND DCM.financial_year_id = ${financial_year_id}
          ORDER BY DCM.createdAt DESC
      `);

      if (getData.length > 0) {
          return res.status(200).send({ code: 200, message: 'All delivery challan data fetched successfully!', data: getData });
      } else {
          return res.status(201).send({ code: 201, message: 'Data not found!' });
      }

  } catch (error) {
      console.error(error);
      return res.status(500).send({ code: 500, message: error.message || 'Internal server error!' });
  }
};



module.exports.getSOListFORInvoice = async (req,res)=>{
  try {
    
    
    const soList = await db.salesOrder.findAll({
      include: [{
        model: db.vehiclePlanningSo,        
        required: true,
        as:'warehousePlaningPickup',
        include: [{
          model: db.vehiclePlanningMst,
          as: 'saleOrders',
          required: true,
          where: {
            LR_status: 'APPROVED'
          }
        }]
      },
      {
        model:db.proposalData,
        require:true,
        as:"proposalData",
        include:[
          {
            model:db.customerProfile,
            as:'customerData',
          },
          {
            model:db.customerAddressContact,
            as:'contactPerson',
          }
        ]
      }]
    });
    if(!soList.length){
      return res.status(400).send({code:400, success:false, message:'So not found'});
    }else{
      return res.status(200).send({code:200, success:true, message:'SO list',data:soList});
      
    }
    
    
  } catch (error) {
    return res.status(500).send({code:500, success:false, message:error.message});
    
  }
}