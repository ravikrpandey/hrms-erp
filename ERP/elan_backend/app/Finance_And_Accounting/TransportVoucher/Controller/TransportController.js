const db = require('../../../models/index')




module.exports.createTransportVoucher = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      bill_invoice_number,
      gstin,
      transportList = [],
      address,
      sac_number,
      transport_date,
      vendor_id,
      gross_total,
      total_tds,
      transport_id,
      grand_total,
      tds_id,
      nature_id,
      Account_details = [],
      branch_id,
      currency_id,
      taxable_value,
      gst_type,
      gst_total,
      igst,
      cgst,
      sgst,
      rcm_check,
      finalAmount,
      less_value,
      is_round_off,
      round_off,
      rounded_payable_amount,
      entity_id,
      financial_id
    } = req.body;

    const currencyExist = await db.currency_convert.findOne({
      where: {
        Currency_Convert_id: currency_id
      },
      attributes: [
        'Currency_Convert_id',
        'rate'
      ],
      transaction
    });

    if (!currencyExist) {
      throw new Error('Currency not found');
    }

    const currencyRate = Number(currencyExist.rate || 1);

    const convertToINR = (amount) => {
      return Number(amount || 0) / currencyRate;
    };

    const originalGrandTotal = Number(grand_total || 0);

    const hasRoundedPayable =
      rounded_payable_amount !== undefined &&
      rounded_payable_amount !== null &&
      rounded_payable_amount !== '';

    const payableAmount = hasRoundedPayable
      ? Number(rounded_payable_amount)
      : originalGrandTotal;

    const actualRoundOff = Number(
      (payableAmount - originalGrandTotal).toFixed(2)
    );

    const tranportVoucher = await db.transportVoucher.create({
      bill_invoice_number,
      GSTIN: gstin,
      Address: address,
      sac_code: sac_number,
      date: transport_date,
      transport_id,
      is_round_off,
      round_off: actualRoundOff,
      rounded_payable_amount: payableAmount,
      gross_total,
      less_value: less_value,
      total_tds,
      grand_total,
      tds_id,
      nature_id,
      rcm_check,
      branch_id,
      taxable_value,
      gst_total,
      igst,
      cgst,
      sgst,
      entity_id,
      currency_id,
      currency_rate: currencyRate
    }, {
      transaction
    });

    await Promise.all(
      transportList.map(async (i) => {
        const {
          LR_number,
          LR_Date,
          LR_id,
          billing_address,
          shipping_address,
          vehicle_number
        } = i;

        await db.transportVoucherList.create({
          LR_number,
          date: LR_Date,
          from: billing_address,
          vehicle_number,
          to: shipping_address,
          transport_voucher_id: tranportVoucher.id,
          LR_id
        }, {
          transaction
        });
      })
    );

    const allEntries = [];

    let totalDebit = 0;
    let totalCredit = 0;

    const addEntry = ({
      debit_amount = 0,
      credit_amount = 0,
      chart_account_id,
      entry_status,
      party_type,
      transport_id: entryTransportId
    }) => {
      const debit = Number(debit_amount || 0);
      const credit = Number(credit_amount || 0);

      allEntries.push({
        debit_amount: debit,
        credit_amount: credit,
        chart_account_id,
        entity_id,
        financial_id,
        branch_id,
        currency_id,
        currency_rate: currencyRate,
        entry_status,
        document_number: bill_invoice_number,
        ...(party_type ? { party_type } : {}),
        ...(entryTransportId
          ? { transport_id: entryTransportId }
          : {})
      });

      totalDebit += debit;
      totalCredit += credit;
    };

    for (const i of Account_details) {
      const {
        charges_name,
        amount,
        parent_chart_account_id,
        child_chart_account_id
      } = i;

      await db.transportChargesList.create({
        charges_name,
        amount,
        parent_chart_account_id,
        chart_account_id: child_chart_account_id,
        transport_voucher_id: tranportVoucher.id
      }, {
        transaction
      });

      addEntry({
        debit_amount: convertToINR(amount),
        credit_amount: 0,
        chart_account_id: child_chart_account_id,
        entry_status: charges_name
      });
    }

    const gstINR = convertToINR(gst_total);
    const cgstValue = Number(cgst || 0);
    const sgstValue = Number(sgst || 0);

    if (rcm_check) {
      if (cgstValue > 0 && sgstValue > 0) {
        const divideGST = gstINR / 2;

        addEntry({
          debit_amount: divideGST,
          credit_amount: 0,
          chart_account_id: 404,
          entry_status: 'RCM GST Transport Voucher'
        });

        addEntry({
          debit_amount: divideGST,
          credit_amount: 0,
          chart_account_id: 405,
          entry_status: 'RCM GST Transport Voucher'
        });

        addEntry({
          debit_amount: 0,
          credit_amount: divideGST,
          chart_account_id: 401,
          entry_status: 'RCM GST Transport Voucher'
        });

        addEntry({
          debit_amount: 0,
          credit_amount: divideGST,
          chart_account_id: 402,
          entry_status: 'RCM GST Transport Voucher'
        });
      } else if (gstINR > 0) {
        addEntry({
          debit_amount: gstINR,
          credit_amount: 0,
          chart_account_id: 403,
          entry_status: 'RCM GST Transport Voucher'
        });

        addEntry({
          debit_amount: 0,
          credit_amount: gstINR,
          chart_account_id: 400,
          entry_status: 'RCM GST Transport Voucher'
        });
      }
    } else {
      if (gstINR > 0) {
        if (cgstValue > 0 && sgstValue > 0) {
          const divideGST = gstINR / 2;

          addEntry({
            debit_amount: divideGST,
            credit_amount: 0,
            chart_account_id: 21,
            entry_status: 'Transport Voucher'
          });

          addEntry({
            debit_amount: divideGST,
            credit_amount: 0,
            chart_account_id: 41,
            entry_status: 'Transport Voucher'
          });
        } else {
          addEntry({
            debit_amount: gstINR,
            credit_amount: 0,
            chart_account_id: 29,
            entry_status: 'Transport Voucher'
          });
        }
      }
    }

    const tdsINR = convertToINR(total_tds);

    if (tdsINR > 0) {
      addEntry({
        debit_amount: 0,
        credit_amount: tdsINR,
        chart_account_id: 45,
        entry_status: 'Transport Voucher',
        party_type: 'VENDOR',
        transport_id
      });
    }

    const lessValueINR = convertToINR(less_value);

    if (lessValueINR > 0) {
      addEntry({
        debit_amount: lessValueINR,
        credit_amount: 0,
        chart_account_id: 51,
        entry_status: 'DEBIT NOTE',
        party_type: 'VENDOR',
        transport_id
      });

      addEntry({
        debit_amount: 0,
        credit_amount: lessValueINR,
        chart_account_id: 347,
        entry_status: 'DEBIT NOTE'
      });

      const debitNote = await db.creditDebitNote.create({
        amount: lessValueINR,
        builder_date: transport_date,
        document_number: bill_invoice_number,
        note_type: 'DEBIT NOTE',
        entity_id,
        transport_voucher_id: tranportVoucher.id,
        currency_id,
        currency_rate: currencyRate
      }, {
        transaction
      });

      await db.creditDebitNoteItem.create({
        credit_debit_note_id: debitNote.id,
        total_with_gst: lessValueINR,
        total_discount_amount: lessValueINR,
        total_price: lessValueINR
      }, {
        transaction
      });
    }

    const payableAmountINR = convertToINR(payableAmount);

    addEntry({
      debit_amount: 0,
      credit_amount: payableAmountINR,
      chart_account_id: 51,
      entry_status: 'Transport Voucher',
      party_type: 'VENDOR',
      transport_id
    });

    const roundOffINR = convertToINR(actualRoundOff);

    if (Math.abs(roundOffINR) > 0.001) {
      if (actualRoundOff < 0) {
        addEntry({
          debit_amount: 0,
          credit_amount: Math.abs(roundOffINR),
          chart_account_id: 339,
          entry_status: 'ROUND OFF',
          party_type: 'VENDOR',
          transport_id
        });
      } else {
        addEntry({
          debit_amount: Math.abs(roundOffINR),
          credit_amount: 0,
          chart_account_id: 339,
          entry_status: 'ROUND OFF',
          party_type: 'VENDOR',
          transport_id
        });
      }
    }

    const balanceDifference = Number(
      (totalDebit - totalCredit).toFixed(2)
    );

    if (Math.abs(balanceDifference) > 0.01) {
      throw new Error(
        `Journal is not balanced. Debit: ${totalDebit.toFixed(2)}, Credit: ${totalCredit.toFixed(2)}, Difference: ${balanceDifference.toFixed(2)}`
      );
    }

    for (const entry of allEntries) {
      await db.financial_And_Account_Journal_List.create(
        entry,
        {
          transaction
        }
      );
    }

    const createData = await db.paymentProgram.create({
      amount: payableAmountINR,
      reference_number: bill_invoice_number,
      document_type: 'Transport Voucher',
      entity_id,
      document_number: bill_invoice_number,
      payment_status: 'Transport Voucher',
      payment_program_status: 'Approved'
    }, {
      transaction
    });

    await db.paymentProgramList.create({
      transporter_id: transport_id,
      transport_voucher_id: tranportVoucher.id,
      amount_due: payableAmountINR,
      paid_amount: 0,
      total_amount: payableAmountINR,
      tds_id,
      nature_id,
      tds_rate_amount: total_tds,
      payment_program_id: createData.id,
      currency_id,
      currency_rate: currencyRate
    }, {
      transaction
    });

    await transaction.commit();

    return res.status(200).send({
      code: 200,
      message: 'Transport Voucher Created Successfully',
      data: {
        grand_total: originalGrandTotal,
        rounded_payable_amount: payableAmount,
        round_off: actualRoundOff,
        journal_debit: Number(totalDebit.toFixed(2)),
        journal_credit: Number(totalCredit.toFixed(2))
      }
    });

  } catch (error) {
    await transaction.rollback();

    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};




