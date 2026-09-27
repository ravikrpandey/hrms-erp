const db = require('../../../models/index');
const fs = require('fs');
const path = require('path');

module.exports.createSchedule = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const {
            distance,
            trip_type,
            dispatch_date,
            delivery_date,
            modeOfTransport,
            own_vehicle_regno,
            max_load_capacity,
            isProduct,
            isItem,
            own_driver_contact,
            own_driver_license_no,
            odometerReading,
            advance_amount,
            vendor_name,
            vendor_vehicle_type,
            vendor_vehicle_number,
            vendor_vehicle_reg,
            vendor_driver_name,
            vendor_driver_contact,
            vendor_payment_term,
            vendor_amount,
            lr_number,
            lr_date,
            lr_issued_by,
            total_packages,
            total_weight,
            freight_type,
            document_name,
            upload_document,
            entity_id,
            financial_year_id,
            lr_copy,
            request_id,
            status_type,
            vehicle_category_id,
            vehicle_master_id,
            vendor_id
        } = req.body;

        // Step 1: Create trip_id
        const lastTrip = await db.scheduleTrip.findOne({ order: [["id", "DESC"]] });
        let trip_id = "TRIP" + (lastTrip ? String(lastTrip.id + 1).padStart(4, '0') : "0001");

        // Step 2: Create scheduleTrip entry
        const Schedule = await db.scheduleTrip.create({
            distance,
            trip_id,
            trip_type,
            dispatch_date,
            delivery_date,
            modeOfTransport,
            own_vehicle_regno,
            max_load_capacity,
            isProduct,
            isItem,
            own_driver_contact,
            own_driver_license_no,
            odometerReading,
            advance_amount,
            vendor_name,
            vendor_vehicle_type,
            vendor_vehicle_number,
            vendor_vehicle_reg,
            vendor_driver_name,
            vendor_driver_contact,
            vendor_payment_term,
            vendor_amount,
            lr_number,
            lr_date,
            lr_issued_by,
            total_packages,
            total_weight,
            freight_type,
            upload_document,
            entity_id,
            financial_year_id,
            lr_copy,
            transport_req_id: request_id,
            status_type,
            vehicle_category_id,
            vehicle_master_id,
            vendor_id
        }, { transaction: t });
        // await db.transportRequest.update(
        //     { status_type: 'SCHEDULED' },
        //     { where: { id: request_id }, transaction: t }
        // );


        if (Array.isArray(document_name) && document_name.length > 0) {
            for (const doc of document_name) {
                const { document_name: docName, upload_document: base64Data, file_name, mime_type } = doc;

                if (base64Data && base64Data.includes('base64')) {
                    const ext = path.extname(file_name) || '.file';
                    const filename = `file-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
                    const base64Content = base64Data.split(',')[1];
                    const savePath = path.join(__dirname, '../../../../uploaded_files', filename);

                    fs.writeFileSync(savePath, base64Content, 'base64');

                    await db.scheduleTripDocument.create({
                        trip_id: Schedule.id,
                        document_name: docName,
                        document_path: filename,
                        upload_document: filename
                    }, { transaction: t });
                }
            }
        }

        await t.commit();
        return res.status(201).json({
            code: 201,
            message: "Trip Schedule Created Successfully",
            data: Schedule
        });

    } catch (error) {
        await t.rollback();
        console.error("Error creating schedule:", error);
        return res.status(500).json({
            code: 500,
            message: error.message || "Failed to create Trip Schedule"
        });
    }
};





module.exports.getScheduledTrip = async (req, res) => {
    try {
        const { entity_id } = req.params
        const getData = await db.scheduleTrip.findAll({
            where: {
                entity_id,
                status_type: "SCHEDULED"
            },
            include: [{
                model: db.vehical_category,
                attributes: ["vehical_category_name"]
            },
            {
                model: db.vehicle_master,
                attributes: ["vehicle_number"]
            }
            ]
        })
        return res.status(200).send({ code: 200, message: "Get Data SuccessFully", getData })
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message })
    }
}


module.exports.statusChange = async (req, res) => {
    try {
        const { id } = req.params;
        const { status_type } = req.body;
        const [data] = await db.scheduleTrip.update(
            { status_type: status_type },
            { where: { id: id } }
        );

        return res.status(200).send({ code: 200, message: "Status Changed Successfully", data });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}


exports.getLiveTrips = async (req, res) => {
    try {
        const { entity_id } = req.params
        const liveTrips = await db.scheduleTrip.findAll({
            where: {
                entity_id: entity_id,
                status_type: "STARTED",
                isDeleted: false
            },
            include: [
                {
                    model: db.transportRequest
                },
                {
                    model: db.vehical_category,
                    attributes: ["vehical_category_name"],
                },
                {
                    model: db.vehicle_master,
                    attributes: ["vehicle_number", "rc_number", "max_load_capacity"],
                }
            ],
            order: [['dispatch_date', 'DESC']]
        })
        if (liveTrips.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Data SuccessFully", data: liveTrips })
        }
        return res.status(404).send({ code: 404, message: "No Data Found" })
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}



exports.getLiveTripById = async (req, res) => {
    try {
        const { id } = req.params;

        const liveTrip = await db.scheduleTrip.findOne({
            where: {
                id: id,
                isDeleted: false,
                status_type: "STARTED"
            },
            include: [
                {
                    model: db.transportRequest
                },
                {
                    model: db.vehical_category,
                    attributes: ["vehical_category_name"],
                },
                {
                    model: db.vehicle_master,
                    attributes: ["vehicle_number", "rc_number", "max_load_capacity"],
                }, {
                    model: db.vehicle_driver,
                    attributes: ["full_name", "mobile_number"],
                }
            ]
        });

        if (liveTrip) {
            return res.status(200).send({ code: 200, message: "Get Data Successfully", data: liveTrip });
        } else {
            return res.status(404).send({ code: 404, message: "No Data Found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}


exports.createExpeseInfo = async (req, res) => {
    try {
        const {
            amount,
            category,
            date,
            description,
            trip_id
        } = req.body;

        const file = req.file ? req.file.filename : null;

        const newExpense = await db.expense_trip.create({
            expense_category_id: category,
            expense_date: date,
            expense_amount: amount,
            expense_document: file,  // store uploaded filename
            expense_des: description,
            trip_id: trip_id
        });

        return res.status(200).send({
            code: 200,
            message: "Expense created successfully",
            data: newExpense
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
}

exports.getAllExpenseInfo = async (req, res) => {
    try {
        const { trip_id } = req.params;
        const expenses = await db.expense_trip.findAll({
            where: { isDeleted: false, trip_id: trip_id },
            include: [
                {
                    model: db.trip_expense_master,
                    attributes: ['expense_category'],
                },]
        });
        if (expenses.length > 0) {
            return res.status(200).send({ code: 200, message: "All expenses fetched successfully", data: expenses });
        } else {
            return res.status(404).send({ code: 404, message: "No expenses found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}


exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await db.expense_trip.update({
            isDeleted: true
        }, {
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (expense) {
            return res.status(200).send({ code: 200, message: "Expense deleted successfully" });
        }
        else {
            return res.status(404).send({ code: 404, message: "Expense not found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}

exports.getCompletedTrips = async (req, res) => {
    try {
      const { entity_id } = req.params;
  
      const results = await db.sequelize.query(
        `
     SELECT 
      ST.*, 
      VC.vehical_category_name, 
      VM.vehicle_number, 
      VM.rc_number, 
      VM.max_load_capacity
  FROM 
      SCHEDULE_TRIP AS ST
  INNER JOIN 
      TRANSPORT_REQUEST AS TR ON ST.transport_req_id = TR.id
  INNER JOIN 
      TM_VEHICAL_CATEGORY AS VC ON ST.vehicle_category_id = VC.id
  INNER JOIN 
      TM_VEHICLE_MASTER AS VM ON ST.vehicle_master_id = VM.id
  WHERE 
      ST.entity_id = :entity_id
      AND ST.status_type = 'CLOSED'
      AND ST.isDeleted = FALSE
  ORDER BY 
      ST.dispatch_date DESC;
  
      `,
        {
          replacements: { entity_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );
  
      if (results.length > 0) {
        return res.status(200).send({ code: 200, message: "Get Data Successfully", data: results });
      }
      return res.status(404).send({ code: 404, message: "No Data Found" });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
    }
  };
  module.exports.getLiveTripInfoDataById = async (req, res) => {
    try {
      const  id  = req.query.id;
      const  status  = req.query.status;
      const data = await db.scheduleTrip.findOne({
        where: {
          id: id,
          status_type: status,
        },
        include: [
          {
            model: db.scheduleTripDocument,
          },
          {
            model: db.transportRequest,
          },
          {
            model: db.vehical_category,
            attributes: ["vehical_category_name"],
          },
          {
            model: db.vehicle_master,
            attributes: ["vehicle_number", "rc_number", "max_load_capacity"],
          },
        ],
      });
      return res
        .status(200)
        .send({ code: 200, message: "Get Data SuccessFully", data });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
    }
  };
  exports.tripComplete = async (req, res) => {
    try {
      const { remarks, trip_end_km, trip_id, entity_id } = req.body;
      const file = req.file ? req.file.filename : null;
  
      const closeTrip = await db.close_trip.create({
        upload_pod: file,
        remarks,
        trip_end_km,
        trip_id,
        entity_id,
      });
      await db.scheduleTrip.update(
        { status_type: "CLOSED" },
        { where: { id: trip_id } }
      );
      return res
        .status(200)
        .send({ code: 200, message: "Trip Completed Successfully", closeTrip });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
    }
  };
  module.exports.getScheduledTripById = async (req, res) => {
    try {
      const { id,statusData } = req.query;
      const data = await db.scheduleTrip.findAll({
        where: {
          id: id,
          status_type: statusData,
        },
        include: [
          {
            model: db.scheduleTripDocument,
          },
          {
            model: db.transportRequest,
          },
          {
            model: db.vehical_category,
            attributes: ["vehical_category_name"],
          },
          {
            model: db.vehicle_master,
            attributes: ["vehicle_number", "rc_number", "max_load_capacity"],
          },
        ],
      });
      return res
        .status(200)
        .send({ code: 200, message: "Get Data SuccessFully", data });
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
    }
  };