const db = require("../../../models/index");
const moment = require('moment');

const addFinancialAccountJournal = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {

  var message = 'created';
  let {
    posting_date,voucher_id,financial_posting,financial_id,general_number,notes,journalDocument,employee_id,transaction_date  ,customer_id ,party_type ,vendor_id ,   entity_id ,bill_number
  } = req.body.general_entry;
 
  let {
    reference  ,reference_date,currency_rate,journal_book_status,currency_id ,totalDebit ,totalCredit   ,parent_journal_no ,isReversal ,gross_total,net_amount ,
  } = req.body;

   
  if(vendor_id || customer_id || employee_id){
      let createJournalBook;
      let referenceDate = moment.utc(reference_date).format('YYYY-MM-DD');
      let transactionDate = transaction_date;
    

      if (req.body.id) {
      
        const reverseExist = await db.financial_And_Account_Journal.findOne({where:{parent_journal_no:parent_journal_no},attributes:['id','journal_no','parent_journal_no']})
       
        if(reverseExist){
          return res.status(404).send({code:404,message:'This JL alreday reverse'})
        }
        message = 'updated'
       
       
        createJournalBook = await db.financial_And_Account_Journal.create({
          posting_date: posting_date,
          journal_no: general_number,
          transaction_date: transaction_date,
          notes: notes,document_type,
          reference: reference,voucher_list_id:voucher_id,
          journal_status:'APPROVED',
          bill_number,
          financial_posting,
          employee_id,
        customer_id,
         vendor_id,
         party_type,
          journal_book_status:"REVERSAL Entry",
          reference_date: reference_date,
          total_of_debit: (totalDebit),
          total_of_credit:(totalCredit),
          entity_id: entity_id,
          currency_id,vendor_id,
          party_type,
          isReversal: isReversal,
          parent_journal_no: parent_journal_no,record_payment:gross_total,total_purchase:net_amount
        }, { transaction })

        if (req.body.general_entry.journalDocument[0]) {
          for (const elem of req.body.general_entry.journalDocument) {
            await db.financial_And_Account_Journal_Document.create({
              journal_id: createJournalBook.id,
              image: elem.file
            },{transaction});
          }
        }
        for (const acc of req.body.account_detail.Account_details) {
          let party_types ;
          if(!vendor_id || !customer_id){
            party_types = null
          }
          if(vendor_id){
             party_types = party_type
          }
          if(customer_id){
            party_types = 'CUSTOMER'
          }
          await db.financial_And_Account_Journal_List.create({
            party_type: party_types,cost_center_id:acc.cost_center_id,profit_center_id:acc.profit_center_id,
            credit_amount: (acc.credit_amount),
            tds_rate_amount:(acc.tds_rate_amount),
            debit_amount: (acc.debit_amount),
            journal_id: createJournalBook.id,
            tds_rate_amount:(acc.tds_rate_amount),
            tds_id:acc.tds_id,
            financial_id:req.body.financial_id,
            nature_id:acc.nature_id,
            vendor_id:vendor_id,
            chart_account_id: acc.chart_account_id,
            entity_id: entity_id,
            entry_status: 'Journal',
            customer_id:  customer_id ,
            employee_id:  employee_id ,
            tax_amount:(acc.tax_amount),
            tax_rate:(acc.tax_rate),
            currency_rate,
            currency_id,
            document_number:general_number
          },{transaction});
        }
    
    await transaction.commit()
        return res.json({
          code: 200,
          message: `Journal has been ${message} successfully`,
          data: createJournalBook,
        });
      } else {
       
        createJournalBook = await db.financial_And_Account_Journal.create({
          posting_date: posting_date,
          journal_no: general_number,
          transaction_date: transactionDate,
          notes: notes,
          reference: reference,voucher_list_id:voucher_id,
          journal_status:'APPROVED',
          bill_number,
          financial_posting,
          employee_id,
        customer_id,
        // product_id,
         vendor_id,
         party_type,
          journal_book_status,
          reference_date: referenceDate,
          total_of_debit: req.body.totalDebit,
          total_of_credit: req.body.totalCredit,
          entity_id: entity_id,
          currency_id,vendor_id,
          party_type,
          isReversal: isReversal,
          parent_journal_no: parent_journal_no,record_payment:gross_total,total_purchase:net_amount
        },{transaction});
        if (journalDocument[0]) {
    
          for (const elem of journalDocument) {
            await db.financial_And_Account_Journal_Document.create({
              journal_id: createJournalBook.id,
              image: elem.file
            },{transaction});
          }
        }
        for (const acc of req.body.account_detail.Account_details) {
          let party_types ;
          if(!vendor_id || !customer_id){
            party_types = null
          }
          if(vendor_id){
             party_types = party_type
            
            if(acc.tds_id){
              let new_amount=0;
              const [maximumLimit] = await db.sequelize.query(`
                SELECT V.vendor_id, COALESCE(VR.amount_due, TL.maximum_amount) AS maximum_amount,VR.amount_due
FROM VENDOR_TDS_MST AS V
INNER JOIN VENDOR_BASIC_DETAILS AS VB ON VB.id = V.vendor_id
INNER JOIN TDS_LIST_MST AS TL ON TL.id = V.nature_id
LEFT JOIN PAYMENT_PROGRAM_LIST AS VR ON VR.vendor_id = VB.id
WHERE V.vendor_id=${vendor_id}`)
if(parseFloat(maximumLimit[0].maximum_amount) > totalDebit){
  new_amount = parseFloat(maximumLimit[0].maximum_amount) - totalDebit
}else{
  new_amount = 0.00
}
              const paymentdata = await db.paymentProgram.create({
                document_number:general_number, amount:totalDebit, entity_id, payment_program_status:'Approved', payment_status:'Journal Vocher', document_type:'Journal Vocher', reference_number:general_number

              })
              await db.paymentProgramList.create({
                total_amount:totalDebit, amount_due:0.00, paid_amount:totalDebit,
                tds_rate_amount:acc.tds_rate_amount, payment_program_id:paymentdata.id, vendor_id, tds_id:acc.tds_id, 
                nature_id:acc.nature_id, currency_id, currency_rate, document_no:general_number
              },{transaction})
            }
           
          }
          if(customer_id){
            party_types = 'CUSTOMER'
          }
        
          await db.financial_And_Account_Journal_List.create({
            party_type: party_types,cost_center_id:acc.cost_center_id,profit_center_id:acc.profit_center_id,
            debit_amount: acc.debit_amount,tds_rate_amount:acc.tds_rate_amount,
            credit_amount: acc.credit_amount,
            journal_id: createJournalBook.id,
            tds_rate_amount:acc.tds_rate_amount,
            tds_id:acc.tds_id,
            nature_id:acc.nature_id,
            vendor_id:vendor_id,
            chart_account_id: acc.chart_account_id,
            entity_id: entity_id,
            financial_id:financial_id,
            entry_status: 'Journal',
            customer_id:  customer_id ,
            employee_id:  employee_id ,
            tax_amount:acc.tax_amount,
            tax_rate:acc.tax_rate,
            document_number:general_number,
            currency_rate,
            currency_id,
          },{transaction});
        }
        
    await transaction.commit()
        return res.json({
          code: 200,
          message: `Journal has been ${message} successfully`,
          data: createJournalBook,
        });
      }
     
       
     
  
  }else{
 
      let createJournalBook;
      let referenceDate = moment.utc(reference_date).format('YYYY-MM-DD');
      let transactionDate = transaction_date;
    
    
      if (req.body.id) {
       
       
        const reverseExist = await db.financial_And_Account_Journal.findOne({where:{parent_journal_no:parent_journal_no},attributes:['id','journal_no','parent_journal_no']})
       
        if(reverseExist){
          return res.status(404).send({code:404,message:'This JL alreday reverse'})
        }
    
        message = 'updated'
       
   
       
        createJournalBook = await db.financial_And_Account_Journal.create({
          posting_date: posting_date,
          journal_no: general_number,
          transaction_date: transaction_date,
          notes: notes,
          reference: reference,voucher_list_id:voucher_id,
          journal_status:'APPROVED',
          bill_number,
          financial_posting,
          employee_id,
        customer_id,
         vendor_id,
         party_type,
          journal_book_status:"REVERSAL Entry",
          reference_date: reference_date,
          total_of_debit: totalDebit,
          total_of_credit: totalCredit,
          entity_id: entity_id,
          currency_id,vendor_id,
          party_type,
          isReversal: isReversal,
          parent_journal_no: parent_journal_no,
          record_payment:gross_total,total_purchase:net_amount
        }, { transaction })

        if (req.body.general_entry.journalDocument[0]) {
          for (const elem of req.body.general_entry.journalDocument) {
            await db.financial_And_Account_Journal_Document.create({
              journal_id: createJournalBook.id,
              image: elem.file
            },{transaction});
          }
        }
        for (const acc of req.body.account_detail.Account_details) {
          let party_types ;
          if(!vendor_id){
            party_types = null
          }
          if(vendor_id){
             party_types = party_type
          }
        
          await db.financial_And_Account_Journal_List.create({
            party_type: party_types,cost_center_id:acc.cost_center_id,profit_center_id:acc.profit_center_id,
            credit_amount: acc.credit_amount,tds_rate_amount:acc.tds_rate_amount,
            debit_amount: acc.debit_amount,
            journal_id: createJournalBook.id,
            tds_rate_amount:acc.tds_rate_amount,
            tds_id:acc.tds_id,
            nature_id:acc.nature_id,
            vendor_id:vendor_id,
            financial_id:financial_id,
            chart_account_id: acc.chart_account_id,
            entity_id: entity_id,
            entry_status: 'Journal',
            customer_id:  customer_id ,
            employee_id:  employee_id ,
            tax_amount:acc.tax_amount,
            tax_rate:acc.tax_rate,
            document_number:general_number,
            currency_rate,
            currency_id,
          },{transaction});
        }
    
    await transaction.commit()
        return res.json({
          code: 200,
          message: `Journal has been ${message} successfully`,
          data: createJournalBook,
        });
      } else {
       
      createJournalBook = await db.financial_And_Account_Journal.create({
        posting_date: posting_date,
        journal_no: general_number,
        transaction_date: transactionDate,
        notes: notes,
        reference: reference,voucher_list_id:voucher_id,
        journal_status:'APPROVED',
        bill_number,
        financial_posting,
        employee_id,
      customer_id,
       vendor_id,
       party_type,
        journal_book_status,
        reference_date: referenceDate,
        total_of_debit: req.body.totalDebit,
        total_of_credit: req.body.totalCredit,
        entity_id: entity_id,
        currency_id,vendor_id,
        party_type,
        isReversal: isReversal,
    record_payment:gross_total,total_purchase:net_amount
      },{transaction});
        if (journalDocument[0]) {
    
          for (const elem of journalDocument) {
            await db.financial_And_Account_Journal_Document.create({
              journal_id: createJournalBook.id,
              image: elem.file
            },{transaction});
          }
        }
     
    
      
        for (const acc of req.body.account_detail.Account_details) {
          if(!vendor_id){
            acc.tax_amount = 0
            acc.tax_rate =0
          }
          await db.financial_And_Account_Journal_List.create({
            party_type: acc.party_type,cost_center_id:acc.cost_center_id,profit_center_id:acc.profit_center_id,
            debit_amount: acc.debit_amount,tds_rate_amount:acc.tds_rate_amount,
            credit_amount: acc.credit_amount,
            journal_id: createJournalBook.id,
            tds_rate_amount:acc.tds_rate_amount,
            tds_id:acc.tds_id,
            nature_id:acc.nature_id,
            vendor_id:acc.vendor_id,
            chart_account_id: acc.chart_account_id,
            entity_id: entity_id,
            entry_status: 'Journal',
            financial_id:financial_id,
            customer_id:  acc.customer_id ,
            employee_id:  acc.employee_id ,
            tax_amount:acc.tax_amount,
            tax_rate:acc.tax_rate, document_number:general_number,
            currency_rate,
            currency_id,
          },{transaction});
        }
    
    await transaction.commit()
        return res.json({
          code: 200,
          message: `Journal has been ${message} successfully`,
          data: createJournalBook,
        });
      
   
  }
}
  
} catch (error) {
  await transaction.rollback()
    return res.status(500).send({code:500,message:error.message})
}
};
const updateFinancialAccountJournal = async (req, res) => {
  let {
    posting_date,
    journal_no,
    transaction_date,
    notes,
    reference,
    reference_date,
    total_of_debit,
    total_of_credit,voucher_id,
    bill_number,
   
    financial_posting,
    employee_id,
  customer_id,
  product_id,
   vendor_id,
   party_type,
    journal_book_status,
    // currency_id,
    accountsList,
    remaining,
    journal_status,grn_id,po_id,invoice_id
  } = req.body;


  let referenceDate = moment.utc(reference_date).format('YYYY-MM-DD');
  let transactionDate = moment.utc(transaction_date).format('YYYY-MM-DD');

  // Validation checks
  const requiredFields = [
    "posting_date",
    "journal_no",
    // "currency_id",
    // "company_id",
  ];

  for (const field of requiredFields) {
    if (req.body[field] === undefined || req.body[field] === null) {
      return res.status(400).send({
        message: `JournalBook payload is incomplete: ${field} is missing`,
        data: [],
      });
    }
  }

  const createJournalBook = await db.financial_And_Account_Journal.update(
    {
      posting_date: posting_date,
      journal_no: journal_no,
      transaction_date: transactionDate,voucher_id,
      notes: notes,
      reference: reference,
      reference_date: referenceDate,
      total_of_debit: total_of_debit,
      total_of_credit: total_of_credit,
      entity_id: entity_id,
      journal_book_status: journal_book_status,
      // currency_id: currency_id,
      bill_number,grn_id,po_id,invoice_id,
     financial_id,
      financial_posting,
      employee_id,
    customer_id,
    product_id,
     vendor_id,
     party_type,
      remaining: remaining,
      journal_status: journal_status,
    },
    { where: { id: req.params.id } }
  );

  if (createJournalBook) {
    if (journal_book_status !== "quick_entry") {
      accountsList.forEach(async (acc) => {
        if (acc?.id) {
          // Delete existing records
          let deletedItem = await db.financial_And_Account_Journal_List.destroy(
            {
              where: {
                journal_id: req.params.id,
              },
            }
          );
        }

        // Create new journal record

        await db.financial_And_Account_Journal_List.create({
          party_type: acc.party_type,
          debit_amount: acc.debit_amount,
          credit_amount: acc.credit_amount,
          journal_id: req.params.id,
          tds_id: acc.tds_id,
        nature_id: acc.nature_id,
        tds_rate_amount:acc.tds_rate_amount,
          chart_account_id: acc.chart_account_id,
          product_id: acc.party_type === "CUSTOMER" ? acc.product_id : null,
          entity_id: entity_id,
          entry_status: 'Journal',
          financial_id:financial_id
        });
      });
    } else {
      let deletedItem = await db.financial_And_Account_Journal_List.destroy(
        {
          where: {
            journal_id: req.params.id,
          },
        }
      );

      accountsList = [
        {
          quick_debit_amount: req.body.amount,
          quick_credit_amount: 0,
          amount: req.body.amount,
          chart_account_id: req.body.debit_account,
        },
        {
          quick_debit_amount: 0,
          quick_credit_amount: req.body.amount,
          amount: req.body.amount,
          chart_account_id: req.body.credit_account,
        },
      ];
      accountsList.map(async (acc) => {
        await db.financial_And_Account_Journal_List.create({
          quick_debit_amount: acc.quick_debit_amount,
          quick_credit_amount: acc.quick_credit_amount,
          amount: acc.amount,
          journal_id: req.params.id,
          chart_account_id: acc.chart_account_id,
        });
      });
    }
    return res.json({
      code: 200,
      message: "Journal has been created successfully",
      data: createJournalBook,
    });
  } else {
    return res.json({
      code: 500,
      message: "Server error",
    });
  }
};


