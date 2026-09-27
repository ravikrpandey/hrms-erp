const db = require("../../../models/index");
const axios = require("axios");


module.exports.genrateIRN = async (req, res) => {
  try {
    const { vehicle_planing_id } = req.body;

    const vehicleGateIn = await db.vehicleGateInOutword.findOne({
      where: { vehicle_planing_id },
      attributes: ["id", "warehouse_id","LR_number"]
    });

    const vehiclePlanningSoDatails = await db.vehiclePlanningSo.findOne({
      where: { planning_id: vehicle_planing_id },
      attributes: ["sale_order_id"]
    });

    const warehouseData = await db.warehouse.findOne({
      where: { id: vehicleGateIn.warehouse_id }
    });
   
    const userExist = await db.user.findOne({
      where: { employee_id: warehouseData.manager_id },
      attributes: ["employee_official_email", "first_name", "contact_number"]
    });

    const salesOrderData = await db.salesOrder.findOne({
      where: { id: vehiclePlanningSoDatails.sale_order_id }
    });
    const rawDate = salesOrderData.sales_order_date;
    const formattedDate = new Date(rawDate).toLocaleDateString('en-GB');
   
    const customerData = await db.customerProfile.findOne({
      where: { id: salesOrderData.customer_id }
    });

    const customerAddressData = await db.customerAddress.findOne({
      where: { customer_id: customerData.id }
    });

    const customerAddressContractData = await db.customerAddressContact.findOne({
      where: { customer_id: customerData.id }
    });
     const customerAddressShipingData = await db.customerShippingAddress.findOne({
      where: { customer_id: customerData.id }
    });
    const vehicleExist = await db.vehiclePlanningTransporter.findOne({where:{vehicle_planing_id:vehicle_planing_id}})
    const vehicleExistData = await db.vehiclePlanningMst.findOne({where:{id:vehicle_planing_id}})
  
const vehicleData = await db.vehicleType_master.findOne({where:{vehicle_type_id:vehicleExistData?.vehicle_type_id},attributes:['vehicle_type_id','vehicle_type_name']})
const vehicleDataList = await db.vehicle_master.findOne({where:{vehicle_type_id:vehicleData?.vehicle_type_id},attributes:['id','vehicle_type_id','vehicle_number']})

const transportData = await db.transport_master.findOne({where:{id:vehicleExist.transportor_id},attributes:['id','tm_code','tm_name','createdAt']})

const rawDates = transportData.createdAt;
    const formattedDates = new Date(rawDates).toLocaleDateString('en-GB');
const startDate = salesOrderData.createdAt;
    const startDateData = new Date(startDate).toLocaleDateString('en-GB');

const salesExist = await db.salesInvoiceData.findOne({where:{so_id:salesOrderData.id}})

const [itemListDB] = await db.sequelize.query(`
      SELECT SO.qty,MI.item_name AS product_name,SO.price_per_unit AS price,
ROUND((ifnull(SO.igst, 0) + ifnull(SO.cgst, 0) + ifnull(SO.sgst, 0)), 2) AS gst_rate,ROUND((SO.qty * SO.price_per_unit), 2) AS taxable_value,
MU.uom_name,SO.discount_per_unit,MI.item_code,SO.igst,SO.cgst,SO.sgst,MH.hsn_sac_code AS hsn_code,
ROUND((SO.qty * SO.discount_per_unit), 2) AS item_discount_amount,
ROUND(((SO.qty * SO.price_per_unit) - (SO.qty * SO.discount_per_unit)), 2) AS item_total_before_tax,
ROUND(((SO.qty * SO.price_per_unit) * (ifnull(SO.igst, 0) + ifnull(SO.cgst, 0) + ifnull(SO.sgst, 0)) / 100), 2) AS item_gst_amount,
ROUND((((SO.qty * SO.price_per_unit) - (SO.qty * SO.discount_per_unit)) + 
     ((SO.qty * SO.price_per_unit) * (ifnull(SO.igst, 0) + ifnull(SO.cgst, 0) + ifnull(SO.sgst, 0)) / 100)), 2) AS item_final_amount,
    
    ROUND(SUM(SO.qty * SO.discount_per_unit) OVER(), 2) AS totalDiscountAmount,
    ROUND(SUM(SO.qty * SO.price_per_unit) OVER(), 2) AS total_item_amount,
    ROUND(SUM(
        ((SO.qty * SO.price_per_unit) - (SO.qty * SO.discount_per_unit)) + 
        ((SO.qty * SO.price_per_unit) * (ifnull(SO.igst, 0) + ifnull(SO.cgst, 0) + ifnull(SO.sgst, 0)) / 100)
    ) OVER(), 2) AS total_amount

FROM CRM_SALES_INVOICE_MST AS S
INNER JOIN CRM_SALES_INVOICE_ITEM AS SO ON SO.invoice_id = S.id
INNER JOIN MASTER_ITEM AS MI ON MI.id = SO.item_id 
INNER JOIN SALES_ORDER_MST AS SM ON SM.id = S.so_id 
LEFT JOIN MASTER_HSN_SAC_CODE AS MH ON MH.id = MI.hsn_code_id
LEFT JOIN MASTER_UOM AS MU ON MU.uom_id = MI.uom_id
WHERE SM.id = ${salesOrderData?.id}
GROUP BY S.id, SO.qty, MI.item_name, SO.price_per_unit, MU.uom_name, 
         SO.discount_per_unit, MI.item_code, SO.igst, SO.cgst, SO.sgst, MH.hsn_sac_code 
    `);

    const itemList = itemListDB.map((item, index) => {
      const price = Number(item.price || 0);
      const qty = Number(item.qty || 0);
      const discount = Number(item.totalDiscountAmount || 0);
    
      const grossAmount = price * qty;
  
      const taxableValue = grossAmount - discount;
    
      let igstAmt = 0, cgstAmt = 0, sgstAmt = 0;
    
      // if (isIntraState) {
        cgstAmt = (taxableValue * Number(item.cgst || 0)) / 100;
        sgstAmt = (taxableValue * Number(item.sgst || 0)) / 100;
      // } else {
        igstAmt = (taxableValue * Number(item.igst || 0)) / 100;
      // }
    
      const totalItemValue = taxableValue + igstAmt + cgstAmt + sgstAmt;
    
      return {
        SlNo: String(index + 1),
    
        PrdDesc: item.product_name,
        IsServc: "N",
    
        HsnCd: item.hsn_code,
    
        Qty: String(qty),
        Unit: item.uom_name,
        UnitPrice: price.toFixed(2),

        TotAmt: grossAmount.toFixed(2),     
        Discount: discount.toFixed(2),
        AssAmt: taxableValue.toFixed(2),    
    
        GstRt: String(item.gst_rate || 0),
    
        IgstAmt: igstAmt.toFixed(2),
        CgstAmt: cgstAmt.toFixed(2),
        SgstAmt: sgstAmt.toFixed(2),
    
        TotItemVal: totalItemValue.toFixed(2),
    
   
        PreTaxVal: grossAmount.toFixed(2),
        OthChrg: "0",
    
        CesRt: "0",
        CesAmt: "0",
        CesNonAdvlAmt: "0",
    
        StateCesRt: "0",
        StateCesAmt: "0",
        StateCesNonAdvlAmt: "0",
    
        FreeQty: "0",
    
        Barcde: item.item_code || "",
        PrdSlNo: String(item.product_master_id || index + 1),
        OrdLineRef: String(index + 1),
        OrgCntry: "IN",
    
        AttribDtls: [
          {
            Nm: item.product_name,
            Val: totalItemValue.toFixed(2)
          }
        ],
    
        BchDtls: {
          Nm: item.item_code,
          ExpDt: null,
          WrDt: null
        }
      };
    });

    const payload = {
      Version: "1.1",

      AddlDocDtls: [
        {
          Docs: "Test Doc",
          Info: "Document Test",
          Url: "https://einv-apisandboxe.nic.in"
        }
      ],

      BuyerDtls: {
        Addr1: customerAddressData.billing_address?.slice(0, 99),
        Addr2: customerAddressData.billing_address?.slice(0, 99),
        Em: customerAddressContractData.email_id,
        Gstin: customerAddressData.gst_in,
        LglNm: customerData.company_name,
        Loc: customerAddressData.billing_address.slice(0, 99),
        Ph: customerAddressContractData.mobile,
        Pin: customerAddressData.billing_pin_code,
        Pos: customerAddressData.gst_in?.slice(0, 2),
        Stcd: customerAddressData.gst_in?.slice(0, 2),
        TrdNm: customerAddressContractData.contact_person_name
      },

      DispDtls: {
        Addr1: warehouseData.address?.slice(0, 99),
        Addr2: warehouseData?.postal_address?.Name,
        Loc: warehouseData?.postal_address?.District,
        Nm: userExist?.first_name,
        Pin: warehouseData?.pin,
        Stcd: warehouseData?.gst?.slice(0, 2)
      },

      DocDtls: {
        Dt: formattedDate,
        No: salesExist.sales_invoice_no,
        Typ: "INV"   // 
      },

 
      ItemList: itemList,

     
      EwbDtls: {
        Distance: "100", 
        TransDocDt: formattedDates,
        TransDocNo: vehicleGateIn.LR_number,
        TransId: transportData.tm_gst_number,
        TransMode: "1",   
        TransName: transportData.tm_name,
        VehNo: vehicleDataList?.vehicle_number,
        VehType: 'R'
      },

     
      ExpDtls: {
        CntCode: "AE",
        ExpDuty: null,
        ForCur: "AED",
        Port: "INABG1",
        RefClm: "N",
        ShipBDt: "01/08/2020",
        ShipBNo: "A-248"
      },

   
      PayDtls: {
        AccDet: "5697389713210",
        CrDay: "100",
        CrTrn: "test",
        DirDr: "test",
        FinInsBr: "SBIN11000",
        Mode: "Cash",
        Nm: "ABCDE",
        PaidAmt: "10000",
        PayInstr: "Gift",
        PayTerm: "100",
        PaymtDue: "5000"
      },

   
      RefDtls: {
        InvRm: salesOrderData.pod_remark,
        DocPerdDtls: {
          InvEndDt: startDateData,
          InvStDt: startDateData
        },
        PrecDocDtls: [
          {
            InvDt: startDateData,
            InvNo: salesOrderData.elan_sales_order_no,
            OthRefNo: "null"
          }
        ],
        ContrDtls: [
          {
            ContrRefr: "Co123",
            ExtRefr: "Yo456",
            PORefDt: "01/08/2020",
            PORefr: "Doc-789",
            ProjRefr: "Doc-456",
            RecAdvDt: "01/08/2020",
            RecAdvRefr: "Doc/003",
            TendRefr: "Abc001"
          }
        ]
      },

      SellerDtls: {
        Addr1: warehouseData.address?.slice(0, 99),
        Addr2: warehouseData?.postal_address?.Name,
        Em: userExist.employee_official_email,
        Gstin: warehouseData.gst,
        LglNm: userExist.first_name,
        Loc: warehouseData?.postal_address?.District,
        Ph: userExist.contact_number,
        Pin: warehouseData.pin,
        Stcd: warehouseData.gst?.slice(0, 2),
        TrdNm: warehouseData.name
      },

      ShipDtls: {
        Addr1: customerAddressShipingData.shipping_address?.slice(0, 99),
        Addr2: customerAddressShipingData.shipping_address?.slice(0, 99),
        Gstin: customerAddressShipingData.shipping_gst_in,
        LglNm: customerData.company_name,
        Loc: customerAddressShipingData.shipping_address?.slice(0, 99),
        Pin: customerAddressShipingData.shipping_pin_code,
        Stcd: customerAddressShipingData.shipping_gst_in?.slice(0, 2),
        TrdNm: customerAddressContractData.contact_person_name
      },

      TranDtls: {
        EcmGstin: null,
        IgstOnIntra: "N",
        RegRev: "N",
        SupTyp: "B2B",
        TaxSch: "GST"
      },

      ValDtls: {
        AssVal: itemList.reduce((s, i) => s + Number(i.AssAmt), 0),
        CgstVal: itemList.reduce((s, i) => s + Number(i.CgstAmt), 0),
        SgstVal: itemList.reduce((s, i) => s + Number(i.SgstAmt), 0),
        IgstVal: itemList.reduce((s, i) => s + Number(i.IgstAmt), 0),
        TotInvVal: itemList.reduce((s, i) => s + Number(i.TotItemVal), 0),
        TotInvValFc: itemList.reduce((s, i) => s + Number(i.TotItemVal), 0)
      }
    };

    async function getValidToken(otpExist) {
      const now = new Date();
      if (
        otpExist.token &&
        otpExist.token_expiry &&
        new Date(otpExist.token_expiry) > now
      ) {
        return otpExist.token;
      }
    

      const loginUser = await axios.post(
        "https://amzgstapp.kdksoftware.co.in/api/v1/auth/login",
        {
          country_code: "+91",
          mobile_no: customerAddressContractData.mobile,
          password: "Kdk@12345",
        }
      );
    
      const token = loginUser.data.data.token;
    
      const expiry = new Date(Date.now() + 2 * 60 * 60 * 1000);
      await db.otpVerificationCustomer.update(
        {
          token:loginUser.data.data.token,
          token_expiry: expiry,
        },
        {
          where: { customer_id: customerAddressContractData.customer_id },
        }
      );
    
      return token;
    }
    const otpExist = await db.otpVerificationCustomer.findOne({
      where: { customer_id: customerAddressContractData.customer_id }
    });
    
    const token = await getValidToken(
      otpExist
    );
console.log('===========dkfm============',token)
console.log('===========dkfm==not token==========',payload)
  
    const response = await axios.post(
      "https://amzgstapp.kdksoftware.co.in/api/v2/einvoice/generate-irn",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );
   
    await db.vehiclePlanningMst.update({irn_status:'Approved'},{where:{id:vehicle_planing_id}})
    await db.generateIrn.create({Irn:response.data?.data?.Irn,einvoice_company_id:response.data?.data?.einvoice_company_id,
      einvoice_id:response.data?.data?.einvoice_id,vehicle_planing_id,customer_id:customerAddressContractData.customer_id})
  
    return res.status(200).send({
      message: "IRN Generated Successfully",
      data: response.data 
    });

  } catch (error) {
  
    return res.status(500).send({
      message: error?.response?.data || error.message
    });
  }
};