module.exports.getAllTransportVoucherList =async (req,res)=>{
    try {
        const  [dataList]  = await db.sequelize.query(
            `SELECT TV.*,VB.tm_name AS vendor_name 
            FROM TRANSPORT_VOUCHER AS TV
             INNER JOIN TM_TRANSPORTER_MASTER AS VB ON TV.transport_id = VB.id
             ORDER BY TV.createdAt DESC
            `
            
        ) 
        if(dataList){
            return res.status(200).send({
                status:200,
                message:'Records',
                data:dataList
            })
        }
    } catch (error) {
          return res.status(500).send({code:500,message:error.message})
        
    }
}

module.exports.getLRDataList = async(req,res)=>{
  try {
    const {entity_id,transporter_id} = req.query;
    const [dataList] = await db.sequelize.query(`
      SELECT DISTINCT WP.warehouse_id,WP.sale_order_id,WP.planning_id,SO.shipping_address_id,WVP.id AS LR_id,WVP.vehicle_number,WVP.LR_number,DATE_FORMAT(WVP.createdAt,'%Y-%m-%d') AS LR_Date,CS.shipping_address,CS.shipping_pin_code,W.address AS billing_address
FROM WH_VH_PLANNING_SO AS WP
INNER JOIN WH_VH_PLANNING_MST AS VP ON VP.id=WP.planning_id
INNER JOIN WH_VH_PLANNING_GATEIN_OUT AS WVP ON WVP.vehicle_planing_id = VP.id
INNER JOIN SALES_ORDER_MST AS SO ON SO.id=WP.sale_order_id
INNER JOIN CUSTOMER_SHIPPING_ADDRESS_MST AS CS ON CS.id=SO.shipping_address_id
INNER JOIN WAREHOUSE_MASTER AS W ON W.id=WP.warehouse_id
INNER JOIN WH_VH_PLANNING_TRANSPORTER AS VH ON VH.vehicle_planing_id=VP.id
WHERE SO.entity_id=${entity_id} AND VH.transportor_id= ${transporter_id}
`)
if(dataList){
  return res.status(200).send({code:200,message:'success',data:dataList})
}else{
  return res.status(404).send({code:404,message:'Data Not Found!',data:[]})
}
  } catch (error) {
    return res.status(500).send({code:500,message:error.message})
  }
}