const generate_journal_number = async (req, res) => {
  try {
    let number;
if(req.query?.page_name=='add-adjustment-voucher'){
     const lastEntry = await db.adjustmentJournal.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["id"],
    });

   
    const currentYear = new Date().getFullYear();
    if (lastEntry) {
      const lastCode = (lastEntry.id) +1;
      const newCode = `ACC-AD-${currentYear}-${lastCode}`;
      number = newCode;
    } else {
      number = `ACC-AD-${currentYear}-1`;
    }
}else{
  const lastEntry = await db.financial_And_Account_Journal.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["id"],
    });
 
    const currentYear = new Date().getFullYear();
    if (lastEntry) {
      const lastCode = (lastEntry.id) +1;
      const newCode = `ACC-JV-${currentYear}-${lastCode}`;
      number = newCode;
    } else {
      number = `ACC-JV-${currentYear}-1`;
    }
}
  
    return res.status(200).send({ code: 200, message: "Cost Center Code Generated", data: number });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
};




const getScheduledJournals = async (req, res) => {
  try {
    // const query = "SELECT f.* FROM FINANCIAL_AND_ACCOUNT_JOURNAL f JOIN FINANCIAL_AND_ACCOUNT_JOURNAL_SCHEDULE s ON f.id = s.journal_id WHERE s.status = 'ACTIVE' AND s.isDeleted = 0 AND f.isDeleted = 0"
    // const scheduledJournal = await db.sequelize.query(query, {
    //     type: db.sequelize.QueryTypes.SELECT
    // });
    const scheduledJournal = await db.financial_And_Account_Journal.findAll({
      attributes: ['id', 'parent_journal_no', 'journal_no', 'reference', 'journal_book_status', 'status'],
      where: {
        status: 'ACTIVE',
        isDeleted: 0,
      },
      include: [
        {
          model: db.financial_And_Account_Journal_Schedule,
          attributes: ['status'],
          where: {
            status: 'ACTIVE',
            isDeleted: 0,
          },
          required: true, // Ensures only journals with matching schedules are included
        },
        {
          model: db.financial_And_Account_Journal_List,
          attributes: ['chart_account_id'],
          where: {
            status: 'ACTIVE',
            isDeleted: 0,
          },
          include: [
            {
              model: db.createChartOfAccounts,
              attributes: ['account_name'],
              where: {
                status: 'ACTIVE',
                isDeleted: 0,
              },
            }
          ],
          required: true, // Ensures only journals with matching lists are included
          order: [
            ['id', 'ASC'],
          ],
        }
      ],
    });

    const flattenedschedule = await flattenschedulelist(scheduledJournal);

    if (flattenedschedule) {
      return res.status(200).send({ code: 200, message: "All scheduled journal successfully!", data: flattenedschedule });
    } else {
      return res.status(200).send({ code: 404, message: "No scheduled journal Found!!", data: [] });
    }
  } catch (error) {
  
    return res.status(500).send({ code: 500, message: "Internal Server Error" });
  }
}

