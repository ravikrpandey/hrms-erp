const { where } = require("sequelize");
const db = require("../../../models/index");
const AutoRepeat = db.financial_And_Account_Journal_Schedule;
const moment = require('moment');


module.exports.createJournalRepeat = async (req, res) => {
  try {
      const {start_date, end_date, frequency_type, journal_id } = req.body; 

      let startDate = moment.utc(start_date).format('YYYY-MM-DD');
      let endDate = moment.utc(end_date).format('YYYY-MM-DD');
      const existingContractType = await AutoRepeat.findOne({
          where: {
              journal_id: journal_id,
              // frequency_type:frequency_type,
              isDeleted: false,
              status: 'ACTIVE'
          }
      });

      if (existingContractType) {
          // newFrequency = await autoRepeat.update({
          //     start_date: start_date,
          //     end_date: end_date,
          //     frequency_type: frequency_type,
          // }, {
          //     where: {
          //         journal_id: journal_id,
          //     }
          // });
          // return res.status(200).send({ code: 200, message: "Frequency updated", data: newFrequency });
          return res.status(409).send({ code: 500, message: "Scheduled entry for this journal already exsists !" });
      } else {
          const newFrequency = await AutoRepeat.create({
            journal_id: journal_id,
            frequency_type:frequency_type,
            start_date: startDate,
            end_date: endDate,
            scheduled_date: startDate
          });
          const current_date = new Date();
          const formattedCurrentDate = current_date.toISOString().split('T')[0];
          const newStartDate = new Date(startDate);
          // newStartDate.setDate(newStartDate.getDate() + 1);
          const formattedNewStartDate = newStartDate.toISOString().split('T')[0];
          if(formattedNewStartDate == formattedCurrentDate){
           await this.autoPostSingleFinancialAccountJournal(journal_id);
          }
          return res.status(200).send({ code: 200, message: "Frequency created", data: newFrequency });
      }
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({ code: 500, message: "Internal Server Error" });
  }
};

