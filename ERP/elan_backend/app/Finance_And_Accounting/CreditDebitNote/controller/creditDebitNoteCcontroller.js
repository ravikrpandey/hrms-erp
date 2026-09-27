const db = require('../../../models/index')
module.exports.createCreditDebitNote = async (req, res) => {

    const transaction = await db.sequelize.transaction();
    try {
        const { amount,financial_id,amount_due, purchase_return_id,upload_doc, builder_date, document_number, note_type, remark,entity_id, customer_id, vendor_id, product_id, sales_invoice_id,itmeList} =req.body
        const Obj ={
            amount, upload_doc, builder_date, document_number, note_type, remark,entity_id
        }
        if(vendor_id){
            Obj.vendor_id=vendor_id,
            Obj.invoice_id=sales_invoice_id
        }
        if(customer_id){
            Obj.customer_id=customer_id
            Obj.sales_invoice_id=sales_invoice_id
        }
     
        const createCreditDebitBuilder = await db.creditDebitNote.create(Obj,{transaction})
       
        if (vendor_id && note_type === 'credit_note') {

            const grnExist = await db.grnMaster.findOne({
                where: { id: sales_invoice_id },
                transaction
            });
        
            if (!grnExist) {
                throw new Error('Invoice not found');
            }
        
            const invoiceAmount = Number(grnExist.total_amount || 0);
            const creditAmount = Number(amount || 0);
        
            const finalTotal = invoiceAmount - creditAmount;
        
            const paymentExist = await db.paymentProgramList.findOne({
                where: { invoice_id: sales_invoice_id },
                order: [['id', 'DESC']],
                transaction
            });
        
           
            await db.grnMaster.update(
                {
                    total_amount: finalTotal,
                    payment_status:
                        finalTotal <= 0
                            ? 'PAID'
                            : 'PARTIALLY PAID'
                },
                {
                    where: { id: sales_invoice_id },
                    transaction
                }
            );
        
            await db.purchaseReturn.update(
                {
                    return_status:
                        Number(amount) >= Number(amount_due)
                            ? 'Approved'
                            : 'Pending'
                },
                {
                    where: {
                        id: itmeList?.[0]?.purchase_return_id
                    },
                    transaction
                }
            );
        
           
            const paymentProgram = await db.paymentProgram.create(
                {
                    document_number,
                    amount: invoiceAmount,
                    entity_id,
                    document_type: note_type,
                    payment_program_status: 'Approved'
                },
                { transaction }
            );
        
            const outstandingAmount = paymentExist
                ? Number(paymentExist.amount_due || 0) - creditAmount
                : finalTotal;
        
            await db.paymentProgramList.create(
                {
                    document_type: note_type,
                    total_amount: invoiceAmount,
                    paid_amount: creditAmount,
                    amount_due: outstandingAmount,
                    vendor_id,
                    payment_program_id: paymentProgram.id,
                    invoice_id: sales_invoice_id,
                    credit_debit_note_id: createCreditDebitBuilder.id
                },
                { transaction }
            );
            await db.financial_And_Account_Journal_List.bulkCreate([
                {
                    chart_account_id: 49,
                    debit_amount: amount,
                    credit_amount: 0.00,
                    vendor_id: vendor_id , party_type:'VENDOR',
                    entity_id:entity_id,
                    entry_status:'Credit Note',
                    document_number: document_number,
                    financial_id:financial_id,
                    remarks:remark
                  },
                {
                  chart_account_id: 398,
                  debit_amount: 0.00,
                  credit_amount: amount,
                  entity_id:entity_id,
                  entry_status:'Credit Note',
                  document_number: document_number,
                  financial_id:financial_id
                },
                
                ]);
        
            
        }
        if (vendor_id && note_type === 'debit_note') {

            const grnExist = await db.grnMaster.findOne({
                where: { id: sales_invoice_id },
                transaction
            });
        
            if (!grnExist) {
                throw new Error('Invoice not found');
            }
        
            const invoiceAmount = Number(grnExist.total_amount || 0);
            const debitAmount = Number(amount || 0);
        
            const finalTotal = invoiceAmount + debitAmount;
        
            
        
            await db.grnMaster.update(
                {
                    total_amount: finalTotal,
                },
                {
                    where: { id: sales_invoice_id },
                    transaction
                }
            );
            const paymentExist = await db.paymentProgramList.findOne({
                where: { invoice_id: sales_invoice_id },
                order: [['id', 'DESC']],
                transaction
            });
           
        const paymentProgram = await db.paymentProgram.create(
            {
                document_number,
                amount: finalTotal,
                entity_id,
                document_type: note_type,
                payment_program_status: 'Approved'
            },
            { transaction }
        );
    
        const outstandingAmount = paymentExist
            ? Number(paymentExist?.amount_due || 0) + debitAmount
            : finalTotal;
    
        await db.paymentProgramList.create(
            {
                document_type: note_type,
                total_amount: finalTotal,
                paid_amount: debitAmount,
                amount_due: outstandingAmount,
                vendor_id,
                payment_program_id: paymentProgram.id,
                invoice_id: sales_invoice_id,
                credit_debit_note_id: createCreditDebitBuilder.id
            },
            { transaction }
        );
    
        
        //     const paymentProgram = await db.paymentProgram.create(
        //         {
        //             document_number,
        //             amount: finalTotal,
        //             entity_id,
        //             document_type: note_type,
        //             payment_program_status: 'Approved'
        //         },
        //         { transaction }
        //     );
        
        //     const outstandingAmount = paymentExist
        //         ? Number(paymentExist.amount_due || 0) + debitAmount
        //         : finalTotal;
        
        //         console.log('=============',finalTotal,debitAmount,outstandingAmount)
        // return truee
        //     await db.paymentProgramList.create(
        //         {
        //             document_type: note_type,
        //             total_amount: finalTotal,
        //             paid_amount: debitAmount,
        //             amount_due: outstandingAmount,
        //             vendor_id,
        //             payment_program_id: paymentProgram.id,
        //             invoice_id: sales_invoice_id,
        //             credit_debit_note_id: createCreditDebitBuilder.id
        //         },
        //         { transaction }
        //     );
        
         
            await db.financial_And_Account_Journal_List.bulkCreate(
                [
                    {
                        chart_account_id: 219,
                        debit_amount: debitAmount,
                        credit_amount: 0,
                        entity_id,
                        entry_status: 'Debit Note',
                        document_number,
                        financial_id,
                        remarks: remark
                    },
                    {
                        chart_account_id: 49,
                        debit_amount: 0,
                        credit_amount: debitAmount,
                        vendor_id,
                        party_type: 'VENDOR',
                        entity_id,
                        entry_status: 'Debit Note',
                        document_number,
                        financial_id
                    }
                ],
                { transaction }
            );
        }

        if (customer_id) {
            Obj.customer_id = customer_id;
            Obj.sales_invoice_id = sales_invoice_id;
        }


        await Promise.all(
            itmeList.map(async (i) => {

                const {
                    totalWithGst,
                    quantity,
                    price_per_unit,
                    totalDiscountAmount,
                    totalPrice,
                    product_master_id
                } = i;

                return db.creditDebitNoteItem.create({

                    total_with_gst: totalWithGst,

                    quantity,

                    price_per_unit,

                    total_discount_amount: totalDiscountAmount,

                    total_price: totalPrice,

                    product_master_id,

                    credit_debit_note_id: createCreditDebitBuilder.id

                }, { transaction });

            })
        );


        if (customer_id && note_type == 'credit_note') {
            const salesExist = await db.salesInvoiceData.findOne({where:{so_id:sales_invoice_id,id:purchase_return_id},transaction})
            const paymentExist = await db.paymentProgramList.findOne({where:{sales_invoice_id},order:[['id','DESC']]},transaction)
            const customerExist = await db.customerCreditDebit.findOne({where:{customer_id:customer_id},transaction})
            const total_amount_utilize= parseFloat(customerExist.utilized_credit_limit) - parseFloat(amount);
            const available_amount=parseFloat(customerExist.sactioned_credit_limit) - parseFloat(total_amount_utilize);
            await db.customerCreditDebit.update({
                utilized_credit_limit:total_amount_utilize,
                available_credit_limit:available_amount
            },{where:{customer_id:customer_id},transaction})
            if(!paymentExist){
                let Obj = {}
                if(parseFloat(salesExist?.grand_total) == parseInt(amount)){
                    Obj.payment_status = "PAID"
                }else{
                    Obj.payment_status = "PARTIALLY PAID"
                }
          
                await db.salesInvoiceData.update(Obj,{where:{id:purchase_return_id,},transaction})
                const remaining_amt = parseFloat(salesExist?.grand_total) - parseFloat(amount)
                const paymentProgram = await db.paymentProgram.create(
                    {
                        document_number,
                        amount: salesExist.grand_total,
                        entity_id,
                        document_type: note_type,
                        payment_program_status: 'Approved'
                    },
                    { transaction }
                );
                await db.paymentProgramList.create(
                    {
                        document_type: note_type,
                        total_amount: salesExist.grand_total,
                        paid_amount: amount,
                        amount_due: remaining_amt,
                        customer_id,
                        payment_program_id: paymentProgram.id,
                        sales_invoice_id: sales_invoice_id,
                        credit_debit_note_id: createCreditDebitBuilder.id
                    },
                    { transaction }
                );
               
            }
            else{
                let Obj = {}
                if(parseFloat(paymentExist?.amount_due) == parseFloat(amount)){
                    Obj.payment_status = "PAID"
                }else{
                    Obj.payment_status = "PARTIALLY PAID"
                }
                await db.salesInvoiceData.update(Obj,{where:{id:purchase_return_id}})
                let count = parseFloat(paymentExist?.amount_due) - parseFloat(amount)
                const paymentProgram = await db.paymentProgram.create(
                    {
                        document_number,
                        amount: salesExist.grand_total,
                        entity_id,
                        document_type: note_type,
                        payment_program_status: 'Approved'
                    },
                    { transaction }
                );
                await db.paymentProgramList.create(
                    {
                        document_type: note_type,
                        total_amount: salesExist.grand_total,
                        paid_amount: amount,
                        amount_due: count,
                        customer_id,
                        payment_program_id: paymentProgram.id,
                        sales_invoice_id: sales_invoice_id,
                        credit_debit_note_id: createCreditDebitBuilder.id
                    },
                    { transaction }
                );
            }
            await db.financial_And_Account_Journal_List.bulkCreate([

                {
                    credit_amount: 0.00,
                    debit_amount: amount,
                    chart_account_id: 209,
                    entry_status: 'Credit Note',
                    entity_id,
                    document_number,
                    financial_id,
                },

                {
                    debit_amount: 0.00,
                    credit_amount: amount,
                    chart_account_id: 163,
                    entry_status: 'Credit Note',
                    party_type: 'CUSTOMER',
                    customer_id,
                    entity_id,
                    document_number,
                    financial_id
                }

            ], { transaction });

        }

        if (customer_id && note_type == 'debit_note') {

            const salesExist = await db.salesInvoiceData.findOne({where:{so_id:sales_invoice_id,id:purchase_return_id}})
            const paymentExist = await db.paymentProgramList.findOne({where:{sales_invoice_id},order:[['id','DESC']]})
            const customerExist = await db.customerCreditDebit.findOne({where:{customer_id:customer_id}})
            const total_amount_utilize= parseFloat(customerExist.utilized_credit_limit) + parseFloat(amount);
            const available_amount=parseFloat(customerExist.sactioned_credit_limit + parseFloat(total_amount_utilize));
            await db.customerCreditDebit.update({
                utilized_credit_limit:total_amount_utilize,
                available_credit_limit:available_amount
            },{where:{customer_id:customer_id}})
            const remaining_amt = parseFloat(salesExist.grand_total) + parseFloat(amount)
            if(paymentExist){
            await db.paymentProgramList.update(
                {
                    total_amount: remaining_amt,
                    amount_due: parseFloat(paymentExist?.amount_due) + parseFloat(debitAmount)
                },
                {
                    where: { sales_invoice_id: sales_invoice_id },
                    transaction
                }
            );
        }
           
            await db.financial_And_Account_Journal_List.bulkCreate([

                {
                    debit_amount: amount,
                    credit_amount: 0.00,
                    chart_account_id: 163,
                    entry_status: 'Debit Note',
                    party_type: 'CUSTOMER',
                    customer_id,
                    entity_id,
                    document_number,
                    financial_id,
                },

                {
                    debit_amount: 0.00,
                    credit_amount: amount,
                    chart_account_id: 196,
                    entry_status: 'Debit Note',
                    entity_id,
                    document_number,
                    financial_id,
                }

            ], { transaction });

        }

        await transaction.commit();

        return res.status(200).send({
            code: 200,
            message: 'Created Successfully'
        });

    } catch (error) {

        await transaction.rollback();

        return res.status(500).send({
            code: 500,
            message: error.message
        });

    }

};
module.exports.getInvoiceItemByinvoiceId = async(req,res)=>{
    try {
        const {invoice_id,type,purchase_return_id} = req.query;
        let dataList  =[];
        let total_amount ;
        let invoice_due_amount;
        if(type=='CUSTOMER'){
         [dataList] = await db.sequelize.query(`
SELECT DISTINCT SR.sales_order_id AS id,M.id AS product_master_id,SRI.return_qty AS quantity,M.item_name,M.item_code,
    SRI.rate AS price_per_unit,ROUND((SRI.return_qty * SRI.rate), 2) AS totalPrice,
    ROUND(((SRI.return_qty * SRI.rate) * SRI.discount / 100), 2) AS totalDiscountAmount,
    ROUND(
        (
            ((SRI.return_qty * SRI.rate) - ((SRI.return_qty * SRI.rate) * SRI.discount / 100))
            +
            (
                ((SRI.return_qty * SRI.rate) - ((SRI.return_qty * SRI.rate) * SRI.discount / 100))
                * SRI.gst / 100
            )
        ), 
    2) AS totalWithGst,
SRI.discount,SRI.gst
FROM SALES_RETURN_MST AS SR
INNER JOIN SALES_RETURN_ITEM_LIST AS SRI ON SRI.sales_return_id = SR.id
INNER JOIN SALES_ORDER_MST AS SO ON SO.id = SR.sales_order_id
INNER JOIN MASTER_ITEM AS M ON M.id = SRI.item_id
WHERE SR.sales_order_id = ${invoice_id} AND SR.id = ${purchase_return_id} `)

if(dataList.length == 0){
    return res.status(404).send({code:404,message:"Data Not Found!",data:[]})
}
                total_amount = dataList.reduce(
                    (total, row) => total + Number(row.totalWithGst || 0),
                    0
                  );
                 
                  const [programData] = await db.sequelize.query(
                    `SELECT SUM(paid_amount) AS amount_paid, P.sales_invoice_id
FROM PAYMENT_PROGRAM_LIST AS P
WHERE P.sales_invoice_id = ${invoice_id} AND P.credit_debit_note_id IS NOT NULL
GROUP BY P.sales_invoice_id`
                  )
             
                  const totalInvoiceAmount = Number(total_amount) || 0;
                const amountPaid = Number(programData?.[0]?.amount_paid) || 0;

            total_amount = totalInvoiceAmount - amountPaid;
        
            const paymentExist = await db.paymentProgramList.findOne({where:{sales_invoice_id:invoice_id},attributes:['sales_invoice_id','amount_due'],order:[['id','DESC']]})
            if(!paymentExist){
                const grnExist = await db.salesReturnMst.findOne({where:{id:purchase_return_id}})
                invoice_due_amount = grnExist?.total_amount
            }else{
                invoice_due_amount = paymentExist?.amount_due
            }
         
    }
        if(type == 'VENDOR'){
            [dataList] = await db.sequelize.query(
                `SELECT PRI.rate AS price_per_unit,PR.grn_id AS id,M.item_name,M.item_code,PRI.return_qty AS quantity,
M.id AS product_master_id,PRI.amount AS totalWithGst,(PRI.return_qty * PRI.rate) AS totalPrice,PR.id AS purchase_return_id
FROM PURCHASE_RETURNS AS PR 
INNER JOIN PURCHASE_RETURN_ITEMS AS PRI ON PRI.purchase_return_id = PR.id
INNER JOIN MASTER_ITEM AS M ON M.id=PRI.item_id
 WHERE PR.grn_id = ${invoice_id} AND PR.id = ${purchase_return_id}`
            )
            total_amount = dataList.reduce(
                (total, row) => total + Number(row.totalWithGst || 0),
                0
              );
             
              const [programData] = await db.sequelize.query(
                `SELECT SUM(paid_amount) AS amount_paid, P.invoice_id
                FROM PAYMENT_PROGRAM_LIST AS P
                WHERE P.invoice_id = ${invoice_id} AND P.credit_debit_note_id IS NOT NULL
                GROUP BY P.invoice_id`
              )
              const totalInvoiceAmount = Number(total_amount) || 0;
                const amountPaid = Number(programData?.[0]?.amount_paid) || 0;

            total_amount = totalInvoiceAmount - amountPaid;
            
            const paymentExist = await db.paymentProgramList.findOne({where:{invoice_id},attributes:['invoice_id','amount_due'],order:[['id','DESC']]})
            if(!paymentExist){
                const grnExist = await db.grnMaster.findOne({where:{id:invoice_id}})
                invoice_due_amount = grnExist.total_amount
            }else{
                invoice_due_amount = paymentExist?.amount_due
            }

        }
        if(dataList){
            return res.status(200).send({code:200,message:"Success",data:dataList,total_amount:total_amount,amount_due:total_amount,invoice_due_amount:invoice_due_amount})
        }else{
            return res.status(404).send({code:404,message:"Data Not Found!",data:[]})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.generateCreditDebitCode = async (req, res) => {
    try {
        const {type} = req.query;
        let generateCode;
        const [dataValue] = await db.creditDebitNote.findAll({order:[['id','DESC']]})
            if (dataValue) {
                if(type == 'credit_note'){
                        generateCode = 'CN' + String(dataValue.id +  1).padStart(3, '0');
                }else{
                    generateCode = 'DN' + String(dataValue.id +  1).padStart(3, '0');
                }
            }else{
                if(type == 'credit_note'){
                    generateCode = 'CN0001';
                }else{
                    generateCode = 'DN0001';
                } 
            }
        return res.status(200).send({ code: 200, message: 'success',data:generateCode });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};

module.exports.getCreditNoteList = async(req,res)=>{
    try {
        const {entity_id} = req.query;
        const [dataList] = await db.sequelize.query(
            `SELECT F.*,  PP.document_type,PP.reference_number,
    CASE 
        WHEN F.vendor_id IS NOT NULL THEN 'VENDOR'
        WHEN F.customer_id IS NOT NULL THEN 'CUSTOMER'
        WHEN T.transport_id IS NOT NULL THEN 'VENDOR'
    END AS party_type,
    CASE 
        WHEN F.vendor_id IS NOT NULL THEN V.vendor_name
        WHEN F.customer_id IS NOT NULL THEN C.company_name
        WHEN T.transport_id IS NOT NULL THEN TT.tm_name
    END AS company_name
FROM FINANCE_CREDIT_DEBIT_NOTE AS F
LEFT JOIN CUSTOMER_PROFILE_MST AS C ON C.id = F.customer_id
LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id = F.vendor_id
LEFT JOIN PAYMENT_PROGRAM_LIST AS P ON P.credit_debit_note_id = F.id
LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = P.payment_program_id
LEFT JOIN TRANSPORT_VOUCHER AS T ON T.id = F.transport_voucher_id
LEFT JOIN TM_TRANSPORTER_MASTER AS TT ON TT.id = T.transport_id
LEFT JOIN SALES_JOURNAL AS SJ ON SJ.id = F.sales_journal_id
WHERE F.entity_id = ${entity_id}
GROUP BY F.id ORDER BY F.id DESC`
        )
        if(dataList){
            return res.status(200).send({code:200,message:"Success",data:dataList})
        }else{
            return res.status(404).send({code:404,message:"Data Not Found!",data:[]})
        }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}

module.exports.getCreditNoteById = async(req,res)=>{
    try {
        const {id,type} = req.query;
    if(type == 'CUSTOMER'){

    
        const [dataList] = await db.sequelize.query(
            `SELECT F.*,  PP.document_type,PP.reference_number,P.amount_due AS due_amount,
    CASE 
        WHEN F.vendor_id IS NOT NULL THEN 'VENDOR'
        WHEN F.customer_id IS NOT NULL THEN 'CUSTOMER'
    END AS party_type,
    CASE 
        WHEN F.vendor_id IS NOT NULL THEN V.vendor_name
        WHEN F.customer_id IS NOT NULL THEN C.company_name
    END AS company_name
FROM FINANCE_CREDIT_DEBIT_NOTE AS F
LEFT JOIN CUSTOMER_PROFILE_MST AS C ON C.id = F.customer_id
LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id = F.vendor_id
LEFT JOIN PAYMENT_PROGRAM_LIST AS P ON P.credit_debit_note_id = F.id
LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = P.payment_program_id
WHERE F.id = ${id}
GROUP BY F.id`
        )
     
        const [valueList]= await db.sequelize.query(`
            SELECT FC.price_per_unit ,M.item_name,M.item_code,FC.quantity,FC.total_with_gst AS totalWithGst,FC.total_price,P.amount_due
FROM FINANCE_CREDIT_DEBIT_NOTE AS F
INNER JOIN FINANCE_CREDIT_DEBIT_NOTE_ITEM AS FC ON FC.credit_debit_note_id = F.id
INNER JOIN MASTER_ITEM AS M ON M.id=FC.product_master_id
LEFT JOIN PAYMENT_PROGRAM_LIST AS P ON P.credit_debit_note_id=F.id
 WHERE F.id = ${id}
           `)

           
          
          
          dataList[0].due_amount = parseInt(valueList[0]?.amount_due) - parseInt(dataList[0]?.amount || 0) ;
        const Obj ={
            ...dataList[0],
            itmeList: valueList
        }
        if(Obj){
            return res.status(200).send({code:200,message:"Success",data:Obj})
        }else{
            return res.status(404).send({code:404,message:"Data Not Found!",data:[]})
        }
    }
    if(type=='VENDOR'){
        const [dataList] = await db.sequelize.query(
            `SELECT F.*,  PP.document_type,PP.reference_number,
    CASE 
        WHEN F.vendor_id IS NOT NULL THEN 'VENDOR'
        WHEN F.customer_id IS NOT NULL THEN 'CUSTOMER'
    END AS party_type,
    CASE 
        WHEN F.vendor_id IS NOT NULL THEN V.vendor_name
        WHEN F.customer_id IS NOT NULL THEN C.company_name
    END AS company_name
FROM FINANCE_CREDIT_DEBIT_NOTE AS F
LEFT JOIN CUSTOMER_PROFILE_MST AS C ON C.id = F.customer_id
LEFT JOIN VENDOR_BASIC_DETAILS AS V ON V.id = F.vendor_id
LEFT JOIN PAYMENT_PROGRAM_LIST AS P ON P.credit_debit_note_id = F.id
LEFT JOIN PAYMENT_PROGRAM AS PP ON PP.id = P.payment_program_id
WHERE F.id = ${id}
GROUP BY F.id`
        )
    
        const [valueList]= await db.sequelize.query(`
            SELECT FC.price_per_unit ,M.item_name,M.item_code,FC.quantity,FC.total_with_gst AS totalWithGst,FC.total_price
FROM FINANCE_CREDIT_DEBIT_NOTE AS F
INNER JOIN FINANCE_CREDIT_DEBIT_NOTE_ITEM AS FC ON FC.credit_debit_note_id = F.id
INNER JOIN MASTER_ITEM AS M ON M.id=FC.product_master_id
 WHERE F.id = ${id}
           `)
           const total_amount = valueList.reduce(
            (total, row) => total + parseFloat(row.totalWithGst || 0),
            0
          );
          
          dataList[0].due_amount = parseInt(total_amount) - parseInt(dataList[0].amount || 0) ;
        
        const Obj ={
            ...dataList[0],
            itmeList: valueList
        }
        if(Obj){
            return res.status(200).send({code:200,message:"Success",data:Obj})
        }else{
            return res.status(404).send({code:404,message:"Data Not Found!",data:[]})
        }
    }
    } catch (error) {
        return res.status(500).send({code:500,message:error.message})
    }
}