const getScheduledJournalDetails = async (req, res) => {

  // let entity_id = req.params?.id;
  const journal_id = req.query.journal_id;
  if (!journal_id) {
    return res.status(400).send({ code: 400, message: "Journal ID is required" });
  }

  try {
    const scheduledJournal = await db.financial_And_Account_Journal.findOne({
      attributes: ['journal_no', 'journal_book_status'],
      where: {
        status: 'ACTIVE',
        isDeleted: 0,
        // journal_status : 'PENDING',
        id: journal_id,
        // entity_id: entity_id
      },
      include: [{
        model: db.financial_And_Account_Journal_Schedule,
        required: true,
        as: 'FINANCIAL_AND_ACCOUNT_JOURNAL_SCHEDULEs', // Update to match your association alias
        where: {
          status: 'ACTIVE',
          isDeleted: 0,
          journal_id: journal_id
        }
      }]
    });

    if (!scheduledJournal) {
      return res.status(404).send({ code: 404, message: "No scheduled journal found", data: [] });
    }

    const transformedData = scheduledJournal.FINANCIAL_AND_ACCOUNT_JOURNAL_SCHEDULEs.map(schedule => ({
      ...schedule.toJSON(),
      journal_no: scheduledJournal.journal_no,
      journal_book_status: scheduledJournal.journal_book_status
    }));

    return res.status(200).send({
      code: 200,
      message: "Scheduled journal and frequency successfully retrieved!",
      data: transformedData
    });

  } catch (error) {
    
    const errorMessage = error.message.includes('scheduledData')
      ? "Error retrieving scheduled data."
      : "Internal Server Error";

    return res.status(500).send({
      code: 500,
      message: errorMessage,
      errorDetails: error.message
    });
  }
};