module.exports.genratePdfinvoice= async(req,res)=>{
  try {
    const {vehicle_planing_id} = req.body;
   
    const geeratePdfInvoice = await db.generateIrn.findOne({where:{vehicle_planing_id}})
    
    async function getValidToken(otpExist) {
      const now = new Date();
      if (
        otpExist.token &&
        otpExist.token_expiry &&
        new Date(otpExist.token_expiry) > now
      ) {
        return otpExist.token;
      }
    
     
      const loginUser = await axios.post(
        "https://amzgstapp.kdksoftware.co.in/api/v1/auth/login",
        {
          country_code: "+91",
          mobile_no: otpExist.mobile_no,
          password: "Kdk@12345",
        }
      );
    
      const token = loginUser.data.data.token;
    
      const expiry = new Date(Date.now() + 2 * 60 * 60 * 1000);
      await db.otpVerificationCustomer.update(
        {
          token:loginUser.data.data.token,
          token_expiry: expiry,
        },
        {
          where: { customer_id: geeratePdfInvoice.customer_id },
        }
      );
    
      return token;
    }
    const otpExist = await db.otpVerificationCustomer.findOne({
      where: { customer_id: geeratePdfInvoice.customer_id }
    });
    
    const token = await getValidToken(
      otpExist
    );

    const response = await axios({
      method: "post",
      url: "https://amzgstapp.kdksoftware.co.in/api/v3/einvoice/books/download-einvoice",
      data: JSON.stringify({
       einvoice_id:geeratePdfInvoice.einvoice_id,
      import_method:geeratePdfInvoice.import_method,
      type:geeratePdfInvoice.type
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/pdf",  
        "Authorization": `Bearer ${token}`, 
       },
      responseType: "arraybuffer"
    });

    return res.status(200).send({
      message: "E-Invoice generated Successfully",
      data: response.data
    });
  } catch (error) {
  
    return res.status(500).send({
      message: error?.response?.data || error.message
    });
  }
}
module.exports.genratePdfEwayinvoice= async(req,res)=>{
  try {
    const {vehicle_planing_id} = req.body;
   
    const geeratePdfInvoice = await db.generateIrn.findOne({where:{vehicle_planing_id}})
    
    async function getValidToken(otpExist) {
      const now = new Date();
      if (
        otpExist.token &&
        otpExist.token_expiry &&
        new Date(otpExist.token_expiry) > now
      ) {
        return otpExist.token;
      }
    
     
      const loginUser = await axios.post(
        "https://amzgstapp.kdksoftware.co.in/api/v1/auth/login",
        {
          country_code: "+91",
          mobile_no: otpExist.mobile_no,
          password: "Kdk@12345",
        }
      );
    
      const token = loginUser.data.data.token;
    
      const expiry = new Date(Date.now() + 2 * 60 * 60 * 1000);
      await db.otpVerificationCustomer.update(
        {
          token:loginUser.data.data.token,
          token_expiry: expiry,
        },
        {
          where: { customer_id: geeratePdfInvoice.customer_id },
        }
      );
    
      return token;
    }
    const otpExist = await db.otpVerificationCustomer.findOne({
      where: { customer_id: geeratePdfInvoice.customer_id }
    });
    
    const token = await getValidToken(
      otpExist
    );

    const response = await axios({
      method: "post",
      url: "https://amzgstapp.kdksoftware.co.in/api/v1/ewb/books/download-ewb",
      data: JSON.stringify({
        ewb_id:geeratePdfInvoice.ewb_id,
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/pdf",  
        "Authorization": `Bearer ${token}`, 
       },
      responseType: "arraybuffer"
    });

    return res.status(200).send({
      message: "E-Invoice generated Successfully",
      data: response.data
    });
  } catch (error) {
  
    return res.status(500).send({
      message: error?.response?.data || error.message
    });
  }
}
module.exports.getEinvoiceList= async(req,res)=>{
  try {
    
    const [dataList] = await db.sequelize.query(
      `SELECT 
    MAX(G.id) AS id,
    MAX(G.gate_inward_status) AS gate_inward_status,
    MAX(G.gate_inward_date) AS gate_inward_date,
    MAX(G.gate_outward_status) AS gate_outward_status,
    MAX(G.gate_outward_date) AS gate_outward_date,
    MAX(G.pickList_status) AS pickList_status,
    MAX(G.LR_status) AS LR_status,
    MAX(G.LR_number) AS LR_number,
    MAX(G.vehicle_number) AS vehicle_number,
    MAX(G.driver_name) AS driver_name,
    MAX(G.driver_contact) AS driver_contact,
    MAX(G.vehicle_driver_remark) AS vehicle_driver_remark,
    MAX(G.createdAt) AS createdAt,
    MAX(G.updatedAt) AS updatedAt,
    MAX(G.gateIn_updated_by) AS gateIn_updated_by,
    MAX(G.gateOut_updated_by) AS gateOut_updated_by,
    MAX(G.vehicle_planing_id) AS vehicle_planing_id,
    MAX(G.warehouse_id) AS warehouse_id,

    MAX(P.planning_code) AS planning_code,
    MAX(P.vehicle_root_status) AS vehicle_root_status,

    MAX(CONCAT(W.name, ' - ', W.code) COLLATE utf8mb4_unicode_ci) AS warehouse_name,

    MAX(S.pickup_date) AS pickup_date,
    MAX(S.gate_by_pass) AS gate_by_pass,

    MAX(
        COALESCE(
            NULLIF(G.driver_name, '') COLLATE utf8mb4_unicode_ci,
            CONCAT(D.full_name, ' - ', D.driver_code) COLLATE utf8mb4_unicode_ci
        )
    ) AS driver_name,

    MAX(
        COALESCE(
            NULLIF(G.driver_contact, '') COLLATE utf8mb4_unicode_ci,
            D.mobile_number COLLATE utf8mb4_unicode_ci
        )
    ) AS driver_contact,

    MAX(
        COALESCE(
            NULLIF(G.vehicle_number, '') COLLATE utf8mb4_unicode_ci,
            V.vehicle_number COLLATE utf8mb4_unicode_ci
        )
    ) AS vehicle_number,

    MAX(CONCAT(TM.tm_name, ' - ', TM.tm_code) COLLATE utf8mb4_unicode_ci) AS tm_name

FROM WH_VH_PLANNING_GATEIN_OUT AS G

INNER JOIN WH_VH_PLANNING_MST AS P
    ON P.id = G.vehicle_planing_id

INNER JOIN WAREHOUSE_MASTER AS W
    ON W.id = G.warehouse_id

INNER JOIN (
    SELECT planning_id, warehouse_id, MAX(id) AS max_id
    FROM WH_VH_PLANNING_SO
    GROUP BY planning_id, warehouse_id
) AS S1
    ON S1.planning_id = P.id
   AND S1.warehouse_id = W.id

INNER JOIN WH_VH_PLANNING_SO AS S
    ON S.id = S1.max_id

LEFT JOIN WH_VH_PLANNING_TRANSPORTER AS T
    ON T.vehicle_planing_id = G.vehicle_planing_id

LEFT JOIN TM_TRANSPORTER_MASTER AS TM
    ON TM.id = T.transportor_id

LEFT JOIN TM_VEHICAL_DRIVER AS D
    ON D.driver_id = T.driver_id

LEFT JOIN TM_VEHICLE_MASTER AS V
    ON V.id = T.vehicle_id

WHERE
    P.irn_status='Approved'

GROUP BY
    S1.planning_id,
    S1.warehouse_id

ORDER BY createdAt DESC`
    )
    return res.status(200).send({code: 200,message: "Fetch data successfully",data: dataList});
  } catch (error) {
  
    return res.status(500).send({
      message: error?.response?.data || error.message
    });
  }
}