module.exports.autoPostSingleFinancialAccountJournal = async (req, res) => {
  const journal_id = req;
  const totalScheduleEntry = await AutoRepeat.findOne({
    where: {
      isDeleted: false,
      journal_id : journal_id,
      status: "ACTIVE",
    },
  });
  // console.log("totalScheduleEntry",totalScheduleEntry);
  if (totalScheduleEntry.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Not found scheduled",
    });
  }
    let currentDate = new Date();
    const nextDate = new Date(totalScheduleEntry.start_date);
      let journaData = await db.financial_And_Account_Journal.findOne({
        where: { id: totalScheduleEntry.journal_id },
      });
      let journaList = await db.financial_And_Account_Journal_List.findAll({
        where: { journal_id: totalScheduleEntry.journal_id },
      });
  
      let {
        transaction_date,
        notes,
        reference,
        reference_date,
        total_of_debit,
        total_of_credit,
        company_id,
        journal_book_status,
        currency_id,
        remaining,
        entity_id,
        journal_no,
      } = journaData;

      const posting_date = currentDate;
      // const journal_no = number;
      const journal_status = "APPROVED";
     
      let createJournalBook ;

      switch (totalScheduleEntry.frequency_type) {
        case "once":
          nextDate.setDate(nextDate.getDate() + 1);
          createJournalBook = await db.financial_And_Account_Journal.create({
              posting_date: posting_date,
              journal_no: journal_no,
              parent_journal_no: journal_no,
              entity_id: entity_id,
              transaction_date: transaction_date,
              notes: notes,
              reference: reference,
              journal_status,
              remaining,
              journal_book_status,
              reference_date: reference_date,
              total_of_debit: total_of_debit,
              total_of_credit: total_of_credit,
              company_id: company_id,
              currency_id: currency_id,
          });
          AutoRepeat.update({start_date: nextDate},{where:{id:totalScheduleEntry.id}})
          break;
        case "daily":
          nextDate.setDate(nextDate.getDate() + 1);
            createJournalBook = await db.financial_And_Account_Journal.create({
                posting_date: posting_date,
                journal_no: journal_no,
                parent_journal_no: journal_no,
                entity_id: entity_id,
                transaction_date: transaction_date,
                notes: notes,
                reference: reference,
                journal_status,
                remaining,
                journal_book_status,
                reference_date: reference_date,
                total_of_debit: total_of_debit,
                total_of_credit: total_of_credit,
                company_id: company_id,
                currency_id: currency_id,
            });
            AutoRepeat.update({start_date: nextDate},{where:{id:totalScheduleEntry.id}})
          break;
        case "weekly":
          nextDate.setDate(nextDate.getDate() + 7);
            createJournalBook = await db.financial_And_Account_Journal.create({
                posting_date: posting_date,
                journal_no: journal_no,
                parent_journal_no: journal_no,
                entity_id: entity_id,
                transaction_date: transaction_date,
                notes: notes,
                reference: reference,
                journal_status,
                remaining,
                journal_book_status,
                reference_date: reference_date,
                total_of_debit: total_of_debit,
                total_of_credit: total_of_credit,
                company_id: company_id,
                currency_id: currency_id,
            });
            AutoRepeat.update({start_date: nextDate},{where:{id:totalScheduleEntry.id}})
          break;
        case "monthly":
          nextDate.setDate(nextDate.getMonth() + 1);
            createJournalBook = await db.financial_And_Account_Journal.create({
                posting_date: posting_date,
                journal_no: journal_no,
                parent_journal_no: journal_no,
                entity_id: entity_id,
                transaction_date: transaction_date,
                notes: notes,
                reference: reference,
                journal_status,
                remaining,
                journal_book_status,
                reference_date: reference_date,
                total_of_debit: total_of_debit,
                total_of_credit: total_of_credit,
                company_id: company_id,
                currency_id: currency_id,
            });
            AutoRepeat.update({start_date: nextDate},{where:{id:totalScheduleEntry.id}})
          break;
        case "quarterly":
          nextDate.setDate(nextDate.getMonth() + 3);
            createJournalBook = await db.financial_And_Account_Journal.create({
                posting_date: posting_date,
                journal_no: journal_no,
                parent_journal_no: journal_no,
                entity_id: entity_id,
                transaction_date: transaction_date,
                notes: notes,
                reference: reference,
                journal_status,
                remaining,
                journal_book_status,
                reference_date: reference_date,
                total_of_debit: total_of_debit,
                total_of_credit: total_of_credit,
                company_id: company_id,
                currency_id: currency_id,
            });
            AutoRepeat.update({start_date: nextDate},{where:{id:totalScheduleEntry.id}})
          break;
        case "half-yearly":
          nextDate.setDate(nextDate.getMonth() + 6);
          createJournalBook = await db.financial_And_Account_Journal.create({
            posting_date: posting_date,
            journal_no: journal_no,
            parent_journal_no: journal_no,
            entity_id: entity_id,
            transaction_date: transaction_date,
            notes: notes,
            reference: reference,
            journal_status,
            remaining,
            journal_book_status,
            reference_date: reference_date,
            total_of_debit: total_of_debit,
            total_of_credit: total_of_credit,
            company_id: company_id,
            currency_id: currency_id,
          });
          AutoRepeat.update({start_date: nextDate},{where:{id:totalScheduleEntry.id}})
          break;
        case "yearly":
          nextDate.setDate(nextDate.getFullYear() + 1);
          createJournalBook = await db.financial_And_Account_Journal.create({
            posting_date: posting_date,
            journal_no: journal_no,
            parent_journal_no: journal_no,
            entity_id: entity_id,
            transaction_date: transaction_date,
            notes: notes,
            reference: reference,
            journal_status,
            remaining,
            journal_book_status,
            reference_date: reference_date,
            total_of_debit: total_of_debit,
            total_of_credit: total_of_credit,
            company_id: company_id,
            currency_id: currency_id,
          });
          AutoRepeat.update({start_date: nextDate},{where:{id:totalScheduleEntry.id}})
          break;
        default:
          console.log("");
          break;
      }
      if(createJournalBook){
        journaList.forEach(async (elem) => {
          const newjournaList = await db.financial_And_Account_Journal_List.create({
            journal_id: createJournalBook.id,
            party_type:elem.party_type,
            debit_amount: elem.debit_amount,
            credit_amount: elem.credit_amount,
            amount: elem.amount,
            chart_account_id: elem.chart_account_id,
            vendor_id:elem.vendor_id,
            employee_id: elem.employee_id,
          });
        })
      }
};