const getsFinancialAccountJournal = async (req, res) => {

  let flattenedJournalBooks;
  let journalList;
  try {
    let journal_id = req.query.id;
    let status = req.query.status;
    let entity_id = req.query.entity_id;
    let journalBooks;
    let journalDocument;
    
    if (!journal_id) {
      journalBooks = await db.financial_And_Account_Journal.findAll({
        where: {
          isDeleted: false,
          status: "ACTIVE",
          journal_book_status: 'Journal',
          entity_id: entity_id
        },
        
        include: [

          {
            model: db.financial_And_Account_Journal_List,

            attributes: [
              "chart_account_id",
            ],

            order: [
              ['id', 'DESC'],
            ],
            include:
            {
              model: db.createChartOfAccounts,
              attributes: ["account_name"],
            },
            // required: true, // Ensures only journals with matching lists are included
            order: [['id', 'ASC']],

          }
        ]
        // include: [
        //   {
        //     model: db.createCompany,
        //     attributes: [
        //       "id",
        //       "code",
        //       "company_name",
        //       "email",
        //       "website",
        //       "base_currency",
        //       "foreign_currency",
        //       "country",
        //       "organization_id",
        //     ],
        //   },
        //   {
        //     model: db.quotation_currency,
        //     attributes: [
        //       "quotation_currency_id",
        //       "quotation_currency_name",
        //       "status",
        //     ],
        //   },
        // ],
      });

      // flattenedJournalBooks = journalBooks;
      flattenedJournalBooks = flattenJournalBooks(journalBooks);

    } else {
      journalBooks = await db.financial_And_Account_Journal.findOne({
        where: { id: journal_id,  status: "ACTIVE" },
        
        // include: [
        //   {
        //     model: db.createCompany,
        //     attributes: [
        //       "id",
        //       "code",
        //       "company_name",
        //       "email",
        //       "website",
        //       "base_currency",
        //       "foreign_currency",
        //       "country",
        //       "organization_id",
        //     ],
        //   },
        //   {
        //     model: db.quotation_currency,
        //     attributes: [
        //       "quotation_currency_id",
        //       "quotation_currency_name",
        //       "status",
        //     ],
        //   },
        // ],
      });


      journalList = await db.financial_And_Account_Journal_List.findAll({
        where: {
          journal_id: journalBooks.id,
          isDeleted: false,
          status: "ACTIVE",
        },
        include: [
          {
            model: db.createChartOfAccounts,
            attributes: ["id", "account_name", "account_code"],
          },
          {
            model: db.vendor_basic_details,
            attributes: ["id", "vendor_name"],
          },
          {
            model: db.user,
            attributes: ["employee_id", "first_name", "last_name"],
          },
          // {
          //   model: db.ItemMaster,
          //   attributes: [['id', 'product_id'], ['item_name', 'name']]
          // },
          {
            model:db.tdsList
          },
          {
            model:db.tds
          }
        ],
      });


      journalDocument=await db.financial_And_Account_Journal_Document.findAll({ where: { journal_id } });
    }

    if (flattenedJournalBooks) {
      flattenedJournalBooks = flattenedJournalBooks.sort((a, b) => b.id - a.id);
    }
    if (journalBooks) {
      return res.json({
        code: 200,
        message: "List of financial journal book ",
        data: flattenedJournalBooks ? flattenedJournalBooks : journalBooks,
        list: journalList,
        journalDocument:journalDocument
      });
    } else {
      return res.json({
        code: 400,
        message: "Server error",
      });
    }
  } catch (error) {
    return res.json({
      code: 500,
      message: error.message,
    });
  }
};

const deleteFinancialAccountJournal = async (req, res) => {
  try {
    let journalBooks = await db.financial_And_Account_Journal.findOne({
      where: { id: req.params.id },
    });

    if (journalBooks) {
      let updated = await db.financial_And_Account_Journal.update(
        { isDeleted: true, status: "INACTIVE" },
        { where: { id: req.params.id } }
      );

      await db.financial_And_Account_Journal_List.update(
        { isDeleted: true, status: "INACTIVE" },
        { where: { journal_id: req.params.id } }
      );
      if (!updated) {
        return res.json({
          code: 400,
          message: "Server error",
        });
      }
      return res.json({
        code: 200,
        message: "Journal book has been deleted successfully",
        data: journalBooks,
      });
    } else {
      return res.json({
        code: 400,
        message: "Server error",
      });
    }
  } catch (error) {
    return res.json({
      code: 500,
      message: "Server error",
    });
  }
};





/////////////// here code for filter journal details with company, currency, between tow date and account type

const filterJournalDetails = async (req,res)=>{
  try {
    

    let {currency_id,chart_of_account,from_date,to_date, party_type, party_type_id,financial_id}= req.body;

   
     
    let entity_id = req.params?.entity_id;
    const financialExist = await db.financial_year.findOne({where:{entity_id:entity_id,status:'ACTIVE'},attributes:['id'],order:[['id','ASC']]});

let condition='';
  
   
    condition = `JL.entity_id = ${entity_id}`;
 


// addOneDay(from_date);
if (from_date) {
  condition += ` AND FJ.posting_date >= '${addOneDay(from_date)}' `;
}
if (to_date) {  
  condition += ` AND FJ.posting_date <= '${addOneDay(to_date)}' `;
}
if (chart_of_account) {
  condition += ` AND JL.chart_account_id = ${chart_of_account} `;
}

if(party_type){
  condition += ` AND JL.party_type = '${party_type}' `;
}

if(party_type == 'EMPLOYEE' && party_type_id){
  condition += ` AND JL.employee_id = ${party_type_id}`
}

if(party_type == 'VENDOR' && party_type_id){
  condition += ` AND JL.vendor_id = ${party_type_id}`
}

if(party_type == 'CUSTOMER' && party_type_id){
  condition += ` AND JL.customer_id = ${party_type_id}`
}

  let sqlQuery = `

SELECT 
    T.*,

    SUM(T.debit_amount - T.credit_amount)
    OVER (
        ORDER BY T.createdAt ASC, T.id ASC
    ) AS row_balance

FROM (

    SELECT 
        JL.id,
        FJ.posting_date,
        JL.createdAt AS createdAt,

        COA.account_name,

        JL.debit_amount,
        JL.credit_amount,

        JL.party_type,

        CASE
            WHEN JL.party_type = 'VENDOR'
                THEN VM.vendor_name
            WHEN JL.party_type = 'CUSTOMER'
                THEN SSUM.company_name
            WHEN JL.party_type = 'EMPLOYEE'
                THEN CONCAT_WS(' ', REJ.first_name, REJ.middle_name, REJ.last_name)
            ELSE NULL
        END AS party_name,

        CONCAT_WS(
            ' ',
            REJ.first_name,
            REJ.middle_name,
            REJ.last_name
        ) AS employee_name,

        REJ.employee_code,

        FJ.journal_book_status,
        FJ.status,

        CASE
            WHEN JL.journal_id IS NOT NULL
                THEN FJ.journal_no
            ELSE JL.document_number
        END AS journal_no,

        VM.vendor_name,

        JL.entry_status,

        SSUM.company_name AS customer_name

    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL

    LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ
        ON JL.journal_id = FJ.id
        AND FJ.isDeleted = false
        AND FJ.status = 'ACTIVE'

    LEFT JOIN HRMS_REGISTERED_USER AS REJ
        ON JL.employee_id = REJ.employee_id

    LEFT JOIN CUSTOMER_PROFILE_MST AS SSUM
        ON SSUM.id = JL.customer_id

    LEFT JOIN VENDOR_BASIC_DETAILS AS VM
        ON JL.vendor_id = VM.id

    LEFT JOIN CHART_OF_ACCOUNTS AS COA
        ON JL.chart_account_id = COA.id

    WHERE
        JL.financial_id = ${financial_id}
        AND ${condition}

) AS T

ORDER BY T.id DESC

`;

  const journalDataNew = await db.sequelize.query(sqlQuery, {
  
    type: db.sequelize.QueryTypes.SELECT
});
let journalData =[];

  journalData = [...journalDataNew]



const totalDebitQuery = `
      SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
      FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
      LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id
      WHERE JL.financial_id = ${financial_id} AND
        ${condition}
    `;
    

    const totalResults = await db.sequelize.query(totalDebitQuery, {
      type: db.sequelize.QueryTypes.SELECT
    });

    const totals = totalResults[0]; 
  
    
   
 
  if(!journalData){
    return res.status(400).json({
      success:false,
      message:'Journal details does not found',
      })
  }
  return res.status(200).json(
    {
      success:true,
      message:'Journal details',
      data:journalData,
      totalSum:totals
    }
  )
  } catch (error) {
    return res.status(500).json(error.message);
  }
}