module.exports.getTransportById =async (req,res)=>{
try {
 const {id} = req.query;

const [dataList] = await db.sequelize.query(`
     SELECT TV.*, TLM.nature_of_transaction AS nature,VBD.rcm_check,VBD.gst_rate
     FROM TRANSPORT_VOUCHER AS TV
     INNER JOIN TDS_LIST_MST AS TLM ON TV.nature_id = TLM.id
     INNER JOIN TM_TRANSPORTER_MASTER AS VBD ON TV.transport_id = VBD.id
     WHERE TV.id = ${id}
  `)

  const [items] = await db.sequelize.query(`
    SELECT TVA.* 
    FROM TRANSPORT_VOUCHER_ACCOUNT_LIST AS TVA
    WHERE TVA.transport_voucher_id = ${id}
    `)
    const [accountDetails] = await db.sequelize.query(`
      SELECT TVA.* 
      FROM TRANSPORT_CHARGES_LIST AS TVA
      WHERE TVA.transport_voucher_id = ${id}
      `)
   const finalData ={
    details:dataList[0],
    items:items,
    Account_details:accountDetails
   }
if(dataList){
   return res.status(200).send({code:200,message:'Records',data:finalData})
}else{
  return res.status(404).send({code:404,message:'Data Not Found!',data:[]})
}

} catch (error) {
   return res.status(500).send({code:500,message:error.message})
    
}

}