module.exports.autoPostFinancialAccountJournal = async (req, res) => {
  console.log("called every on 24 hours!");
  const totalScheduleEntry = await AutoRepeat.findAll({
    where: {
      isDeleted: false,
      status: "ACTIVE",
    },
  });

  // console.log("totalScheduleEntry",totalScheduleEntry);
  if (totalScheduleEntry.length === 0) {
    return
  }
  let currentDate = new Date();
  totalScheduleEntry.forEach(async (elem) => {  
    if (elem.start_date <= elem.end_date) {
      let lastEntry = "";
      lastEntry = await db.financial_And_Account_Journal.findOne({
        order: [["createdAt", "DESC"]],
        attributes: ["journal_no"],
      });

      let number;
      const currentYear = new Date().getFullYear();
    if (lastEntry) {
      const lastCode = lastEntry.journal_no;
      const parts = lastCode.split('-');
      parts[parts.length - 2] = currentYear;
      let numberPart = parseInt(parts[3], 10);
      numberPart++;
      const newNumberPart = String(numberPart).padStart(5, '0');
      const newCode = `${parts[0]}-${parts[1]}-${parts[2]}-${newNumberPart}`;
      number =  newCode;
    } else {
      number = `ACC-JV-${currentYear}-00001`;
    }
      // if (lastEntry) {
      //   const lastCode = lastEntry.journal_no;

      //   number = lastCode + 1;
      // } else {
      //   number = 100;
      // }

      const nextDate = new Date(elem.start_date);
      let journaData = [];
      let journaList = [];

      journaData = await db.financial_And_Account_Journal.findOne({
        where: { id: elem.journal_id },
      });
      journaList = await db.financial_And_Account_Journal_List.findAll({
        where: { journal_id: elem.journal_id },
      });
        
      //   let id = parseInt(req.query.id);
      let {
        // posting_date,
        // journal_no,
        transaction_date,
        notes,
        reference,
        reference_date,
        total_of_debit,
        total_of_credit,
        company_id,
        journal_book_status,
        currency_id,
        remaining,
        entity_id,
        journal_no
      } = journaData;
      posting_date = currentDate;
      // journal_no = number;
      journal_status = "APPROVED";
     
      let createJournalBook ;

      switch (elem.frequency_type) {
        case "once":
          nextDate.setDate(nextDate.getDate() + 1);
          // console.log("nextDatenextDatenextDate========>", nextDate);
          createJournalBook = await db.financial_And_Account_Journal.create({
              posting_date: posting_date,
              journal_no: journal_no,
              parent_journal_no: journal_no,
              entity_id: entity_id,
              transaction_date: transaction_date,
              notes: notes,
              reference: reference,
              journal_status,
              remaining,
              journal_book_status,
              reference_date: reference_date,
              total_of_debit: total_of_debit,
              total_of_credit: total_of_credit,
              company_id: company_id,
              currency_id: currency_id,
          });
            AutoRepeat.update({start_date: nextDate},{where:{id:elem.id}})
          break;
        case "daily":
            nextDate.setDate(nextDate.getDate() + 1);
            // console.log("nextDatenextDatenextDate========>", nextDate);
            createJournalBook = await db.financial_And_Account_Journal.create({
                posting_date: posting_date,
                journal_no: journal_no,
                parent_journal_no: journal_no,
                entity_id: entity_id,
                transaction_date: transaction_date,
                notes: notes,
                reference: reference,
                journal_status,
                remaining,
                journal_book_status,
                reference_date: reference_date,
                total_of_debit: total_of_debit,
                total_of_credit: total_of_credit,
                company_id: company_id,
                currency_id: currency_id,
            });
              AutoRepeat.update({start_date: nextDate},{where:{id:elem.id}})
          break;
        case "weekly":
            nextDate.setDate(nextDate.getDate() + 7);
            // console.log("nextDatenextDatenextDate========>", nextDate);
            createJournalBook = await db.financial_And_Account_Journal.create({
                posting_date: posting_date,
                journal_no: journal_no,
                entity_id: entity_id,
                parent_journal_no: journal_no,
                transaction_date: transaction_date,
                notes: notes,
                reference: reference,
                journal_status,
                remaining,
                journal_book_status,
                reference_date: reference_date,
                total_of_debit: total_of_debit,
                total_of_credit: total_of_credit,
                company_id: company_id,
                currency_id: currency_id,
            });
              AutoRepeat.update({start_date: nextDate},{where:{id:elem.id}})
          break;
        case "monthly":
            nextDate.setDate(nextDate.getMonth() + 1);
            // console.log("nextDatenextDatenextDate========>", nextDate);
            createJournalBook = await db.financial_And_Account_Journal.create({
                posting_date: posting_date,
                journal_no: journal_no,
                parent_journal_no: journal_no,
                entity_id: entity_id,
                transaction_date: transaction_date,
                notes: notes,
                reference: reference,
                journal_status,
                remaining,
                journal_book_status,
                reference_date: reference_date,
                total_of_debit: total_of_debit,
                total_of_credit: total_of_credit,
                company_id: company_id,
                currency_id: currency_id,
            });
              AutoRepeat.update({start_date: nextDate},{where:{id:elem.id}})
          break;
        case "quarterly":
            nextDate.setDate(nextDate.getMonth() + 3);
            // console.log("nextDatenextDatenextDate========>", nextDate);
            createJournalBook = await db.financial_And_Account_Journal.create({
                posting_date: posting_date,
                journal_no: journal_no,
                parent_journal_no: journal_no,
                entity_id: entity_id,
                transaction_date: transaction_date,
                notes: notes,
                reference: reference,
                journal_status,
                remaining,
                journal_book_status,
                reference_date: reference_date,
                total_of_debit: total_of_debit,
                total_of_credit: total_of_credit,
                company_id: company_id,
                currency_id: currency_id,
            });
              AutoRepeat.update({start_date: nextDate},{where:{id:elem.id}})
          break;
        case "half-yearly":
            nextDate.setDate(nextDate.getMonth() + 6);
            // console.log("nextDatenextDatenextDate========>", nextDate);
            createJournalBook = await db.financial_And_Account_Journal.create({
                posting_date: posting_date,
                journal_no: journal_no,
                parent_journal_no: journal_no,
                entity_id: entity_id,
                transaction_date: transaction_date,
                notes: notes,
                reference: reference,
                journal_status,
                remaining,
                journal_book_status,
                reference_date: reference_date,
                total_of_debit: total_of_debit,
                total_of_credit: total_of_credit,
                company_id: company_id,
                currency_id: currency_id,
            });
              AutoRepeat.update({start_date: nextDate},{where:{id:elem.id}})
          break;
        case "yearly":
            nextDate.setDate(nextDate.getFullYear() + 1);
            // console.log("nextDatenextDatenextDate========>", nextDate);
            createJournalBook = await db.financial_And_Account_Journal.create({
                posting_date: posting_date,
                journal_no: journal_no,
                parent_journal_no: journal_no,
                entity_id: entity_id,
                transaction_date: transaction_date,
                notes: notes,
                reference: reference,
                journal_status,
                remaining,
                journal_book_status,
                reference_date: reference_date,
                total_of_debit: total_of_debit,
                total_of_credit: total_of_credit,
                company_id: company_id,
                currency_id: currency_id,
            });
              AutoRepeat.update({start_date: nextDate},{where:{id:elem.id}})
          break;
        default:
          console.log("");
          break;
      }
      if(createJournalBook){
        journaList.forEach(async (element) => {
        const newjournaList = await db.financial_And_Account_Journal_List.create({
            journal_id: createJournalBook.id,
            party_type:element.party_type,
            debit_amount: element.debit_amount,
            credit_amount: element.credit_amount,
            amount: element.amount,
            chart_account_id: element.chart_account_id,
            vendor_id:element.vendor_id,
            employee_id: element.employee_id,
          });
        })
      }
    }
    if(elem.start_date >= elem.end_date){
      const updateJ = await db.financial_And_Account_Journal.update(
        { journal_status: 'APPROVED' },
        {
          where: {
            id: elem.journal_id,
          }
        }
      );
    }
  });
};


module.exports.deleteJournalScheduling = async (req, res) => {
  try {
    const {id} =req.params;
    await AutoRepeat.update({isDeleted:'1',status:'INACTIVE'},{where:{journal_id:id}})
    return res
      .status(200)
      .send({ code: 200, message: "Deleted Successfully!" });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};