const filterTradePayableJournalDetails = async (req, res) => {
  try {

    // let formate_date = 
    let { from_date, to_date, chart_of_account, party_type, party_type_id, product_id } = req.body;

    let entity_id = req.params?.entity_id;
    let condition = '';


    condition = `
  
   JL.entity_id = ${entity_id} 
  
`;


    // addOneDay(from_date);
    if (from_date) {
      condition += ` AND JL.createdAt >= '${addOneDay(from_date)}' `;
    }
    if (to_date) {
      condition += ` AND JL.createdAt <= '${addOneDay(to_date)}' `;
    }
    if (chart_of_account) {
      condition += ` AND JL.chart_account_id = ${chart_of_account} `;
    }

    if (party_type) {
      condition += ` AND JL.party_type = '${party_type}' `;
    }


    if (party_type == 'VENDOR' && party_type_id) {
      condition += ` AND JL.vendor_id = ${party_type_id}`
    }

    if (party_type == 'CUSTOMER' && party_type_id) {
      condition += ` AND JL.customer_id = ${party_type_id}`
    }


    if (product_id) {
      condition += ` AND JL.product_id = ${product_id}`
    }



    let sqlQuery = `
  SELECT 
    FJ.id,
    SPM.name AS product_name,
    FJ.posting_date,
    JL.createdAt AS date,
    COA.account_name,
    JL.debit_amount,
    JL.credit_amount,    
    JL.party_type,
   CASE
        WHEN JL.party_type = 'VENDOR' THEN VM.vendor_name
        WHEN JL.party_type = 'CUSTOMER' THEN SSUM.business_name
        WHEN JL.party_type = 'EMPLOYEE' THEN CONCAT_WS(' ', REJ.first_name, REJ.middle_name, REJ.last_name)
        ELSE NULL
    END AS party_name,
    CONCAT_WS(' ', REJ.first_name,  REJ.middle_name, REJ.last_name) AS employee_name,  
    REJ.employee_code,  
    FJ.journal_book_status,
    FJ.status,
    FJ.journal_no,
    VM.vendor_name,JL.entry_status,
    SSUM.business_name AS customer_name
   
FROM 
    FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
LEFT JOIN 
    FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id AND FJ.isDeleted = false 
  AND FJ.status = 'ACTIVE' 
LEFT JOIN 
    HRMS_REGISTERED_USER AS REJ ON JL.employee_id = REJ.employee_id
    LEFT JOIN 
    SALES_SUPER_USER_MST AS SSUM ON SSUM.id = JL.customer_id
LEFT JOIN 
    VENDOR_BASIC_DETAILS AS VM ON JL.vendor_id = VM.id
LEFT JOIN 
    CHART_OF_ACCOUNTS AS COA ON JL.chart_account_id = COA.id
LEFT JOIN 
     SYS_PRODUCT_MASTER_MST AS SPM ON SPM.id = JL.product_id
WHERE 
    ${condition} 
    ORDER BY JL.createdAt DESC
  `;

    const journalData = await db.sequelize.query(sqlQuery, {

      type: db.sequelize.QueryTypes.SELECT
    });



    const totalDebitQuery = `
      SELECT SUM(debit_amount) AS total_debit, SUM(credit_amount) AS total_credit
      FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
      LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id
      WHERE 
        ${condition} 
    `;

    const totalResults = await db.sequelize.query(totalDebitQuery, {
      type: db.sequelize.QueryTypes.SELECT
    });

    const totals = totalResults[0];

    if (!journalData) {
      return res.status(400).json({
        success: false,
        message: 'Journal details does not found',
      })
    }
    return res.status(200).json(
      {
        success: true,
        message: 'Journal details',
        data: journalData,
        totalSum: totals
      }
    )
  } catch (error) {
    return res.status(500).json(error.message);
  }
}









module.exports = {
  addFinancialAccountJournal,
  generate_journal_number,
  getsFinancialAccountJournal,
  deleteFinancialAccountJournal,
  updateFinancialAccountJournal,
  ////// here filter journal details
  filterJournalDetails,
  filterTradePayableJournalDetails,
  getScheduledJournals,
  getScheduledJournalDetails
};

/////////// here code for set flat object
function flattenJournalBooks(journalBooks) {

  return journalBooks.map((journal) => {
    const {
      id,
      posting_date,
      journal_no,
      transaction_date,
      notes,
      reference,
      reference_date,
      total_of_debit,
      total_of_credit,
      journal_status,
      status,
      entity_id,
      // company_id,
      // currency_id,
      journal_book_status,
      FINANCIAL_AND_ACCOUNT_JOURNAL_LISTs,
      // MASTER_COMPANY,
      // quotation_currency,
      isReversal,
      parent_journal_no
    } = journal;

    return {
      id,
      posting_date,
      journal_no,
      transaction_date,
      notes,
      reference,
      reference_date,
      total_of_debit,
      total_of_credit,
      journal_book_status,
      journal_status,
      status,
      entity_id,
      // company_id,
      // currency_id,
      // Flattening createCompany fields
      isReversal,
      parent_journal_no,
      account_name: FINANCIAL_AND_ACCOUNT_JOURNAL_LISTs[0]?.CHART_OF_ACCOUNT?.account_name
      // company_id: MASTER_COMPANY.id,
      // company_code: MASTER_COMPANY.code,
      // company_name: MASTER_COMPANY.company_name,
      // company_email: MASTER_COMPANY.email,
      // company_website: MASTER_COMPANY.website,
      // company_base_currency: MASTER_COMPANY.base_currency,
      // company_foreign_currency: MASTER_COMPANY.foreign_currency,
      // company_country: MASTER_COMPANY.country,
      // company_organization_id: MASTER_COMPANY.organization_id,
      // // Flattening quotation_currency fields
      // quotation_currency_id: quotation_currency.quotation_currency_id,
      // quotation_currency_name: quotation_currency.quotation_currency_name,
      // quotation_currency_status: quotation_currency.status,
    };
  });
}

function flattenschedulelist(journalBooks) {
  return journalBooks.map((journal) => {
    const {
      id,
      parent_journal_no,
      journal_no,
      reference,
      journal_book_status,
      status,
      FINANCIAL_AND_ACCOUNT_JOURNAL_LISTs,
    } = journal;

    return {
      id,
      parent_journal_no,
      journal_no,
      reference,
      journal_book_status,
      status,
      account_name: FINANCIAL_AND_ACCOUNT_JOURNAL_LISTs[0]?.CHART_OF_ACCOUNT?.account_name
    };
  });
}


function addOneDay(dateString) {
  // Split the input date string into year, month, and day
  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are zero-indexed in JavaScript
  const day = parseInt(parts[2], 10);

  // Create a Date object
  const date = new Date(year, month, day);

  // Add one day
  date.setDate(date.getDate() + 1); // Fix: add one day

  // Format back to yyyy-mm-dd
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const newDay = String(date.getDate()).padStart(2, '0');

  return `${newYear}-${newMonth}-${newDay}`;
}
// Outputs: 2024-09-01