module.exports.getTransportChargesTotal = async (req, res) => {
    try {
 
        const { id } = req.query;
        const query = `
        SELECT WVP.*,PTL.*,MTC.charge_name,PTL.amount AS charge_amount FROM WH_VH_PLANNING_TRANSPORTER AS WVP
INNER JOIN WH_VH_PLANNING_TRANS_CHARGES AS PTL ON WVP.id = PTL.vp_trans_id
INNER JOIN MASTER_TRANSPORT_CHARGE AS MTC ON MTC.id = PTL.charge_id
WHERE WVP.vehicle_planing_id = ${id}`
 
 
        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if (data.length > 0) {
            return res
                .status(200)
                .send({
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


module.exports.getTranportDataList = async(req,res)=>{
  try {
    const {entity_id} = req.query;
    const dataList = await db.transport_master.findAll({where:{entity_id}})
if(dataList){
  return res.status(200).send({code:200,message:'success',data:dataList})
}else{
  return res.status(404).send({code:404,message:'Data Not Found!',data:[]})
}
  } catch (error) {
    return res.status(500).send({code:500,message:error.message})
  }
}


module.exports.getTransporterByIdTdsValue= async (req,res)=>{
  try {
   const {id} = req.query;
    const [dataList] = await db.sequelize.query(
       `SELECT VTM.*,STM.* 
       FROM TRANSPORTER_TDS_MST AS VTM 
       INNER JOIN SYS_TDS_MST AS STM ON VTM.tds_id = STM.id
      WHERE VTM.transporter_id=${id}`
    )
   const [totalAmountValue] = await db.sequelize.query(
       `SELECT V.transporter_id,COALESCE(SUM(V.paid_amount),0) AS totalAmount 
       FROM PAYMENT_PROGRAM_LIST AS V
       WHERE V.transporter_id=${id} GROUP BY V.transporter_id`
   )
  
  
   if(dataList){
       return res.status(200).send({code:200,message:'Successfully',data:dataList,totalAmount:totalAmountValue?.[0]?.totalAmount || 0})
   }else{
       return res.status(200).send({code:400,message:'Data Not Found',data:dataList,})
   }
  } catch (error) {
   return res.status(500).send({code:500,message:error.message})
   
  }
}

module.exports.getTdsNatureOfTransactionTransporter = async(req,res)=>{
  try {
      const {nature_id,transporter_id} = req.query;
     
      const [natureData]=await db.sequelize.query(`   
SELECT  TL.id,TL.current_rate, TL.threshold_limit,TL.tds_id, TL.nature_of_transaction, TL.maximum_amount,  TL.from_date,S.section,S.chart_account_id,TL.rate,
  COALESCE(SUM(VRP.paid_amount),0) AS total_amount
FROM TDS_LIST_MST AS TL
INNER JOIN SYS_TDS_MST AS S ON S.id = TL.tds_id
INNER JOIN TRANSPORTER_TDS_MST AS VT ON VT.tds_id=S.id AND TL.id = VT.nature_id
INNER JOIN TM_TRANSPORTER_MASTER AS VB ON VB.id = VT.transporter_id
LEFT JOIN PAYMENT_PROGRAM_LIST AS VRP ON VRP.nature_id = TL.id AND VRP.transporter_id = VB.id
WHERE TL.id=${nature_id} AND VB.id = ${transporter_id}
      GROUP BY TL.id`)



          if(natureData){
              return res.status(200).send({code:200,message:'Successfully',data:natureData})
          }else{
              return res.status(200).send({code:400,message:'Data Not Found',data:natureData})
          }
  } catch (error) {
      return res.status(500).send({code:500,message:error.message})
  }
}









module.exports.getCompleteTransportVoucher = async (req, res) => {
  try {
    const { voucher_id } = req.query;

    if (!voucher_id) {
      return res.status(400).send({
        code: 400,
        message: 'Voucher ID is required',
        data: null
      });
    }

    const [voucherData] = await db.sequelize.query(`
      SELECT 
        TV.*,
        TTM.tm_name,
        TTM.tm_gst_number,
        TTM.tm_address,
        TTM.gst_rate,
        TTM.tm_contact_number AS transporter_mobile,
        TTM.tm_email AS transporter_email,
        CASE 
          WHEN TV.rcm_check = 1 THEN 'RCM'
          ELSE 'FORWARDER'
        END AS transporter_type,
        MB.branch_name,
        MB.branch_address,
       
        EM.entity_name,
        EM.gst_in AS entity_gstin,
        EM.tax_registration_number,
        EM.registered_office,
        
 
        
        STM.section AS tds_section,
        STM.nature AS tds_nature,
        STM.chart_account_id AS tds_chart_account_id,
        TLM.nature_of_transaction,
        TLM.rate AS tds_rate,
        TLM.current_rate AS tds_current_rate,
        TLM.threshold_limit AS tds_threshold_limit,
        TLM.maximum_amount AS tds_maximum_amount,
        TLM.from_date AS tds_from_date,
        MCC.Currency_Type AS currency_name,
        MCC.rate AS currency_rate,
        MCC.Currency_Convert_id AS currency_id
      
      FROM TRANSPORT_VOUCHER AS TV 
      INNER JOIN TM_TRANSPORTER_MASTER AS TTM ON TV.transport_id = TTM.id
      INNER JOIN MASTER_BRANCH AS MB ON TV.branch_id = MB.id
      INNER JOIN ENTITY_MASTER AS EM ON TV.entity_id = EM.id
      INNER JOIN SYS_TDS_MST AS STM ON TV.tds_id = STM.id
      INNER JOIN TDS_LIST_MST AS TLM ON TV.nature_id = TLM.id
      INNER JOIN MASTER_CURRENCY_CONVERT AS MCC ON TV.currency_id = MCC.Currency_Convert_id
      WHERE TV.id = ${voucher_id}
    `);

    if (!voucherData || voucherData.length === 0) {
      return res.status(404).send({
        code: 404,
        message: 'Voucher not found',
        data: null
      });
    }

    const voucher = voucherData[0];

    const [chargesData] = await db.sequelize.query(`
      SELECT 
        TCL.*,
        PCA.account_name AS parent_account_name,
        PCA.account_code AS parent_account_code,
        CA.account_name AS chart_account_name,
        CA.account_code AS chart_account_code
      FROM TRANSPORT_CHARGES_LIST TCL
      LEFT JOIN CHART_OF_ACCOUNTS PCA ON TCL.parent_chart_account_id = PCA.id
      LEFT JOIN CHART_OF_ACCOUNTS CA ON TCL.chart_account_id = CA.id
      WHERE TCL.transport_voucher_id = ${voucher_id}
      ORDER BY TCL.createdAt DESC;
    `);

    const [lorryData] = await db.sequelize.query(`
     SELECT 
        TVAL.*,
        WVP.*
      FROM TRANSPORT_VOUCHER_ACCOUNT_LIST AS TVAL 
      INNER JOIN WH_VH_PLANNING_GATEIN_OUT AS WVP ON TVAL.LR_id = WVP.id
      WHERE TVAL.transport_voucher_id = ${voucher_id}
      ORDER BY TVAL.createdAt DESC
    `);

    const totalTransportCharges = lorryData.reduce((sum, lorry) => 
      sum + parseFloat(lorry.lr_amount || 0), 0
    );

    const totalOtherCharges = chargesData.reduce((sum, charge) => 
      sum + parseFloat(charge.amount || 0), 0
    );

    const completeData = {
      voucher: {
        id: voucher.id,
        date: voucher.date,
        address: voucher.Address,
        bill_invoice_number: voucher.bill_invoice_number,
        gstin: voucher.GSTIN,
        sac_code: voucher.sac_code,
        vendor_id: voucher.vendor_id,
        gross_total: parseFloat(voucher.gross_total) || 0,
        total_tds: parseFloat(voucher.total_tds) || 0,
        grand_total: parseFloat(voucher.grand_total) || 0,
        tds_id: voucher.tds_id,
        nature_id: voucher.nature_id,
        gst_total: parseFloat(voucher.gst_total) || 0,
        igst: parseFloat(voucher.igst) || 0,
        cgst: parseFloat(voucher.cgst) || 0,
        sgst: parseFloat(voucher.sgst) || 0,
        rcm_check: voucher.rcm_check || 0,
        transport_id: voucher.transport_id,
        less_value: parseFloat(voucher.less_value) || 0,
        currency_id: voucher.currency_id,
        branch_id: voucher.branch_id,
        entity_id: voucher.entity_id,
        is_round_off: voucher.is_round_off || '0',
        round_off: parseFloat(voucher.round_off) || 0,
        rounded_payable_amount: parseFloat(voucher.rounded_payable_amount) || 0,
        created_at: voucher.createdAt,
        updated_at: voucher.updatedAt,
        voucher_number: `TV-${new Date(voucher.date).getFullYear()}-${String(voucher.id).padStart(5, '0')}`,
        voucher_date: new Date(voucher.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        financial_year: (() => {
          const date = new Date(voucher.date);
          const year = date.getFullYear();
          const month = date.getMonth();
          return month >= 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
        })(),
        gst_type: voucher.rcm_check == 1 ? 'RCM' : 'Forward Charge',
        branch: {
          id: voucher.branch_id,
          name: voucher.branch_name,
          address: voucher.branch_address,
          gstin: voucher.branch_gstin,
          phone: voucher.branch_phone,
          email: voucher.branch_email
        },
        entity: {
          id: voucher.entity_id,
          name: voucher.entity_name,
          gstin: voucher.entity_gstin,
          pan: voucher.entity_pan,
          tax_registration_number: voucher.tax_registration_number,
          registered_office: voucher.registered_office,
          mobile: voucher.entity_mobile,
          email: voucher.entity_email
        },
        transporter: {
          id: voucher.transport_id,
          name: voucher.tm_name,
          gstin: voucher.tm_gst_number,
          address: voucher.tm_address,
          gst_rate: parseFloat(voucher.gst_rate) || 0,
          mobile: voucher.transporter_mobile,
          email: voucher.transporter_email,
          type: voucher.transporter_type
        },
        tds: {
          id: voucher.tds_id,
          section: voucher.tds_section,
          nature: voucher.tds_nature,
          nature_of_transaction: voucher.nature_of_transaction,
          rate: parseFloat(voucher.tds_rate) || 0,
          current_rate: parseFloat(voucher.tds_current_rate) || 0,
          threshold_limit: parseFloat(voucher.tds_threshold_limit) || 0,
          maximum_amount: parseFloat(voucher.tds_maximum_amount) || 0,
          from_date: voucher.tds_from_date,
          chart_account_id: voucher.tds_chart_account_id
        },
        currency: {
          id: voucher.currency_id,
          name: voucher.currency_name,
          symbol: voucher.currency_symbol || '₹',
          rate: parseFloat(voucher.currency_rate) || 1
        }
      },
      charges: chargesData.map(charge => ({
        id: charge.id,
        charges_name: charge.charges_name,
        amount: parseFloat(charge.amount) || 0,
        transport_voucher_id: charge.transport_voucher_id,
        parent_account: {
          id: charge.parent_chart_account_id,
          name: charge.parent_account_name,
          code: charge.parent_account_code
        },
        chart_account: {
          id: charge.chart_account_id,
          name: charge.chart_account_name,
          code: charge.chart_account_code
        },
        created_at: charge.createdAt,
        updated_at: charge.updatedAt
      })),
      lorryDetails: lorryData.map(lorry => ({
        id: lorry.id,
        lr_number: lorry.LR_number,
        date: lorry.date,
        from: lorry.from,
        to: lorry.to,
        vehicle_number: lorry.vehicle_number,
        transport_voucher_id: lorry.transport_voucher_id,
        lr_id: lorry.LR_id,
        created_at: lorry.createdAt,
        updated_at: lorry.updatedAt,
        gatein: {
          id: lorry.gatein_id,
          lr_no: lorry.lr_no,
          vehicle_no: lorry.vehicle_no,
          driver_name: lorry.driver_name,
          driver_mobile: lorry.driver_mobile,
          from_location: lorry.from_location,
          to_location: lorry.to_location,
          date: lorry.gatein_date,
          time: lorry.gatein_time,
          weight: parseFloat(lorry.gatein_weight) || 0,
          quantity: parseFloat(lorry.gatein_quantity) || 0,
          consignor_name: lorry.consignor_name,
          consignor_address: lorry.consignor_address,
          consignee_name: lorry.consignee_name,
          consignee_address: lorry.consignee_address,
          amount: parseFloat(lorry.lr_amount) || 0,
          freight_rate: parseFloat(lorry.freight_rate) || 0,
          payment_terms: lorry.payment_terms,
          status: lorry.lr_status,
          gstin: lorry.transporter_gstin,
          vehicle_type: lorry.vehicle_type,
          vehicle_capacity: lorry.vehicle_capacity,
          vehicle_owner: lorry.vehicle_owner,
          vehicle_owner_contact: lorry.vehicle_owner_contact,
          driver_license_number: lorry.driver_license_number,
          driver_license_expiry: lorry.driver_license_expiry,
          trip_id: lorry.trip_id,
          checklist: lorry.gatein_checklist,
          remark: lorry.gatein_remark,
          created_at: lorry.gatein_created,
          updated_at: lorry.gatein_updated
        }
      })),
      summaries: {
        transport_charges_total: totalTransportCharges,
        other_charges_total: totalOtherCharges,
        total_charges: totalTransportCharges + totalOtherCharges,
        tax_summary: {
          taxable_value: parseFloat(voucher.gross_total) || 0,
          igst: parseFloat(voucher.igst) || 0,
          cgst: parseFloat(voucher.cgst) || 0,
          sgst: parseFloat(voucher.sgst) || 0,
          total_gst: parseFloat(voucher.gst_total) || 0,
          gst_type: voucher.rcm_check == 1 ? 'RCM' : 'Forward Charge'
        },
        payment_summary: {
          gross_total: parseFloat(voucher.gross_total) || 0,
          tds: parseFloat(voucher.total_tds) || 0,
          gst_total: parseFloat(voucher.gst_total) || 0,
          less_amount: parseFloat(voucher.less_value) || 0,
          net_payable: parseFloat(voucher.grand_total) || 0,
          round_off: parseFloat(voucher.round_off) || 0,
          rounded_payable: parseFloat(voucher.rounded_payable_amount) || 0
        }
      },
      narration: (() => {
        if (!lorryData || lorryData.length === 0) {
          return `Transport charges booked. Service provided by ${voucher.tm_name || 'Transporter'}.`;
        }
        const lrNumbers = lorryData.map(l => l.LR_number || l.lr_no || 'N/A').filter(Boolean).join(' and ');
        const locations = lorryData.map(l => `${l.from || l.from_location} to ${l.to || l.to_location}`).join(', ');
        return `Being freight and transportation charges booked for ${lorryData.length} consignment(s) from ${locations}. LR No. ${lrNumbers || 'N/A'}. Transport service provided by ${voucher.tm_name || 'Transporter'}.`;
      })(),
      printInfo: {
        print_date: new Date().toLocaleString(),
        generated_by: 'System',
        version: '1.0'
      }
    };

    return res.status(200).send({
      code: 200,
      message: 'Voucher data fetched successfully',
      data: completeData
    });

  } catch (error) {
    console.error('Error fetching voucher data:', error);
    return res.status(500).send({
      code: 500,
      message: error.message,
      data: null
    });
  }
};