module.exports.getAssetByCustomerById = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const [getData] = await db.sequelize.query(`
      SELECT M.name ,SR.product_id  
FROM SALES_SUPER_USER_MST AS S
INNER JOIN SALES_REP_ASSET_MST AS SR ON SR.sales_id = S.id
INNER JOIN SYS_PRODUCT_MASTER_MST AS M ON M.id = SR.product_id
WHERE S.id = ${customer_id}
      `)
    return res.status(200).send({ code: 200, data: getData });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
}



module.exports.getAssetByVendorById = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    const [getData] = await db.sequelize.query(`
      SELECT V.id AS vendor_id
FROM VENDOR_BASIC_DETAILS AS V
WHERE V.id = ${vendor_id}
      `)
    return res.status(200).send({ code: 200, data: getData });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
}

module.exports.vendorLedgerReportByVendorId = async (req,res)=>{
  try {
    
  
    let {from_date,to_date, chart_of_account, party_type, party_type_id, product_id ,financial_id,report_type,employee_id}= req.body;
     
    const fromDate = new Date(from_date).toISOString().split("T")[0];
   
    if(fromDate && !to_date){
      from_date = fromDate
    }
    let entity_id = req.params?.entity_id;
    const financialExist = await db.financial_year.findOne({where:{entity_id:entity_id,status:'ACTIVE'},attributes:['id'],order:[['id','ASC']]});

let condition='';
let condition1 ='';
let condition2 = '';
let condition4 = '';
let condition5 = '';
let condition6 = '';
let condition7 ='';
  let condition8 ='';
  condition = `
  
  JL.entity_id = ${entity_id} 
 
`;

condition1 = ` `;
condition2 = ` `;
condition4 = ` `;
condition5 = ` `;
condition6 = ` `;


let newValue = ``;
let oldValue = ``;

if(employee_id != null ){
  newValue += `AND RU.employee_id IN (${employee_id})`
  oldValue += `RU.employee_id AS sales_rep_id,`
}


if (from_date && to_date) {
  condition += ` AND JL.createdAt BETWEEN '${addOneDay(from_date)} 00:00:00' AND '${addOneDay(to_date)} 23:59:59' `;
} else if (from_date) {
  condition += ` AND JL.createdAt >= '${(from_date)}' `;
} else if (to_date) {
  condition += ` AND JL.createdAt <= '${addOneDay(to_date)}' `;
}
if (report_type == 'trade-payable') {
  condition += ` AND (JL.chart_account_id = ${chart_of_account} OR JL.chart_account_id = 99) `;
}

else if(report_type == 'trade-receivable'){
  condition += ` AND (JL.chart_account_id = ${chart_of_account})  `;
}else if((party_type == 'CUSTOMER') && (report_type == 'customer-advance' )){
  condition += ` AND JL.customer_id = ${party_type_id} AND JL.chart_account_id = 36`
}

else if(report_type == 'bank-ledger'){
  condition += ` AND (JL.chart_account_id = ${chart_of_account}) `;
}

else{
  if(party_type != 'VENDOR'){
    condition += ` AND (JL.chart_account_id = ${chart_of_account} OR JL.chart_account_id = 36) `;
  }

}

if(party_type){
  condition += ` AND JL.party_type = '${party_type}' `;
}


if(party_type == 'VENDOR' && (party_type_id || report_type == 'vendor-ledger')){
  condition += ` AND JL.vendor_id = ${party_type_id}`
}
if((party_type == 'CUSTOMER') && (party_type_id || report_type == 'customer-ledger' )){
  condition += ` AND JL.customer_id = ${party_type_id} `
}
if(report_type == 'purchase-transaction-report' || report_type == 'vendor-ledger' || report_type == 'customer-advance'){
  condition7 +=`AND JL.financial_id=${financial_id}`
}

if(product_id){
  condition += ` AND JL.product_id = ${product_id}`
}

if (report_type == 'trade-receivable'){
  condition1 += ` GROUP BY JL.product_id, JL.customer_id`
  condition2 += `COALESCE(SUM(JL.debit_amount)) AS debit_amount,
    COALESCE(SUM(JL.credit_amount)) AS credit_amount,
    (SUM(JL.debit_amount) - SUM(JL.credit_amount)) AS balance, 
    `
}

else if (report_type == 'trade-payable'){
  condition1 += ` GROUP BY JL.product_id, JL.vendor_id `
  condition2 += `SUM(JL.debit_amount) AS debit_amount,
    SUM(JL.credit_amount) AS credit_amount,
    (SUM(JL.debit_amount) - SUM(JL.credit_amount)) AS balance, 
    `
}

else{
    condition2 += `JL.debit_amount,
    JL.credit_amount, `
}




    let sqlQuery = `
  SELECT 
    FJ.id,SSUM.id AS customer_id,
    JL.document_number,
    -- SPM.name AS product_name,
    FJ.posting_date,
    JL.createdAt AS date,${condition2}
    COA.account_name,
    MCT.customer_type_name,
   -- CONCAT(H.first_name,' ',H.last_name) AS posted_by,   
    JL.party_type,
   CASE
        WHEN JL.party_type = 'VENDOR' THEN VM.vendor_name
        WHEN JL.party_type = 'CUSTOMER' THEN SSUM.company_name
        WHEN JL.party_type = 'EMPLOYEE' THEN CONCAT_WS(' ', REJ.first_name, REJ.middle_name, REJ.last_name)
        ELSE NULL
    END AS party_name,

    CASE 
        WHEN JL.entry_status = 'Journal' THEN FJ.journal_no
        ELSE JL.document_number
        END AS journal_no,
    CONCAT_WS(' ', REJ.first_name,  REJ.middle_name, REJ.last_name) AS employee_name,  
    REJ.employee_code,  
    FJ.journal_book_status,
    FJ.status,
    VM.vendor_name,JL.entry_status,
    SSUM.company_name AS customer_name,
    SSUM.id AS customer_ref_id
   
FROM 
    FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
LEFT JOIN 
    FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id AND FJ.isDeleted = false 
  AND FJ.status = 'ACTIVE' 
LEFT JOIN 
    HRMS_REGISTERED_USER AS REJ ON JL.employee_id = REJ.employee_id
    LEFT JOIN 
    CUSTOMER_PROFILE_MST AS SSUM ON SSUM.id = JL.customer_id
    LEFT JOIN MASTER_CUSTOMER_TYPE AS MCT ON SSUM.customer_type_id = MCT.id
LEFT JOIN 
    VENDOR_BASIC_DETAILS AS VM ON JL.vendor_id = VM.id
LEFT JOIN 
    CHART_OF_ACCOUNTS AS COA ON JL.chart_account_id = COA.id
-- LEFT JOIN      SYS_PRODUCT_MASTER_MST AS SPM ON SPM.id = JL.product_id
   -- LEFT JOIN      HRMS_REGISTERED_USER AS H ON H.employee_id = JL.login_id
    
WHERE 
    ${condition} ${condition7} ${newValue} ${condition1} 
    ${condition6} ${condition8} 
  `;

  const journalData = await db.sequelize.query(sqlQuery, {
  
    type: db.sequelize.QueryTypes.SELECT
});



const totalDebitQuery = `
      SELECT  COALESCE(SUM(debit_amount), 0)  AS total_debit,
  COALESCE(SUM(credit_amount), 0) AS total_credit,JL.createdAt AS date
      FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
      LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id
      WHERE JL.financial_id = ${financial_id} AND 
        ${condition} ${condition1}
    `;

    const totalResults = await db.sequelize.query(totalDebitQuery, {
      type: db.sequelize.QueryTypes.SELECT
    });

    const totals = totalResults[0]; 
    let newTotalOfFinancialYear;
    if(financialExist?.id != financial_id){
     [newTotalOfFinancialYear] =  await db.sequelize.query(
      ` SELECT (SUM(debit_amount) - SUM(credit_amount) )AS balance
      FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
      LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id
      WHERE JL.financial_id = ${financial_id} AND
        ${condition} ${condition1}
    `
    )
     
      totals.total_credit = parseFloat((totals.total_credit ?? 0)) + Math.abs(parseFloat(newTotalOfFinancialYear[0].balance));
   
    
  }
    // const advancePayment = await db.superUser.sum('late_charges',{where:{id:party_type_id}});

  if(!journalData){
    return res.status(400).json({
      success:false,
      message:'Journal details does not found',
      })
  }
  return res.status(200).json(
    {
      success:true,
      message:'Journal details',
      data:journalData,
      totalSum:totals,
      // advancePayment:advancePayment,
    }
  )
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports.getCustomerLedgerListByCustomerId = async (req,res)=>{
  try {
    
  
    let {from_date,to_date, financial_id,chart_of_account, party_type, party_type_id, product_id ,report_type,employee_id,sales_rep_id}= req.body;
     
    const fromDate = new Date(from_date).toISOString().split("T")[0];
   
    if(fromDate && !to_date){
      from_date = fromDate
    }
    let entity_id = req.params?.entity_id;
    const financialExist = await db.financial_year.findOne({where:{entity_id:entity_id,status:'ACTIVE'},attributes:['id'],order:[['id','ASC']]});

let condition='';
let condition1 ='';
let condition2 = '';
let condition4 = '';
let condition5 = '';
let condition6 = '';
  let condition8 ='';
  let condition7 ='';
  let condition9 ='';
    condition = `
  
   JL.entity_id = ${entity_id} 
  
`;

condition1 = ` `;
condition2 = ` `;
condition4 = ` `;
condition5 = ` `;
condition6 = ` `;


let newValue = ``;
let oldValue = ``;

if(employee_id != null ){
  newValue += `AND RU.employee_id IN (${employee_id})`
  oldValue += `RU.employee_id AS sales_rep_id,`
}


if (from_date && to_date) {
  condition += ` AND JL.createdAt BETWEEN '${addOneDay(from_date)} 00:00:00' AND '${addOneDay(to_date)} 23:59:59' `;
} else if (from_date) {
  condition += ` AND JL.createdAt >= '${(from_date)}' `;
} else if (to_date) {
  condition += ` AND JL.createdAt <= '${addOneDay(to_date)}' `;
}
if (report_type == 'trade-payable') {
  condition += ` AND (JL.chart_account_id = ${chart_of_account} OR JL.chart_account_id = 99) `;
}

else if(report_type == 'trade-receivable'){
  condition += ` AND (JL.chart_account_id = ${chart_of_account})  `;
}else if((party_type == 'CUSTOMER') && (report_type == 'customer-advance' )){
  condition += ` AND JL.customer_id = ${party_type_id} AND JL.chart_account_id = 36`
}
else{
  condition += ` AND (JL.chart_account_id = ${chart_of_account} OR JL.chart_account_id = 36) `;
}

if(party_type){
  condition += ` AND JL.party_type = '${party_type}' `;
}


if(party_type == 'VENDOR' && (party_type_id || report_type == 'vendor-ledger')){
  condition += ` AND JL.vendor_id = ${party_type_id}`
}

if((party_type == 'CUSTOMER') && (party_type_id || report_type == 'customer-ledger' )){
  condition += ` AND JL.customer_id = ${party_type_id} `
}
// if((party_type == 'CUSTOMER') && (report_type == 'customer-advance' )){
//   condition += ` AND JL.customer_id = ${party_type_id}`
// }

if(report_type == 'customer-ledger'){
  condition7 +=`AND JL.financial_id=${financial_id}`
}
if(product_id){
  condition9 += ` AND JL.product_id = ${product_id}`
}

if (report_type == 'trade-receivable'){
  condition1 += ` GROUP BY JL.product_id, JL.customer_id`
  condition2 += `SUM(JL.debit_amount) AS debit_amount,
    SUM(JL.credit_amount) AS credit_amount,
    (SUM(JL.debit_amount) - SUM(JL.credit_amount)) AS balance, 
    `
}

else if (report_type == 'trade-payable'){
  condition1 += ` GROUP BY JL.product_id, JL.vendor_id `
  condition2 += `SUM(JL.debit_amount) AS debit_amount,
    SUM(JL.credit_amount) AS credit_amount,
    (SUM(JL.debit_amount) - SUM(JL.credit_amount)) AS balance, 
    `
}

else{
    condition2 += `JL.debit_amount,
    JL.credit_amount, `
}

if (report_type !== 'customer-ledger'){
  condition6 += ` ORDER BY JL.createdAt ASC`
}

if(report_type == 'customer-ledger'){
  condition8 += ` GROUP BY JL.id`
}



if(report_type == 'trade-receivable' || report_type == 'transaction-report' || report_type == 'customer-ledger'){
  condition4 += ` LEFT JOIN SALES_REP_ASSET_MST AS SR ON SSUM.id= SR.sales_id AND JL.product_id = SR.product_id 
  LEFT JOIN HRMS_REGISTERED_USER AS RU ON SR.employee_id=RU.employee_id `
  condition5 += `CONCAT(RU.first_name,' ', RU.last_name) AS sales_representative_name,`
}


    let sqlQuery = `
  SELECT 
    FJ.id,SSUM.customer_id,
    JL.document_number,
    ${condition5}
    SPM.name AS product_name, ${oldValue}
    FJ.posting_date,
    JL.createdAt AS date,
    COA.account_name,
    MCT.customer_type_name,
    CONCAT(H.first_name,' ',H.last_name) AS posted_by,  JL.credit_amount, 
    (SUM(JL.debit_amount) - SUM(JL.credit_amount)) AS balance,
    ${condition2}
    JL.party_type,
   CASE
        WHEN JL.party_type = 'VENDOR' THEN VM.vendor_name
        WHEN JL.party_type = 'CUSTOMER' THEN SSUM.business_name
        WHEN JL.party_type = 'EMPLOYEE' THEN CONCAT_WS(' ', REJ.first_name, REJ.middle_name, REJ.last_name)
        ELSE NULL
    END AS party_name,

    CASE 
        WHEN JL.entry_status = 'Journal' THEN FJ.journal_no
        ELSE JL.document_number
        END AS journal_no,
    CONCAT_WS(' ', REJ.first_name,  REJ.middle_name, REJ.last_name) AS employee_name,  
    REJ.employee_code,  
    FJ.journal_book_status,
    FJ.status,
    VM.vendor_name,JL.entry_status,
    SSUM.business_name AS customer_name,
    SSUM.customer_id AS customer_ref_id
   
FROM 
    FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
LEFT JOIN 
    FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id AND FJ.isDeleted = false 
  AND FJ.status = 'ACTIVE' 
LEFT JOIN 
    HRMS_REGISTERED_USER AS REJ ON JL.employee_id = REJ.employee_id
    LEFT JOIN 
    SALES_SUPER_USER_MST AS SSUM ON SSUM.id = JL.customer_id
    LEFT JOIN MASTER_CUSTOMER_TYPE AS MCT ON SSUM.customer_type_id = MCT.id
LEFT JOIN 
    VENDOR_BASIC_DETAILS AS VM ON JL.vendor_id = VM.id
LEFT JOIN 
    CHART_OF_ACCOUNTS AS COA ON JL.chart_account_id = COA.id
LEFT JOIN 
     SYS_PRODUCT_MASTER_MST AS SPM ON SPM.id = JL.product_id
     LEFT JOIN 
     HRMS_REGISTERED_USER AS H ON H.employee_id = JL.login_id
      ${condition4}
WHERE 
    ${condition} ${condition9} ${condition7} ${newValue} ${condition1} 
    ${condition6} ${condition8} 
  `;

  const journalDataNew = await db.sequelize.query(sqlQuery, {
  
    type: db.sequelize.QueryTypes.SELECT
});



const totalDebitQuery = `
      SELECT COALESCE(SUM(debit_amount),0) AS total_debit, COALESCE(SUM(credit_amount),0) AS total_credit,JL.createdAt AS date
      FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
      LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id
      WHERE 
        ${condition} ${condition9} ${condition1} AND  JL.financial_id =${financial_id}
    `;

    const totalResults = await db.sequelize.query(totalDebitQuery, {
      type: db.sequelize.QueryTypes.SELECT
    });

    const totals = totalResults[0]; 

    let balance=[] ;
    if(from_date && !to_date){
      [balance] = await db.sequelize.query(`
SELECT
    opening.total_debit,
    opening.total_credit,
    opening.opening_balance,
    same_day.same_day_debit,
    same_day.same_day_credit,
    (opening.opening_balance - (same_day.same_day_debit - same_day.same_day_credit)) AS closing_balance
FROM
(
  
    SELECT 
        SUM(JL.debit_amount) AS total_debit,
        SUM(JL.credit_amount) AS total_credit,
        (SUM(JL.debit_amount) - SUM(JL.credit_amount)) AS opening_balance
    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST JL
    WHERE
        JL.entity_id = ${entity_id} 
        AND JL.createdAt < '${addOneDay(from_date)}'
        AND JL.chart_account_id IN (8, 36)
        AND JL.party_type = 'CUSTOMER'
        AND JL.customer_id = ${party_type_id}
) AS opening
CROSS JOIN
(
   
    SELECT
        COALESCE(SUM(JL.debit_amount), 0) AS same_day_debit,
        COALESCE(SUM(JL.credit_amount), 0) AS same_day_credit
    FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST JL
    WHERE
        JL.entity_id = ${entity_id} 
        AND DATE(JL.createdAt) = '${addOneDay(from_date)}'
        AND JL.chart_account_id IN (8, 36)
        AND JL.party_type = 'CUSTOMER'
        AND JL.customer_id = ${party_type_id}
) AS same_day


        `)
    }


    let journalData =[];
let journalNew =[]
if(financial_id !=financialExist.id){

   [journalNew] = await db.sequelize.query(
    `  SELECT SSUM.customer_id,'Opening Balance' AS document_number,
     '01-01-2026' AS date,JL.product_id,
    COA.account_name,SPM.name AS product_name,
    MCT.customer_type_name,
    CONCAT(H.first_name,' ',H.last_name) AS posted_by,   
    (SUM(JL.debit_amount)- SUM(JL.credit_amount)) AS debit_amount,JL.credit_amount,
     (SUM(JL.debit_amount) - SUM(JL.credit_amount)) AS balance,
    JL.party_type,
    CASE
        WHEN JL.party_type = 'VENDOR' THEN VM.vendor_name
        WHEN JL.party_type = 'CUSTOMER' THEN SSUM.business_name
        WHEN JL.party_type = 'EMPLOYEE' THEN CONCAT_WS(' ', REJ.first_name, REJ.middle_name, REJ.last_name)
        ELSE NULL
    END AS party_name,
   'OP-CUST-01-2026' AS journal_no,
    CONCAT_WS(' ', REJ.first_name,  REJ.middle_name, REJ.last_name) AS employee_name,  
    REJ.employee_code,  
    FJ.journal_book_status,
    FJ.status,
    VM.vendor_name,'Opening Balance' AS entry_status,
    SSUM.business_name AS customer_name,
    SSUM.customer_id AS customer_ref_id
   
FROM 
    FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
LEFT JOIN 
    FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id AND FJ.isDeleted = false 
  AND FJ.status = 'ACTIVE' 
LEFT JOIN 
    HRMS_REGISTERED_USER AS REJ ON JL.employee_id = REJ.employee_id
    LEFT JOIN 
    SALES_SUPER_USER_MST AS SSUM ON SSUM.id = JL.customer_id
    LEFT JOIN MASTER_CUSTOMER_TYPE AS MCT ON SSUM.customer_type_id = MCT.id
LEFT JOIN 
    VENDOR_BASIC_DETAILS AS VM ON JL.vendor_id = VM.id
LEFT JOIN 
    CHART_OF_ACCOUNTS AS COA ON JL.chart_account_id = COA.id
LEFT JOIN 
     SYS_PRODUCT_MASTER_MST AS SPM ON SPM.id = JL.product_id
     LEFT JOIN 
     HRMS_REGISTERED_USER AS H ON H.employee_id = JL.login_id
WHERE 
 ${condition} ${condition9} ${newValue} ${condition1} 
    ${condition6} AND JL.financial_id=${financialExist.id}
       GROUP BY JL.customer_id,JL.product_id
`
  )
  const [totalAccountAmount] = await db.sequelize.query(
    ` SELECT (SUM(JL.debit_amount)- SUM(JL.credit_amount)) AS opening_amount
      FROM FINANCIAL_AND_ACCOUNT_JOURNAL_LIST AS JL 
      LEFT JOIN FINANCIAL_AND_ACCOUNT_JOURNAL AS FJ ON JL.journal_id = FJ.id
      WHERE 
        ${condition} ${condition9} ${condition1} AND  JL.financial_id=${financialExist.id}`
  )

  journalData = [...journalNew,...journalDataNew];
  if(!journalNew){
    balance[0].opening_balance = parseFloat((balance[0].opening_balance ?? 0)) + parseFloat(journalNew[0].debit_amount);
  }else{
    balance[0].opening_balance = parseFloat((balance[0].opening_balance ?? 0)) + parseFloat(totalAccountAmount[0].opening_amount);
  }
 
}else{
  journalData = [...journalDataNew]
}
    
    const advancePayment = await db.superUser.sum('late_charges',{where:{id:party_type_id}});


  if(!journalData){
    return res.status(400).json({
      success:false,
      message:'Journal details does not found',
      })
  }
  return res.status(200).json(
    {
      success:true,
      message:'Journal details',
      data:journalData,
      totalSum:totals,
      advancePayment:advancePayment,
      balance:balance[0]
    }
  )
  } catch (error) {
    return res.status(500).json(error.message);
  }
}